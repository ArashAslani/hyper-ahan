export function PriceBadge({
  price,
  unitLabel = "تومان",
  className = "",
}: {
  price: string;
  unitLabel?: string;
  className?: string;
}) {
  return (
    <div className={`leading-tight ${className}`}>
      <span className="text-xl font-bold text-accent md:text-2xl">{price}</span>
      <span className="mr-1 text-sm text-text-muted">{unitLabel}</span>
    </div>
  );
}
