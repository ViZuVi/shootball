export default abstract class Ball {
  constructor(
    public ctx: CanvasRenderingContext2D,
    protected x: number,
    protected y: number,
    protected radius: number,
    protected color: string
  ) {
    this.draw()
  }

  draw() {
    this.ctx.beginPath()
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    this.ctx.fillStyle = this.color
    this.ctx.fill()
  }
}