import '../styles/globals.css'
import Head from 'next/head';
import type { AppProps } from 'next/app';
import Layout from '@scorebox/src/components/Layout';
import { ContextProvider } from '@scorebox/src/context';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>ScoreBox</title>
      </Head>
      <ContextProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ContextProvider>
    </>
  );
}
