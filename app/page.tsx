import { Carousel } from 'components/carousel';
import { ThreeItemGrid } from 'components/grid/three-items';
import ComingSoon from 'components/layout/coming-soon';
import Footer from 'components/layout/footer';

export const metadata = {
  description:
    'High-performance xbCommerce M2B (manufacturer to business) sales storefront built with Next.js and Shopify storefront apis.',
  openGraph: {
    type: 'website'
  }
};

export default function HomePage() {
  const isUnderConstruction = Boolean(process.env.UNDER_CONSTRUCTION === 'true' ? true : false)
  console.log('isUnderConstruction >> ', isUnderConstruction)

  return (
    <>
      {isUnderConstruction ? (
        <ComingSoon />
      ) : (
        <>
          <ThreeItemGrid />
          <Carousel />
          <Footer />
        </>
      )}
    </>
  );
}
