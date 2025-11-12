import { ReactNode } from 'react';

// Root layout that just passes through to locale layout
export default function RootLayout({
    children,
}: {
    children: ReactNode;
}) {
    return children;
}
