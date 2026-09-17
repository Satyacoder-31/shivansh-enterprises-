-- Migration: Add weight_kg column to products table for precise Shiprocket courier rate calculations
-- Allows individual products to specify actual packaged weight (e.g., 0.2 kg for LED lamps, 18.5 kg for solar equipment)

ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS weight_kg NUMERIC(8, 2) DEFAULT 1.0;

-- Optional comment on column
COMMENT ON COLUMN public.products.weight_kg IS 'Shipping package weight in kilograms used for live Shiprocket freight calculations and dispatch AWB generation';
