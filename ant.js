import { Ant as AntBase, randomFloat } from "./index.js";

export class Ant extends AntBase {
  onAct() {
    const maxAngleDelta = 5 * (2 * Math.PI / 360)
    this.angle = this.angle + randomFloat(-maxAngleDelta, maxAngleDelta)
    if (this.angle < 0) {
      this.angle += 2 * Math.PI
    } else {
      this.angle = this.angle % (2 * Math.PI)
    }
    const moveDistance = 1
    this.position = {
      x: this.position.x + moveDistance * Math.cos(this.angle),
      y: this.position.y + moveDistance * Math.sin(this.angle)
    }
  }
}
