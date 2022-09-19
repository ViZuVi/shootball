import Ball from "./models/Ball"

const canvas = <HTMLCanvasElement>document.getElementById('canvas')

canvas.width = innerWidth
canvas.height = innerHeight

const ctx = canvas.getContext('2d')!

class Player extends Ball {
  constructor(ctx: CanvasRenderingContext2D, x: number, y: number, raduis: number, color: string) {
    super(ctx, x, y, raduis, color);
  }
}
class Projectile extends Ball {
  constructor(ctx: CanvasRenderingContext2D, x: number, y: number, raduis: number, color: string, protected velocity: { x: number, y: number }) {
    super(ctx, x, y, raduis, color);
  }
  update() {
    this.draw()
    this.x = this.x + this.velocity.x
    this.y = this.y + this.velocity.y
  }
}

const x = canvas.width / 2
const y = canvas.height / 2

const player = new Player(ctx, x, y, 30, 'yellow')
// console.log(player);

// const projectile = new Projectile(x, y, 5, 'red', { x: 1, y: 1 })
let projectiles: Projectile[] = []

function animate() {
  requestAnimationFrame(animate)
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  player.draw()
  projectiles.forEach(pr => pr.update())
}

addEventListener('click', (evt: MouseEvent) => {
  const angle = Math.atan2(evt.clientY - y, evt.clientX - x)
  const velocity = {
    x: Math.cos(angle),
    y: Math.sin(angle)
  }
  projectiles.push(new Projectile(ctx, x, y, 5, 'red', velocity))
})

animate()