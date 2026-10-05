import React, { useCallback, useEffect, useRef } from 'react'

export default function Shape({
  ShapeClass,
  options,
  progress,
  text,
  initialAnimate,
  style,
  className,
  containerClass,
}) {
  const shape = useRef()
  const progressDiv = useRef()

  const destroy = useCallback(() => {
    if (shape.current) {
      shape.current.destroy()
      shape.current = null
    }
  }, [])

  const setProgress = useCallback(value => {
    if (shape.current) {
      shape.current.set(value)
    }
  }, [])

  const animateProgress = useCallback(value => {
    if (shape.current) {
      shape.current.animate(value / 100)
    }
  }, [])

  const setText = useCallback(txt => {
    if (txt && shape.current) {
      shape.current.setText(txt)
    }
  }, [])

  const create = useCallback(
    value => {
      if (shape.current) {
        throw new Error('ProgressBar is already created')
      }

      const container = progressDiv.current

      shape.current = new ShapeClass(container, options)

      if (initialAnimate) {
        setProgress(0)
        animateProgress(value)
      } else {
        setProgress(value)
      }

      setText(text)
    },
    [
      ShapeClass,
      animateProgress,
      initialAnimate,
      options,
      setProgress,
      setText,
      text,
    ]
  )

  useEffect(() => {
    create(progress)
    return () => {
      destroy()
    }
  }, [create, destroy, options, progress])

  useEffect(() => {
    setText(text)
  }, [setText, text])

  useEffect(() => {
    if (initialAnimate) {
      setProgress(0)
      animateProgress(progress)
    } else {
      setProgress(progress)
    }
  }, [progress, initialAnimate, setProgress, animateProgress])

  return (
    <div
      className={`${className} ${containerClass}`}
      style={style}
      ref={progressDiv}
    />
  )
}

Shape.defaultProps = {
  ShapeClass: null,
  options: {},
  progress: 0,
  text: null,
  initialAnimate: false,
  style: {},
  className: '',
  containerClass: '',
}
