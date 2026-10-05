import React, { memo } from 'react'
import ProgressBar from 'progressbar.js'
import Shape from './Shape'

function Circle(props) {
  return (
    <Shape
      {...props}
      containerClass="progress-cirle"
      ShapeClass={ProgressBar.Circle}
    />
  )
}

const MemmoizedCircle = memo(Circle)
export default MemmoizedCircle
