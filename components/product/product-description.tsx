import clsx from 'clsx';
import Price from 'components/price';
import Prose from 'components/prose';
import { Money, Product } from 'lib/shopify/types';
import { VariantSelector } from './variant-selector';

const QUOTE_MIN = 500;

export function ProductDescription({ product }: { product: Product }) {
    return (
        <>
            <div className="mb-6 flex flex-col border-b pb-6 dark:border-neutral-700">
                <h1 className="mb-2 text-3xl font-medium">{product.title}</h1>
                <DynamicPrice priceRange={product.priceRange} />
            </div>
            <VariantSelector
                options={product.options}
                variants={product.variants}
            />
            {product.descriptionHtml ? (
                <Prose
                    className="mb-6 text-sm leading-tight dark:text-white/[60%]"
                    html={product.descriptionHtml}
                />
            ) : null}
            {/* <AddToCart product={product} /> */}
            {parseFloat(product.priceRange.maxVariantPrice.amount) <
            QUOTE_MIN ? (
                <PurchaseButton />
            ) : (
                <RequestQuoteButton />
            )}
        </>
    );
}

function DynamicPrice({
    priceRange,
}: {
    priceRange: { maxVariantPrice: Money; minVariantPrice: Money };
}) {
    // console.log('price range >> ', priceRange)
    const requiresQuote =
        parseFloat(priceRange.maxVariantPrice.amount) > QUOTE_MIN;

    return (
        <>
            <div className="flex items-center gap-3">
                <div className="mr-auto w-auto rounded-full bg-blue-500 p-2 text-sm text-white">
                    <Price
                        amount={priceRange.maxVariantPrice.amount}
                        currencyCode={priceRange.maxVariantPrice.currencyCode}
                        showPriceRange={requiresQuote}
                    />
                </div>
                {requiresQuote && (
                    <p className="text-sm text-gray-500">
                        estimate price, exact price requires custom quote
                    </p>
                )}
            </div>
        </>
    );
}

function PurchaseButton() {
    const buttonClasses =
        'relative flex w-1/2 items-center justify-center rounded-full bg-blue-600 p-4 tracking-wide text-white';

    return <button className={clsx(buttonClasses)}>Purchase Direct</button>;
}

function RequestQuoteButton() {
    const buttonClasses =
        'relative flex w-1/2 items-center justify-center rounded-full bg-blue-500 p-3 tracking-wide text-white cursor-pointer';
    // const disabledClasses = 'cursor-not-allowed opacity-60 hover:opacity-60';

    return <button className={clsx(buttonClasses)}>Request Quote</button>;
}
