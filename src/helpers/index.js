/**
 * returns object with coordinates of element
 * @param offsetTop: Number
 * @param offsetLeft: Number
 * @param offsetWidth: Number
 * @param offsetHeight: Number
 * @returns {{top: Number, left: Number, right: Number, bottom: Number}}
 */
export function getRect ({ offsetTop, offsetLeft, offsetWidth, offsetHeight }) {
  return {
    top: offsetTop,
    left: offsetLeft,
    right: offsetWidth + offsetLeft,
    bottom: offsetHeight + offsetTop
  }
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
export function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
