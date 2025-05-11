export interface DiscountTier {
  threshold: number;
  percentage: number;
}

export const discountTiers: DiscountTier[] = [
  { threshold: 1000, percentage: 5 },
  { threshold: 2000, percentage: 10 },
  { threshold: 3000, percentage: 15 },
  { threshold: 4000, percentage: 20 },
];

export const getDiscount = (subtotal: number): DiscountTier | null => {
  return [...discountTiers]
    .reverse()
    .find(tier => subtotal >= tier.threshold) || null;
};