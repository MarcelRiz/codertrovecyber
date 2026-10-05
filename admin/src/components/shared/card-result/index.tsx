import React, {useState, useEffect} from 'react'
import Count from '../Count'

const CardResult = ({ label, value, icon, bg }) => {
  const [number, setNumber] = useState()
  useEffect(() => {
    setNumber(value)
  }, [value])
  return (
    <>
      <div className="card card-fluid mb-0 pb-3">
        <div className="card-body text-center">
          <div className="mb-3">
            <div className={`icon icon-shape icon-md  shadow-primary text-white ${bg}`}>
              <i className={icon}></i>
            </div>
          </div>
          <h5 className="h3 font-weight-bolder mb-1"><Count number={number} label='' duration={1} /></h5>
          <span className="d-block text-sm text-muted font-weight-bold">
            {label}
          </span>
        </div>
      </div>
    </>
  )
}

export default CardResult