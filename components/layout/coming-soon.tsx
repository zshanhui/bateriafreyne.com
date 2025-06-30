import { Inter } from 'next/font/google';
import Image from 'next/image';

const inter = Inter({ subsets: ['latin'] });

export default function ComingSoon() {
  return (
    <div className={`${inter.className} flex min-h-screen w-full flex-col items-center pt-20`}>
      <div className="relative w-4/5 max-w-4xl aspect-video mb-8">
        <Image
          src="/images/port-4836016_1280.jpg"
          alt="Construction background"
          className="rounded-lg object-cover"
          priority
          fill
          sizes="(max-width: 768px) 90vw, 80vw"
        />
        <div className="absolute inset-0 bg-black/40 rounded-lg"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="mb-4 text-4xl font-bold text-white">Under Construction</h1>
          <p className="text-lg text-white">Something really great is coming soon!</p>
        </div>
      </div>
    </div>
  );
}
