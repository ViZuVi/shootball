import Ball from './Ball'

export default abstract class MovingBall extends Ball {
  constructor(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    raduis: number,
    color: string,
    protected velocity: { x: number, y: number }
  ) {
    super(ctx, x, y, raduis, color);
  }
  update() {
    this.draw()
    this.x = this.x + this.velocity.x
    this.y = this.y + this.velocity.y
  }
}
