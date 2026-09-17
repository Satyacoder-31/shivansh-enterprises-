import { NextResponse } from 'next/server';
import { getShiprocketServiceability } from '@/lib/shiprocket';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { destination_pincode, weight_kg = 1.0, cod = false } = body;

    if (!destination_pincode || !/^\d{6}$/.test(String(destination_pincode).trim())) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid 6-digit Indian delivery pincode.' },
        { status: 400 }
      );
    }

    const result = await getShiprocketServiceability(
      String(destination_pincode).trim(),
      Number(weight_kg) || 1.0,
      Boolean(cod)
    );

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Failed to check Shiprocket courier serviceability' },
      { status: 500 }
    );
  }
}
