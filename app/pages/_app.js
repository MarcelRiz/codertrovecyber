import React, { useEffect } from 'react'
import { Provider } from 'react-redux'
import Head from 'next/head'
import '../styles/continuum.scss'
import { ToastContainer } from 'react-toastify'
import ProgressBar from '@badrap/bar-of-progress'
import Router from 'next/router'
import { config } from '@fortawesome/fontawesome-svg-core'
import { hotjar } from 'react-hotjar'
import '@fortawesome/fontawesome-svg-core/styles.css'

import store from '../src/states'
import AppInitializer from '../src/components/app-initializer'
import AppProvider from '../src/providers/app-provider'
import { ProgressBarConfig } from '../src/constants/configs'
import { SocketContext, socket } from '../src/contexts/socket-context'

config.autoAddCss = false

const progress = new ProgressBar(ProgressBarConfig)

Router.events.on('routeChangeStart', progress.start)
Router.events.on('routeChangeComplete', progress.finish)
Router.events.on('routeChangeError', progress.finish)

const { NEXT_PUBLIC_TENANT } = process.env

// Style
/* eslint-disable global-require */
switch (NEXT_PUBLIC_TENANT) {
  case 'mackay':
    import('../styles/mackay.scss')
    break
  case 'scotpac':
    import('../styles/scotpac.scss')
    break
  default:
    break
}
/* eslint-enable global-require */

// eslint-disable-next-line react/prop-types
function MyApp({ Component, pageProps }) {
  useEffect(() => {
    hotjar.initialize(process.env.NEXT_PUBLIC_HOT_JAR_ID, 6)
    hotjar.event('button-click')
  }, [])

  useEffect(() => {
    const html = document.querySelector('html')
    Router.events.on('routeChangeComplete', () => {
      setTimeout(() => {
        html.style.height = 'initial'
      }, 0)
    })
  }, [])

  return (
    <Provider store={store}>
      <Head>
        <meta name="robots" content="noindex" />
        <title>{process.env.NEXT_PUBLIC_TITLE}</title>
        <meta name="keywords" content="small business cybersecurity" />
        <meta name="title" content={`${process.env.NEXT_PUBLIC_TITLE}`} />
        <meta
          name="description"
          content={`${
            process.env.NEXT_PUBLIC_DESCRIPTION ||
            'Small Business Cybersecurity'
          }`}
        />

        {/* Icons */}
        <link
          rel="apple-touch-icon"
          sizes="57x57"
          href={`icon/${NEXT_PUBLIC_TENANT}/apple-icon-57x57.png`}
        />
        <link
          rel="apple-touch-icon"
          sizes="60x60"
          href={`icon/${NEXT_PUBLIC_TENANT}/apple-icon-60x60.png`}
        />
        <link
          rel="apple-touch-icon"
          sizes="72x72"
          href={`icon/${NEXT_PUBLIC_TENANT}/apple-icon-72x72.png`}
        />
        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href={`icon/${NEXT_PUBLIC_TENANT}/apple-icon-76x76.png`}
        />
        <link
          rel="apple-touch-icon"
          sizes="114x114"
          href={`icon/${NEXT_PUBLIC_TENANT}/apple-icon-114x114.png`}
        />
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href={`icon/${NEXT_PUBLIC_TENANT}/apple-icon-120x120.png`}
        />
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href={`icon/${NEXT_PUBLIC_TENANT}/apple-icon-144x144.png`}
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href={`icon/${NEXT_PUBLIC_TENANT}/apple-icon-152x152.png`}
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href={`icon/${NEXT_PUBLIC_TENANT}/apple-icon-180x180.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href={`icon/${NEXT_PUBLIC_TENANT}/android-icon-192x192.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href={`icon/${NEXT_PUBLIC_TENANT}/android-icon-32x32.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href={`icon/${NEXT_PUBLIC_TENANT}/favicon-icon-96x96.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href={`icon/${NEXT_PUBLIC_TENANT}/favicon-icon-16x16.png`}
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta
          name="msapplication-TileImage"
          content={`icon/${NEXT_PUBLIC_TENANT}/ms-icon-144x144.png`}
        />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <AppProvider>
        <AppInitializer>
          <SocketContext.Provider value={socket}>
            <Component {...pageProps} />
            <ToastContainer />
          </SocketContext.Provider>
        </AppInitializer>
      </AppProvider>
    </Provider>
  )
}

export default MyApp
