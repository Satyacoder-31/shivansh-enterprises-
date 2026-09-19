export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

export interface ProductStockInfo {
  status: StockStatus;
  isAvailable: boolean;
  isLowStock: boolean;
  quantity: number;
  badgeLabel: string;
  detailLabel: string;
  urgencyMessage: string | null;
}

/**
 * Evaluates the inventory level for a product and returns formatted labels and statuses.
 * - Out of Stock: in_stock === false OR stock_quantity <= 0
 * - Low Stock: in_stock === true AND 0 < stock_quantity <= 5
 * - In Stock: in_stock === true AND stock_quantity > 5 (or unconstrained default)
 */
export function getProductStockStatus(product: {
  in_stock?: boolean | null;
  stock_quantity?: number | string | null;
}): ProductStockInfo {
  const isMarkedInStock = product.in_stock !== false;
  
  let quantity = 100;
  if (product.stock_quantity !== undefined && product.stock_quantity !== null && String(product.stock_quantity).trim() !== "") {
    const parsed = parseInt(String(product.stock_quantity), 10);
    quantity = isNaN(parsed) ? (isMarkedInStock ? 100 : 0) : parsed;
  } else if (!isMarkedInStock) {
    quantity = 0;
  }

  // 1. OUT OF STOCK
  if (!isMarkedInStock || quantity <= 0) {
    return {
      status: "out_of_stock",
      isAvailable: false,
      isLowStock: false,
      quantity: 0,
      badgeLabel: "Out of Stock",
      detailLabel: "Currently Out of Stock",
      urgencyMessage: "This item is currently sold out. Contact us for next restock shipment & priority reservation.",
    };
  }

  // 2. LOW STOCK (1 to 5 units remaining)
  if (quantity <= 5) {
    return {
      status: "low_stock",
      isAvailable: true,
      isLowStock: true,
      quantity,
      badgeLabel: `Only ${quantity} left!`,
      detailLabel: `Only ${quantity} units left in stock`,
      urgencyMessage: `Hurry! Only ${quantity} ${quantity === 1 ? 'unit remains' : 'units remain'} in our warehouse. Order now to secure immediate dispatch.`,
    };
  }

  // 3. HEALTHY IN STOCK (> 5 units)
  return {
    status: "in_stock",
    isAvailable: true,
    isLowStock: false,
    quantity,
    badgeLabel: "In Stock",
    detailLabel: "Authentic Stock Available",
    urgencyMessage: null,
  };
}
