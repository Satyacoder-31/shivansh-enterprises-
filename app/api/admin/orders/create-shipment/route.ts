import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createShiprocketShipment } from '@/lib/shiprocket';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { order_id } = body;

    if (!order_id) {
      return NextResponse.json({ success: false, message: 'Order ID is required.' }, { status: 400 });
    }

    const supabase = createAdminClient();

    // 1. Fetch order details
    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .select('*')
      .eq('id', order_id)
      .single();

    if (orderErr || !order) {
      return NextResponse.json({ success: false, message: 'Order not found.' }, { status: 404 });
    }

    // 2. Parse courier from notes or default to Delhivery
    let courierName = 'Delhivery Surface';
    let courierId = 10;
    if (order.notes) {
      if (order.notes.includes('Blue Dart')) {
        courierName = 'Blue Dart Express Air';
        courierId = 1;
      } else if (order.notes.includes('DTDC')) {
        courierName = 'DTDC Premium Priority';
        courierId = 24;
      }
    }

    // 3. Determine verified shipment weight
    let shipmentWeightKg = 1.0;
    if (order.notes) {
      const weightMatch = order.notes.match(/Package Weight:\s*([0-9.]+)\s*kg/i);
      if (weightMatch && weightMatch[1]) {
        shipmentWeightKg = parseFloat(weightMatch[1]);
      }
    }

    if (shipmentWeightKg <= 1.0) {
      const { data: orderItems } = await supabase
        .from('order_items')
        .select('quantity, product_id')
        .eq('order_id', order_id);

      if (orderItems && orderItems.length > 0) {
        const prodIds = orderItems.map((i: any) => i.product_id).filter(Boolean);
        const { data: prods } = await supabase
          .from('products')
          .select('id, weight_kg')
          .in('id', prodIds);

        if (prods && prods.length > 0) {
          const wMap = new Map(prods.map((p: any) => [p.id, Number(p.weight_kg) || 1.0]));
          const computedW = orderItems.reduce((acc: number, it: any) => {
            const w = wMap.get(it.product_id) || 1.0;
            return acc + w * (it.quantity || 1);
          }, 0);
          if (computedW > 0) {
            shipmentWeightKg = Math.max(0.5, Math.round(computedW * 100) / 100);
          }
        }
      }
    }

    // 4. Call Shiprocket Shipment creation
    const shipment = await createShiprocketShipment({
      order_number: order.order_number,
      customer_name: order.customer_name,
      customer_phone: order.customer_phone,
      customer_email: order.customer_email,
      shipping_address: order.shipping_address || {
        address: 'Keshod',
        city: 'Keshod',
        state: 'Gujarat',
        pincode: '362220',
      },
      courier_id: courierId,
      courier_name: courierName,
      total: order.total,
      weight_kg: shipmentWeightKg,
    });

    if (!shipment.success) {
      throw new Error(shipment.message || 'Shiprocket shipment booking failed.');
    }

    // 4. Update order with AWB & Shipped status
    const updatedNotes = [
      order.notes || '',
      `AWB: ${shipment.awb_number} (${shipment.courier_name})`,
      `Dispatched: ${new Date().toLocaleDateString('en-IN')}`,
    ].filter(Boolean).join(' | ');

    const { data: updatedOrder, error: updateErr } = await supabase
      .from('orders')
      .update({
        order_status: 'shipped',
        notes: updatedNotes,
        updated_at: new Date().toISOString(),
      })
      .eq('id', order_id)
      .select()
      .single();

    if (updateErr) {
      console.warn('Could not update order status:', updateErr.message);
    }

    return NextResponse.json({
      success: true,
      message: `Shipment approved! AWB generated: ${shipment.awb_number}`,
      shipment: {
        awb_number: shipment.awb_number,
        courier_name: shipment.courier_name,
        shipping_label_url: shipment.shipping_label_url,
        tracking_url: shipment.tracking_url,
      },
      order: updatedOrder || order,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Failed to approve and dispatch shipment.' },
      { status: 500 }
    );
  }
}
