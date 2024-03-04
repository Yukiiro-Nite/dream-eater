import { Math } from 'phaser'

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

export const getDirectionFromAnimationKey = (key?: string): Phaser.Math.Vector2 => {
  const vec2 = new Math.Vector2(0, 0)

  if (key?.endsWith('Up')) {
    vec2.set(0, -1)
  } else if (key?.endsWith('Right')) {
    vec2.set(1, 0)
  } else if (key?.endsWith('Down')) {
    vec2.set(0, 1)
  } else if (key?.endsWith('Left')) {
    vec2.set(-1, 0)
  }

  return vec2
}