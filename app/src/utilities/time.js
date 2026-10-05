/* eslint-disable no-param-reassign */
export default function convertSecondsToHMS(d) {
  d = Number(d)
  const h = Math.floor(d / 3600)
  const m = Math.floor((d % 3600) / 60)
  const s = Math.floor((d % 3600) % 60)

  const hDisplay = h > 0 ? h + (h === 1 ? ' hour, ' : ' hours, ') : ''
  const mDisplay = m > 0 ? `${m}min, ` : ''
  const sDisplay = s > 0 ? `${s}sec` : ''
  return hDisplay + mDisplay + sDisplay
}
