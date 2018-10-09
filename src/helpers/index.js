export function getRect({ offsetTop, offsetLeft, offsetWidth, offsetHeight }) {
  return {
    top: offsetTop,
    left: offsetLeft,
    right: offsetWidth + offsetLeft,
    bottom: offsetHeight + offsetTop,
  }
}