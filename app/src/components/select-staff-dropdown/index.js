import React from 'react'
// eslint-disable-next-line import/no-named-default
import { default as ReactSelect, components } from 'react-select'

const allOption = {
  label: 'Select all',
  value: '*',
}

const SelectStaffDropdown = props => {
  const { allowSelectAll } = props
  if (allowSelectAll) {
    return (
      <ReactSelect
        {...props}
        options={
          props.options.length === 0 ? [] : [props.allOption, ...props.options]
        }
        onChange={(selected, event) => {
          if (selected !== null && selected.length > 0) {
            if (selected[selected.length - 1].value === props.allOption.value) {
              return props.onChange([props.allOption, ...props.options])
            }
            let result = []
            if (selected.length === props.options.length) {
              if (selected.includes(props.allOption)) {
                result = selected.filter(
                  option => option.value !== props.allOption.value
                )
              } else if (event.action === 'select-option') {
                result = [props.allOption, ...props.options]
              }
              return props.onChange(result)
            }
          }

          return props.onChange(selected)
        }}
      />
    )
  }

  return <ReactSelect {...props} />
}

const Option = props => {
  const { isSelected, label } = props
  return (
    <div>
      <components.Option {...props}>
        <input type="checkbox" checked={isSelected} onChange={() => null} />{' '}
        <span>{label}</span>
      </components.Option>
    </div>
  )
}

const ValueContainer = ({ children, ...props }) => {
  const currentValues = props.getValue()
  let toBeRendered = children
  if (currentValues.some(val => val.value === allOption.value)) {
    toBeRendered = [[children[0][0]], children[1]]
  }

  return (
    <components.ValueContainer {...props}>
      {toBeRendered}
    </components.ValueContainer>
  )
}

const MultiValue = props => {
  const {
    data: { label, value },
  } = props
  let labelToBeDisplayed = `${label}, `
  if (value === allOption.value) {
    labelToBeDisplayed = 'All is selected'
  }
  return (
    <components.MultiValue {...props}>
      <span>{labelToBeDisplayed}</span>
    </components.MultiValue>
  )
}

export { SelectStaffDropdown, Option, ValueContainer, MultiValue }
