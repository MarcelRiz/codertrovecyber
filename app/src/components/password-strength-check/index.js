import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from './styles.module.scss'

/**
 * Password must be 8 characters long
 * Be a combination of
 * - letter
 * - numbers
 * - Include at lease one special character @$!%*#?&
 * - min length = 8
 * @param password
 * @constructor
 */
export default function PasswordStrengthCheck({ password = '', show = false }) {
  const haveLetter = useCallback(
    () => password && password.match(/[a-zA-Z]/g),
    [password]
  )

  const haveNumber = useCallback(
    () => password && password.match(/[0-9]/g),
    [password]
  )

  const haveSymbol = useCallback(
    () => password && password.match(/[@$!%*#?&]/g),
    [password]
  )

  const have8CharsUp = useCallback(
    () => password && password.length >= 8,
    [password]
  )

  // eslint-disable-next-line react/prop-types
  const Item = ({ isValid, children }) => (
    <li className={`${isValid ? 'text-success' : 'text-danger'}`}>
      <span className="d-inline-flex pt-1" style={{ width: 28, height: 18 }}>
        <FontAwesomeIcon icon={isValid ? faCheck : faTimes} fixedWidth />
      </span>
      {children}
    </li>
  )

  return (
    <div className={`${styles['pass-checker']} ${show ? styles.active : ''}`}>
      <div style={{ fontWeight: 'bold', fontSize: 12 }} className="mt-3">
        Password must contain the following:
      </div>
      <ul className="text-left list-unstyled" style={{ fontSize: 12 }}>
        <Item isValid={haveLetter()}>
          A <b>letter</b>
        </Item>
        <Item isValid={haveNumber()}>
          A <b>number</b>
        </Item>
        <Item isValid={haveSymbol()}>
          A <b>special character</b> @$!%*#?&
        </Item>
        <Item isValid={have8CharsUp()}>
          Minimum <b>8 characters</b>
        </Item>
      </ul>
    </div>
  )
}

PasswordStrengthCheck.propTypes = {
  password: PropTypes.string,
  show: PropTypes.bool,
}

PasswordStrengthCheck.defaultProps = {
  password: '',
  show: false,
}
