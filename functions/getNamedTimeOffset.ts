import { namedTimeOffsetLocales } from '../constants/locales/locales'

const getNamedTimeOffset = (then: number): string => {
  const elapsed = Date.now() - then

  const msPerMinute = 60 * 1000
  const msPerHour = msPerMinute * 60
  const msPerDay = msPerHour * 24
  const msPerMonth = msPerDay * 30
  const msPerYear = msPerDay * 365

  if (elapsed < msPerMinute) {
    return `${Math.floor(elapsed / 1000)} ${namedTimeOffsetLocales.seconds}`
  } else if (elapsed < msPerHour) {
    return `${Math.floor(elapsed / msPerMinute)} ${namedTimeOffsetLocales.minutes}`
  } else if (elapsed < msPerDay) {
    return `${Math.floor(elapsed / msPerHour)} ${namedTimeOffsetLocales.hours}`
  } else if (elapsed < msPerMonth) {
    return `${Math.floor(elapsed / msPerDay)} ${namedTimeOffsetLocales.days}`
  } else if (elapsed < msPerYear) {
    return `${Math.floor(elapsed / msPerMonth)} ${namedTimeOffsetLocales.months}`
  }

  return `${Math.floor(elapsed / msPerYear)} ${namedTimeOffsetLocales.years}`
}

export default getNamedTimeOffset
