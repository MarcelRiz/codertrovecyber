import React from 'react'
import ProgressBar from 'progressbar.js'
import Shape from './Shape'

export default function Line(props) {
  return (
    <Shape
      {...props}
      containerClass="progress-line"
      ShapeClass={ProgressBar.Line}
    />
  )
}
