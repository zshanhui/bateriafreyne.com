import Footer from 'components/layout/footer';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="w-full">
        <h1>Manufacturer direct front page</h1>
        <div className="w-full py-20">{children}</div>
      </div>
      <Footer />
    </>
  );
}
