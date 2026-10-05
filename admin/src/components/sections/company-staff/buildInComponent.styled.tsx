import styled from 'styled-components'
import { Select } from 'antd'

const StyledSelect = styled(Select)`
  .ant-select-selector {
    border: ${props => props.isError && '1px solid red !important'};
    height: 5vh !important;
    display: flex;
    align-items: center;
    border-radius: ${props =>
      props.isError
        ? '0.375rem 0 0 0.375rem !important'
        : '0.375rem !important'};
    padding: 0 1.4em !important;
    :hover {
      border-color: ${props => !props.isError && 'blueviolet !important'};
    }
    :focus-within {
      border-color: rgba(70, 21, 214, 0.5) !important;
      box-shadow: 0 0 2px 2px rgba(69, 21, 214, 0.26) !important;
    }
    .ant-select-selection-search-input {
      height: 100% !important;
      padding: 0 0.6em !important;
    }
    .ant-select-selection-placeholder {
      color: #4a5568;
      opacity: 0.5;
    }
  }
`
export { StyledSelect }
