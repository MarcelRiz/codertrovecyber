// export const PASSWORD_REGEX =
//   /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[ -/:-@\[-`{-~]).{6,64}$/
export const PASSWORD_REGEX =
  // eslint-disable-next-line no-useless-escape
  /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[ -/:-@\[-`{-~]).{6,64}$/
export const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

export const URL_REGEX =
  /^((ftp|http|https|chrome|:\/\/|\.|@){2,})?(localhost|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}|\S*:\w*@)*([a-zA-Z]|(\d{1,3}|\.){7}){1,}(\w|\.{2,}|\.[a-zA-Z]{2,3}|\/|\?|&|:\d|@|=|\/|\(.*\)|#|-|%)*$/gmu

export const URL_REGEX_SECOND =
  // eslint-disable-next-line no-useless-escape
  /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm

// eslint-disable-next-line no-useless-escape
export const URL_REGEX_THIRD =
  /^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/

export const ACTION_ITEM_STATE = {
  RESOLVED: 'resolved',
  UNRESOLVED: 'unresolved',
}

export const CUSTOM_ACTION_ITEM_SOURCE = {
  checkin: 'Check In',
  report: 'Report',
}

export const USER_ROLE = {
  CLIENT: 'Client',
  STAFF: 'Staff',
}

export const POLICY_TYPE = {
  CYBER: 'CyberSecurity',
  COMPANY: 'CompanyPolicy',
}

export const ACTION_ITEM_TYPE = {
  ASSESSMENT: 'actionItem',
  CUSTOM: 'customActionItem',
}

export const ACTION_ITEM_PRIORITY = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
  BEST_PRACTICE: 'bestPractice',
}

export const POLICY_ACKNOWLEDGE_BADGE = {
  PENDING: 'Pending',
  ACKNOWLEDGED: 'Acknowledged',
}

export const COURSE_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  ALL: 'all',
}

export const POLICY_TABS = {
  EDIT: 'edit',
  VIEW: 'view',
}
