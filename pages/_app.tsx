import type { AppProps } from 'next/app';
import { AppProvider } from '../context/AppContext';
import { Navbar } from '../components/Navbar';
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }: AppProps) {
    return (
        <AppProvider>
            <Navbar />
            <Component {...pageProps} />
        </AppProvider>
    );
}
