/* eslint-disable arrow-body-style */
import PaymentService from '@src/services/PaymentService'
import StorageService from '@src/services/StorageService'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import UserInfoForm from './account-info-form'
import CompanyInfoForm from './company-info-form'
import DomainInfoForm from './domain-info-form'

export default function FormSignUp() {
  const [formStep, setFormStep] = useState(0)
  const [checkoutData, setCheckoutData] = useState(null)
  const router = useRouter()

  const nextFormStep = () => setFormStep(currentStep => currentStep + 1)
  const prevFormStep = () => setFormStep(currentStep => currentStep - 1)
  const setStepSignUp = step => setFormStep(step)

  useEffect(() => {
    if (!router.query?.session_id) return
    ;(async () => {
      const data = await PaymentService.getCheckoutSession(
        router.query.session_id
      )
      const paymentData = await data.json()
      if (paymentData.error) {
        router.push('/login')
        return
      }
      const formatData = {
        firstName: paymentData?.customer_details?.name
          ?.split(' ')
          ?.slice(0, -1)
          ?.join(' '),
        lastName: paymentData?.customer_details?.name
          ?.split(' ')
          ?.slice(-1)
          ?.join(' '),
        phone: paymentData?.customer_details?.phone,
        email: paymentData?.customer_details?.email,
      }
      setCheckoutData(formatData)
    })()
  }, [router.query?.session_id])

  useEffect(() => {
    const unloadCallback = () => {
      StorageService.clearSignUpInfo()
      localStorage.removeItem('file')
      localStorage.removeItem('fileName')
    }
    window.addEventListener('beforeunload', unloadCallback)
    return () => {
      unloadCallback()
      window.removeEventListener('beforeunload', unloadCallback)
    }
  }, [])

  return (
    <>
      <div className="mb-4 text-center">
        <h6 className="h3 mb-1">Sign Up</h6>
        <p className="text-muted mb-0">
          Provide your information to get started.
        </p>
      </div>
      <span className="clearfix" />
      {formStep === 0 && (
        <UserInfoForm
          nextFormStep={nextFormStep}
          defaultValues={checkoutData}
        />
      )}
      {formStep === 1 && (
        <CompanyInfoForm
          prevFormStep={prevFormStep}
          nextFormStep={nextFormStep}
          defaultValues={checkoutData}
        />
      )}
      {formStep === 2 && (
        <DomainInfoForm
          prevFormStep={prevFormStep}
          defaultValues={checkoutData}
          setStepSignUp={setStepSignUp}
        />
      )}
    </>
  )
}
