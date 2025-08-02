import clsx from 'clsx';

const Price = ({
  amount,
  className,
  currencyCode = 'USD',
  currencyCodeClassName,
  showPriceRange = false
}: {
  amount: string;
  className?: string;
  currencyCode: string;
  currencyCodeClassName?: string;
  showPriceRange?: boolean;
} & React.ComponentProps<'p'>) => (
  <p suppressHydrationWarning={true} className={className}>
    {showPriceRange ? (
      <>
        {`${new Intl.NumberFormat(undefined, {
          style: 'currency',
          currency: currencyCode,
          currencyDisplay: 'narrowSymbol'
        }).format(parseFloat(amount) * 0.88)}`} to {`${new Intl.NumberFormat(undefined, {
          style: 'currency',
          currency: currencyCode,
          currencyDisplay: 'narrowSymbol'
        }).format(parseFloat(amount) * 1.12)}`}
      </>
    ) : (
      `${new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: currencyCode,
        currencyDisplay: 'narrowSymbol'
      }).format(parseFloat(amount))}`
    )}
    <span className={clsx('ml-1 inline', currencyCodeClassName)}>{`${currencyCode}`}</span>
  </p>
);

export default Price;
