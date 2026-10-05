/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
import UserManagments from './user-managment'
import {
  ActionItems,
  ActionStatus,
  ActionItemSource,
  CategoryActionItem,
} from './action-item'

export enum USER_ROLE_TYPE {
  client = 'client',
  staff = 'staff',
}

export const URL_REGEX =
  // eslint-disable-next-line no-useless-escape
  /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm

export {
  UserManagments,
  ActionItems,
  ActionStatus,
  ActionItemSource,
  CategoryActionItem,
}
