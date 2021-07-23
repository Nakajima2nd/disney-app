import { assoc } from 'ramda'

export const toKebabCase = (str) => {
  return str.replace(/([A-Z])/g, s => '-' + s.charAt(0).toLowerCase())
}

export const toKebabCaseObject = (obj) => {
  if (Array.isArray(obj)) {
    return obj
  }
  else {
    return Object.keys(obj).reduce((acc, cur) => {
      if (Object.prototype.toString.call(obj[cur]).slice(8, -1) === 'Array') {
        return assoc(toKebabCase(cur), obj[cur].map(row => toKebabCaseObject(row)), acc)
      }
      else {
        return assoc(toKebabCase(cur), obj[cur], acc)
      }
    }, {})
  }
}

export const toCamelCase = (str) => {
  return str.replace(/-./g, s => s.charAt(1).toUpperCase())
}

export const toCamelCaseObject = (obj) => {
  if (Array.isArray(obj)) {
    return obj
  }
  else {
    return Object.keys(obj).reduce((acc, cur) => {
      if (Object.prototype.toString.call(obj[cur]).slice(8, -1) === 'Array') {
        return assoc(toCamelCase(cur), obj[cur].map(row => toCamelCaseObject(row)), acc)
      }
      else {
        return assoc(toCamelCase(cur), obj[cur], acc)
      }
    }, {})
  }
}

export const formatDateTime = (date) => {
  if (Object.prototype.toString.call(date).slice(8, -1) === 'Date') {
    return date.toLocaleTimeString().substring(0, date.toLocaleTimeString().length - 3)
  }
  else {
    return date
  }
}