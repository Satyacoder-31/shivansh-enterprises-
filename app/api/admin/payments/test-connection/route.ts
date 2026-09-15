import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const key_id = (body.key_id || '').trim();
    const key_secret = (body.key_secret || '').trim();

    if (!key_id || !key_secret) {
      return NextResponse.json(
        { success: false, message: 'Please provide both Razorpay Key ID and Key Secret to test connection.' },
        { status: 400 }
      );
    }

    if (key_id.includes('placeholder') || key_secret.includes('placeholder')) {
      return NextResponse.json(
        { success: false, message: 'Placeholder keys detected. Please paste your genuine Razorpay Key ID and Secret.' },
        { status: 400 }
      );
    }

    // Call official Razorpay Orders API with ₹1 verification probe
    const authHeader = `Basic ${Buffer.from(`${key_id}:${key_secret}`).toString('base64')}`;
    const res = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: 100, // 1 Rupee in paise
        currency: 'INR',
        receipt: `test_probe_${Date.now().toString().slice(-6)}`,
        notes: { probe: 'Sivansh Enterprise Admin Connection Test' },
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      const errorMsg = data?.error?.description || data?.error?.reason || 'Invalid API credentials';
      return NextResponse.json(
        { success: false, message: `Razorpay rejected verification: ${errorMsg}` },
        { status: 400 }
      );
    }

    const isLive = key_id.startsWith('rzp_live_');

    return NextResponse.json({
      success: true,
      mode: isLive ? 'live' : 'test',
      message: `Connection successful! Genuine Razorpay ${isLive ? 'LIVE Production' : 'TEST Sandbox'} credentials verified. (Order probe: ${data.id})`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Failed to communicate with Razorpay API.' },
      { status: 500 }
    );
  }
}
