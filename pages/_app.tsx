import { Fragment, useEffect } from 'react'
import Head from 'next/head'
import { WalletKitProvider } from '@gokiprotocol/walletkit'
import { DEFAULT_WALLET_PROVIDERS } from '@saberhq/use-solana'
import type { AppProps } from 'next/app'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import '../styles/main.scss'
import { NextPage } from 'next'
import { AuthProvider } from '../components/AppGlobalContext'

type NextPageWithLayout = NextPage & {
  Layout?: React.FC
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // For now a static theme, just add a state store for it and it becomes a dynamic theme switcher
  const Layout = Component.Layout || Fragment
  // console.log(router.asPath);
  useEffect(() => {
    document.documentElement.className = ''
    document.documentElement.classList.add(`theme-light`)
  }, [])

  return (
    <WalletKitProvider app={{ name: 'Molana' }} defaultNetwork='localnet' walletProviders={DEFAULT_WALLET_PROVIDERS}>
      <Head>
        <link rel='apple-touch-icon' sizes='180x180' href='/logo/icon-logo-circle.png' />
        <link rel='icon' type='image/png' sizes='16x16' href='/favicon/icon-16x16.ico' />
        <link rel='icon' type='image/png' sizes='32x32' href='/favicon/icon-32x32.ico' />
        <meta name='msapplication.TileColor' content='#e00a7f' />
        <meta name='theme-color' content='#e00a7f' />

        <meta name='robots' content='all' />
        <meta name='google' content='nositelinksearchbox' />
        <meta name='google' content='notranslate' key='notranslate' />

        <meta property='og:type' content='website' />
        <meta name='twitter:card' content='summary_large_image' />

        {/* <link rel='stylesheet' href='style.css'></link> */}
        {/* <script src='index.var.js'></script> */}
      </Head>
      <AuthProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AuthProvider>
    </WalletKitProvider>
  )
}

export default MyApp
