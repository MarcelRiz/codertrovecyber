import React, {useEffect} from 'react'
import PropTypes from 'prop-types'
import { useSession, signOut  } from 'next-auth/client'
import {Navbar, Header, Loading} from '../components'
import Login from '../../pages/login'
import axios from 'axios'
import router from 'next/router'

export default function DefaultLayout({ children }) {
  const [session, loading] = useSession()

  useEffect(() => {    
    async function setToken() {
      const token = localStorage.getItem('auth_token');
      if (token) {
        await axios.interceptors.request.use(function (config) {
          config.headers.Authorization = 'Bearer ' + token
          return config;
        })      
      } else {
        signOut({redirect: false})
        router.push('/login')
      }
    }   

    axios.interceptors.response.use(function (config) {
      return config
    }, function (error) {
      if (error.response.status === 401) {
        signOut({redirect: false})
        localStorage.clear()
        router.push('/login')
       }
      return Promise.reject(error);
    })

    setToken() 
  }, [session])

  if(loading) {
    return (
      <Loading />
    )
  }
  
  if (!session) {
    return <Login />
  }

  return (
    <>
      <div className="container-fluid">
        <div className="row flex-xl-nowrap">
          <div className="bd-sidebar">
            <Navbar /> 
          </div>
          <main className="bd-content">
            <Header />            
            <div className="bg-secondary">{children}</div>
          </main>
        </div>
      </div>
    </>
  )
}

DefaultLayout.propTypes = {
  children: PropTypes.node.isRequired,
}