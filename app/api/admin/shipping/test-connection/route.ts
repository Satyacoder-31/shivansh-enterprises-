import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, token } = body;

    if (token) {
      // Test token with serviceability or user details
      const testRes = await fetch('https://apiv2.shiprocket.in/v1/external/courier/serviceability/?pickup_postcode=362220&delivery_postcode=362220&weight=1&cod=0', {
        headers: { 'Authorization': `Bearer ${token.trim()}` }
      });
      if (testRes.ok) {
        return NextResponse.json({ success: true, message: 'Shiprocket Bearer Token is active and authorized!' });
      } else {
        return NextResponse.json({ success: false, message: 'Bearer Token was rejected by Shiprocket. Please verify or re-generate.' });
      }
    }

    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Please provide both Shiprocket email and password.' }, { status: 400 });
    }

    const res = await fetch('https://apiv2.shiprocket.in/v1/external/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim(), password: password.trim() })
    });

    const data = await res.json();
    if (res.ok && data.token) {
      return NextResponse.json({
        success: true,
        message: `Successfully connected to Shiprocket! Authenticated as ${data.first_name || ''} (${data.email}).`,
        token: data.token
      });
    } else {
      return NextResponse.json({
        success: false,
        message: data.message || 'Invalid Shiprocket email or password. Please verify your credentials.'
      }, { status: 401 });
    }
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      message: 'Failed to reach Shiprocket API: ' + (err.message || 'Network error')
    }, { status: 500 });
  }
}
