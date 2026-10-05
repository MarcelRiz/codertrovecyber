import React, { useCallback, useContext, useMemo } from 'react'
import { Button, Modal } from 'react-bootstrap'
import {
  Headphones as IconHeadphones,
  Home as IconHome,
  LogOut as IconLogOut,
  Edit as IconEdit,
  Key as IconKey,
  Link as IconLink,
  Coffee as IconCoffee,
  ShoppingBag as IconShoppingBag,
  Shield,
} from 'react-feather'
import { useSelector, useDispatch } from 'react-redux'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import {
  toggleChangePasswordModal,
  toggleEditProfileModal,
  toggleProfileModal,
  toggleChangeSupportCentreModal,
} from '../../states/common'
import { logout } from '../../states/auth'
import UserService from '../../services/UserService'
import AppContext from '../../contexts/app-context'
import { USER_ROLE } from '../../constants'

export default function ModalProfile() {
  const showProfileModal = useSelector(state => state.common.showProfileModal)
  const user = useSelector(state => state?.auth?.session?.user)
  const company = user?.companies ? user?.companies[0] : {}
  const { isClient } = useContext(AppContext)

  const dispatch = useDispatch()
  const router = useRouter()
  const signOut = useCallback(() => {
    router.push('/login').then(() => {
      UserService.clearSession()
      dispatch(logout())
    })
  }, [dispatch])

  router.events.on('routeChangeStart', () => {
    dispatch(toggleProfileModal(false))
  })

  const avatar = useMemo(
    () => `${process.env.NEXT_PUBLIC_API}${company?.logo?.url}`,
    [company]
  )

  const openNewTab = useCallback(() => {
    if (user.gophishLogin) {
      navigator.clipboard.writeText(
        user.gophishLogin || 'Copy this text to clipboard'
      )
      window.open(user.gophishLogin, '_blank')
    } else {
      toast.error(
        'Your Gophish account does not exist. You need to create it first. Please contact administrator for support.'
      )
    }
  }, [user])

  return (
    <Modal
      show={showProfileModal}
      className="fixed-right"
      id="modal-profile"
      tabIndex="-1"
      role="dialog"
      aria-hidden="true"
      onHide={() => {
        dispatch(toggleProfileModal(false))
      }}
      dialogClassName="modal-vertical"
    >
      <Modal.Body>
        <div>
          <button
            type="button"
            className="close"
            aria-label="Close"
            onClick={() => {
              dispatch(toggleProfileModal(false))
            }}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="px-4">
          {company?.logo && (
            <div className="d-flex my-4">
              <div className="avatar-parent-child mx-auto">
                <img
                  alt="Avatar"
                  src={avatar}
                  style={{
                    maxHeight: 120,
                    maxWidth: 120,
                  }}
                />
              </div>
            </div>
          )}
          <div className="text-center mb-4">
            <h6 className="h5 mb-0">
              {user?.firstName} {user?.lastName}
            </h6>
            <strong className="d-block text-muted">
              {user?.companyPosition}
            </strong>
            <span className="d-block text-muted">{user?.email}</span>
            <span className="d-block text-muted">{user?.phone}</span>
          </div>
          <div className="flex-column align-items-center">
            <Button
              variant="neutral"
              className="rounded-pill btn-block btn-icon"
              onClick={() => {
                dispatch(toggleEditProfileModal(true))
              }}
            >
              <span className="btn-inner--icon">
                <IconEdit size={16} />
              </span>
              <span className="btn-inner--text">Edit Profile</span>
            </Button>
            <Button
              id="change-password-btn"
              variant="neutral"
              className="rounded-pill btn-block btn-icon ml-0"
              onClick={() => {
                dispatch(toggleChangePasswordModal(true))
              }}
            >
              <span className="btn-inner--icon">
                <IconKey size={16} />
              </span>
              <span className="btn-inner--text">Change Password</span>
            </Button>
            {isClient && (
              <Link href="/company-settings" passHref>
                <Button
                  variant="neutral"
                  className="rounded-pill btn-block btn-icon ml-0"
                >
                  <span className="btn-inner--icon">
                    <IconHome size={16} className="feather" />
                  </span>
                  <span className="btn-inner--text">Company Setting</span>
                </Button>
              </Link>
            )}
            {user?.role?.name === USER_ROLE.CLIENT && (
              <Link href="/" passHref>
                <Button
                  variant="neutral"
                  className="rounded-pill btn-block ml-0 btn-icon"
                  onClick={openNewTab}
                >
                  <span className="btn-inner--icon">
                    <IconLink size={24} className="feather" />
                  </span>
                  <span className="btn-inner--text">Phishing Tool</span>
                </Button>
              </Link>
            )}

            {user?.role?.name === USER_ROLE.CLIENT && (
              <Link href="/vulnerability-scanner" passHref>
                <Button
                  variant="neutral"
                  className="rounded-pill btn-block ml-0 btn-icon"
                >
                  <span className="btn-inner--icon">
                    <Shield size={24} className="feather" />
                  </span>
                  <span className="btn-inner--text">Vulnerability Scanner</span>
                </Button>
              </Link>
            )}

            {user?.role?.name === USER_ROLE.CLIENT && (
              <Link href="/marketplaces" passHref>
                <Button
                  variant="neutral"
                  className="rounded-pill btn-block ml-0 btn-icon"
                >
                  <span className="btn-inner--icon">
                    <IconShoppingBag size={24} className="feather" />
                  </span>
                  <span className="btn-inner--text">Marketplace</span>
                </Button>
              </Link>
            )}

            <Link href="/blogs" passHref>
              <Button
                variant="neutral"
                className="rounded-pill btn-block ml-0 btn-icon"
              >
                <span className="btn-inner--icon">
                  <IconCoffee size={24} className="feather" />
                </span>
                <span className="btn-inner--text">Resource Centre</span>
              </Button>
            </Link>

            <Link href="/" passHref>
              <Button
                variant="neutral"
                className="rounded-pill btn-block ml-0 btn-icon"
                onClick={() => {
                  dispatch(toggleChangeSupportCentreModal(true))
                }}
              >
                <span className="btn-inner--icon">
                  <IconHeadphones size={24} className="feather" />
                </span>
                <span className="btn-inner--text">Support Centre</span>
              </Button>
            </Link>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="modal-footer py-3 mt-auto">
        <Button
          className="btn-block btn-sm btn-neutral btn-icon rounded-pill"
          onClick={signOut}
        >
          <span className="btn-inner--icon">
            <IconLogOut size={24} className="feather" />
          </span>
          <span className="btn-inner--text">Sign out</span>
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
