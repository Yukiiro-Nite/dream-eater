export const getAnimationFromDirection = (name: string, x: number, y: number): string | undefined => {
  if (x > 0) {
    return `${name}Right`
  } else if (x < 0) {
    return `${name}Left`
  } else if (y > 0) {
    return `${name}Down`
  } else if (y < 0) {
    return `${name}Up`
  }
}