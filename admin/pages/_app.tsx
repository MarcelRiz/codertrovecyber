import React,{ useEffect } from 'react'
import Head from 'next/head'
import '../styles/style.scss'
import { Provider as NextAuthProvider } from 'next-auth/client'
import { Provider } from 'react-redux'
import NextNprogress from 'nextjs-progressbar'
import { ToastContainer } from 'react-toastify'
import { store } from '../src/states/store'

const {NEXT_PUBLIC_TENANT} = process.env

function MyApp({ Component, pageProps }) {
  const { session } = pageProps

  useEffect(() => {
    document.querySelector('body').classList.add(NEXT_PUBLIC_TENANT || 'continuum')
  })

  return (
    <Provider store={store}>
       <Head>
        <meta name="robots" content="noindex" />
        <title>{process.env.NEXT_PUBLIC_TITLE}</title>
        <meta name="keywords" content="small business cybersecurity" />
        <meta name="title" content={`${process.env.NEXT_PUBLIC_TITLE}`} />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href={`images/icon/${NEXT_PUBLIC_TENANT}/favicon.png`}
        />
        <meta name="description" content={`${process.env.NEXT_PUBLIC_DESCRIPTION || 'Small Business Cybersecurity'}`} />
      </Head>
      <NextNprogress color="#4AA96C" options={{ showSpinner: false }} />
      <NextAuthProvider session={session}>
        <Component {...pageProps}/>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          // theme="colored"
        />
      </NextAuthProvider>
    </Provider >
  )
}

export default MyApp
