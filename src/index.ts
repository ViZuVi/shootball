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

class Enemy extends Ball {
  constructor(ctx: CanvasRenderingContext2D, x: number, y: number, raduis: number, color: string, protected velocity: { x: number, y: number }) {
    super(ctx, x, y, raduis, color);
  }
  update() {
    this.draw()
    this.x = this.x + this.velocity.x
    this.y = this.y + this.velocity.y
  }
}

function spanEnemies() {
  setInterval(() => {
    const radius = Math.random() * (30 - 4) + 4
    let x: number
    let y: number
    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
      y = Math.random() * canvas.height
    } else {
      x = Math.random() * canvas.width
      y = Math.random() > 0.5 ? 0 - radius : canvas.height + radius
    }
    const color = 'green'
    const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x)
    const velocity = {
      x: Math.cos(angle),
      y: Math.sin(angle)
    }
    enemies.push(new Enemy(ctx, x, y, radius, color, velocity))
  }, 1000)
}

const x = canvas.width / 2
const y = canvas.height / 2

const player = new Player(ctx, x, y, 30, 'yellow')
let projectiles: Projectile[] = []
let enemies: Enemy[] = []

function animate() {
  requestAnimationFrame(animate)
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  player.draw()
  projectiles.forEach(pr => pr.update())
  enemies.forEach(en => en.update())
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
spanEnemies()