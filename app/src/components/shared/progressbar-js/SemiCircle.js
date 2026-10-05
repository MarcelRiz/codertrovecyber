import React from 'react'
import ProgressBar from 'progressbar.js'
import Shape from './Shape'

export default function SemiCircle(props) {
  return (
    <Shape
      {...props}
      containerClass="progress-semicircle"
      ShapeClass={ProgressBar.SemiCircle}
    />
  )
}
