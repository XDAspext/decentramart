import './globals.css';
import type { Metadata } from 'next';
export const metadata: Metadata = {title:'DecentraMart — Trade Transparently',description:'An educational decentralized marketplace and blockchain explorer'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
