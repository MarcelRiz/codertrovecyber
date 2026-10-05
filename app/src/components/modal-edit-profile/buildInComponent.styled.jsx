/* eslint-disable no-nested-ternary */
import styled from 'styled-components'
import { Select } from 'antd'
import { isEmpty } from 'lodash'

const StyledSelect = styled(Select)`
  .ant-select-selector {
    border: ${props =>
      !isEmpty(props.isError)
        ? props.isError.departmentId
          ? '1px solid red !important'
          : '1px solid #5cc9a7 !important'
        : ''};
  }
`
export { StyledSelect }
