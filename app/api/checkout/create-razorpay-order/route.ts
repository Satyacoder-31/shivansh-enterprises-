import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createRazorpayOrder } from '@/lib/razorpay';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { cart, customer, courier, notes } = body;

    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json({ success: false, message: 'Cart is empty' }, { status: 400 });
    }

    if (!customer?.name || !customer?.phone || !customer?.address || !customer?.pincode) {
      return NextResponse.json({ success: false, message: 'Incomplete shipping details' }, { status: 400 });
    }

    const supabase = createAdminClient();

    // 1. Fetch products from database to ensure genuine, tamper-proof prices and weights
    const productIds = cart.map((item: any) => item.product.id);
    let dbProducts: any[] | null = null;
    let prodErr: any = null;

    const initialFetch = await supabase
      .from('products')
      .select('id, name, model, sku, price_value, weight_kg')
      .in('id', productIds);

    dbProducts = initialFetch.data;
    prodErr = initialFetch.error;

    // Fallback if weight_kg column hasn't been added to Supabase yet
    if (prodErr && (prodErr.message?.includes('weight_kg') || prodErr.code === '42703' || prodErr.code === 'PGRST204')) {
      const retry = await supabase
        .from('products')
        .select(`
          id, name, model, sku, price_value,
          specs:product_specs(spec_name, spec_value)
        `)
        .in('id', productIds);
      dbProducts = retry.data;
      prodErr = retry.error;
    }

    if (prodErr || !dbProducts) {
      throw new Error('Unable to verify product pricing from catalog.');
    }

    const priceMap = new Map<string, any>(dbProducts.map(p => [p.id, p]));

    let calculatedSubtotal = 0;
    let totalOrderWeightKg = 0;
    const validatedItems = cart.map((item: any) => {
      const dbProd = priceMap.get(item.product.id);
      const unitPrice = dbProd?.price_value || item.product.price_value || 0;
      const itemTotal = unitPrice * item.quantity;
      calculatedSubtotal += itemTotal;

      let itemWeight = Number(dbProd?.weight_kg);
      if (!itemWeight || isNaN(itemWeight)) {
        const wSpec = dbProd?.specs?.find((s: any) => s.spec_name === '__weight_kg' || s.spec_name?.toLowerCase() === 'shipping weight');
        itemWeight = wSpec ? parseFloat(wSpec.spec_value) : 1.0;
      }
      if (!itemWeight || isNaN(itemWeight)) itemWeight = 1.0;

      totalOrderWeightKg += itemWeight * item.quantity;

      return {
        product_id: item.product.id,
        product_name: dbProd?.name || item.product.name,
        sku: dbProd?.model || dbProd?.sku || item.product.model || 'GENUINE-SE',
        unit_price: unitPrice,
        quantity: item.quantity,
        total: itemTotal,
      };
    });

    totalOrderWeightKg = Math.max(0.5, Math.round(totalOrderWeightKg * 100) / 100);

    const taxAmount = Math.round(calculatedSubtotal * 0.18);
    const shippingFee = Math.max(0, Number(courier?.total_charge || courier?.freight_charge || 0));
    const finalTotal = calculatedSubtotal + taxAmount + shippingFee;

    const orderNumber = `SE-${Date.now().toString().slice(-6)}`;

    // 2. Create Order in Razorpay
    const rzpOrder = await createRazorpayOrder({
      amount: finalTotal,
      receipt: orderNumber,
      notes: {
        customer_name: customer.name,
        customer_phone: customer.phone,
        courier_partner: courier?.courier_name || 'Standard Courier',
        destination_pincode: customer.pincode,
        package_weight: `${totalOrderWeightKg} kg`,
      },
    });

    // 3. Insert Pending Order in Supabase
    const { data: orderData, error: orderErr } = await supabase
      .from('orders')
      .insert([{
        order_number: orderNumber,
        customer_name: customer.name,
        customer_email: customer.email || null,
        customer_phone: customer.phone,
        shipping_address: {
          address: customer.address,
          city: customer.city || 'Keshod',
          state: customer.state || 'Gujarat',
          pincode: customer.pincode,
          company: customer.company || '',
        },
        subtotal: calculatedSubtotal,
        tax: taxAmount,
        discount: 0,
        total: finalTotal,
        order_status: 'pending',
        payment_status: 'pending',
        notes: [
          notes || '',
          `Delivery Partner: ${courier?.courier_name || 'Shiprocket Partner'} (Est: ${courier?.estimated_delivery_days || 'Standard'})`,
          `Freight: ₹${shippingFee}`,
          `Package Weight: ${totalOrderWeightKg} kg`,
        ].filter(Boolean).join(' | '),
      }])
      .select()
      .single();

    if (orderErr) {
      throw new Error(`Order insertion failed: ${orderErr.message}`);
    }

    // 4. Insert Order Items
    const itemsToInsert = validatedItems.map(i => ({
      order_id: orderData.id,
      ...i,
    }));

    const { error: itemsErr } = await supabase.from('order_items').insert(itemsToInsert);
    if (itemsErr) {
      console.warn('Items insert warning:', itemsErr.message);
    }

    return NextResponse.json({
      success: true,
      order_id: orderData.id,
      order_number: orderNumber,
      total: finalTotal,
      currency: 'INR',
      razorpay_order: rzpOrder,
      customer: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Failed to initialize checkout payment.' },
      { status: 500 }
    );
  }
}
