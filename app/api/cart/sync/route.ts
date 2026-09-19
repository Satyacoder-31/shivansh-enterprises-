import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

function attachWeightToProduct(product: any): any {
  if (!product) return product;

  // 1. Check if an explicit weight was stored in product_specs (__weight_kg or "shipping weight")
  if (product.specs && Array.isArray(product.specs)) {
    const wSpec = product.specs.find((s: any) => 
      s.spec_name === '__weight_kg' || s.spec_name?.toLowerCase() === 'shipping weight'
    );
    if (wSpec && wSpec.spec_value) {
      const parsed = parseFloat(wSpec.spec_value);
      if (!isNaN(parsed) && parsed > 0) {
        product.weight_kg = parsed;
        return product;
      }
    }
  }

  if (product.weight_kg !== undefined && product.weight_kg !== null && Number(product.weight_kg) > 0) {
    product.weight_kg = Number(product.weight_kg);
    return product;
  }

  product.weight_kg = 1.0;
  return product;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { ids } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ success: true, products: [] });
    }

    const supabase = createAdminClient();
    const { data: prods, error } = await supabase
      .from('products')
      .select(`
        id, name, model, brand, price_value, sale_price, mrp, price_display, purchase_mode, in_stock, stock_quantity, main_image,
        specs:product_specs(spec_name, spec_value)
      `)
      .in('id', ids);

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    const normalized = (prods || []).map(attachWeightToProduct);

    return NextResponse.json({
      success: true,
      products: normalized,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Cart synchronization failed' },
      { status: 500 }
    );
  }
}
