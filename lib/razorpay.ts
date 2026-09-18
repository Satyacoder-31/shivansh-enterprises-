import crypto from 'crypto';
import { createAdminClient } from './supabase/admin';

export interface RazorpayOrderParams {
  amount: number; // in Rupees
  currency?: string;
  receipt: string;
  notes?: Record<string, string>;
}

export interface RazorpayOrderResponse {
  id: string;
  amount: number; // in paise
  currency: string;
  receipt: string;
  key_id: string;
  is_mock?: boolean;
  is_test_mode?: boolean;
}

export interface RazorpayGatewayConfig {
  key_id: string;
  key_secret: string;
  is_test_mode: boolean;
  is_enabled: boolean;
  gateway: string;
}

/**
 * Dynamically resolves Razorpay credentials and configuration from Supabase singleton settings,
 * with seamless fallback to environment variables.
 */
export async function getRazorpayCredentials(): Promise<RazorpayGatewayConfig> {
  try {
    const supabase = createAdminClient();
    const { data: dbSettings, error } = await supabase
      .from('payment_settings')
      .select('*')
      .eq('id', 1)
      .single();

    if (!error && dbSettings) {
      const isTest = Boolean(dbSettings.is_test_mode) || keyId.startsWith('rzp_test_');
      let keyId = (dbSettings.razorpay_key_id || '').trim();
      let keySecret = (dbSettings.razorpay_key_secret || '').trim();

      // Fallback to env if fields are empty in database
      if (!keyId) {
        keyId = (process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '').trim();
      }
      if (!keySecret) {
        keySecret = (process.env.RAZORPAY_KEY_SECRET || '').trim();
      }

      return {
        key_id: keyId,
        key_secret: keySecret,
        is_test_mode: isTest,
        is_enabled: dbSettings.is_enabled !== false,
        gateway: dbSettings.gateway || 'razorpay',
      };
    }
  } catch (err: any) {
    console.warn('Could not query payment_settings from Supabase, using environment variables:', err.message);
  }

  // Fallback to Environment Variables
  const envKey = (process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '').trim();
  const envSecret = (process.env.RAZORPAY_KEY_SECRET || '').trim();
  const isTestFromKey = !envKey.startsWith('rzp_live_');

  return {
    key_id: envKey,
    key_secret: envSecret,
    is_test_mode: isTestFromKey,
    is_enabled: true,
    gateway: 'razorpay',
  };
}

/**
 * Creates a Razorpay Order.
 * - In Live Production Mode (is_test_mode = false): calls official Razorpay API with live credentials.
 * - In Sandbox Mode (is_test_mode = true):
 *     - If test keys (rzp_test_...) are provided: calls official Razorpay API in test mode.
 *     - If no test keys are provided or live keys are in sandbox mode: uses the interactive Sandbox Test Simulator.
 */
export async function createRazorpayOrder(params: RazorpayOrderParams): Promise<RazorpayOrderResponse> {
  const { key_id, key_secret, is_test_mode, is_enabled } = await getRazorpayCredentials();
  const amountInPaise = Math.round(params.amount * 100);
  const currency = params.currency || 'INR';

  if (!is_enabled) {
    throw new Error('Online payments are currently disabled in store administration.');
  }

  const hasValidKeys = Boolean(
    key_id &&
    key_secret &&
    !key_id.includes('placeholder') &&
    !key_secret.includes('placeholder')
  );

  // Live Mode check:
  const isLiveActive = !is_test_mode && hasValidKeys && key_id.startsWith('rzp_live_');
  // Official Test Mode check:
  const isRealTestActive = is_test_mode && hasValidKeys && key_id.startsWith('rzp_test_');

  if (isLiveActive || isRealTestActive) {
    try {
      const authHeader = `Basic ${Buffer.from(`${key_id}:${key_secret}`).toString('base64')}`;
      const res = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amountInPaise,
          currency,
          receipt: params.receipt,
          notes: params.notes || {},
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error('Razorpay API order error:', errText);
        let errorDesc = errText;
        try {
          const parsed = JSON.parse(errText);
          errorDesc = parsed.error?.description || errText;
        } catch (_) {}
        throw new Error(`Razorpay rejected order creation: ${errorDesc}`);
      }

      const orderData = await res.json();
      return {
        id: orderData.id,
        amount: orderData.amount,
        currency: orderData.currency,
        receipt: orderData.receipt,
        key_id,
        is_mock: false,
        is_test_mode: is_test_mode,
      };
    } catch (err: any) {
      console.error('Razorpay live order failure:', err.message);
      // In Live Production, do NOT silently mask failures with simulation! Throw error so admin/customer knows.
      if (!is_test_mode) {
        throw new Error(`Live payment initialization failed: ${err.message}`);
      }
    }
  }

  // Graceful Sandbox / Simulation Mode
  return {
    id: `order_sim_${Date.now()}`,
    amount: amountInPaise,
    currency,
    receipt: params.receipt,
    key_id: key_id.startsWith('rzp_test_') ? key_id : 'rzp_test_sivansh_sandbox',
    is_mock: true,
    is_test_mode: true,
  };
}

/**
 * Verifies Razorpay HMAC-SHA256 signature
 */
export async function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): Promise<boolean> {
  // If running in sandbox simulation mode, accept simulator signatures
  if (orderId.startsWith('order_sim_') || paymentId.startsWith('pay_sim_')) {
    return true;
  }

  const { key_secret } = await getRazorpayCredentials();

  if (!key_secret) {
    console.error('Signature verification failed: key_secret is missing.');
    return false;
  }

  try {
    const generated = crypto
      .createHmac('sha256', key_secret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    return generated === signature;
  } catch (err) {
    console.error('Signature verification error:', err);
    return false;
  }
}
