import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { verifyRazorpaySignature } from '@/lib/razorpay';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { order_id, razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!order_id || !razorpay_payment_id) {
      return NextResponse.json({ success: false, message: 'Missing payment confirmation parameters.' }, { status: 400 });
    }

    // 1. Verify HMAC Signature
    const isValid = await verifyRazorpaySignature(
      razorpay_order_id || '',
      razorpay_payment_id || '',
      razorpay_signature || ''
    );

    if (!isValid) {
      return NextResponse.json(
        { success: false, message: 'Cryptographic payment signature verification failed.' },
        { status: 400 }
      );
    }

    // 2. Mark order as paid in Supabase
    const supabase = createAdminClient();
    const { data: updatedOrder, error: updateErr } = await supabase
      .from('orders')
      .update({
        payment_status: 'paid',
        payment_id: razorpay_payment_id,
        order_status: 'processing', // Paid & ready for admin packaging/approval
        updated_at: new Date().toISOString(),
      })
      .eq('id', order_id)
      .select()
      .single();

    if (updateErr) {
      throw new Error(`Failed to update order status: ${updateErr.message}`);
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified and confirmed successfully.',
      order: updatedOrder,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Payment verification failed.' },
      { status: 500 }
    );
  }
}
