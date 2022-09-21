import { gsap } from "gsap"
import Ball from "./models/Ball"
import MovingBall from "./models/MovingBall"

const canvas = <HTMLCanvasElement>document.getElementById('canvas')

canvas.width = innerWidth
canvas.height = innerHeight

const ctx = canvas.getContext('2d')!

class Player extends Ball {
  constructor(ctx: CanvasRenderingContext2D, x: number, y: number, raduis: number, color: string) {
    super(ctx, x, y, raduis, color);
  }
}

class Projectile extends MovingBall {
  constructor(ctx: CanvasRenderingContext2D, x: number, y: number, raduis: number, color: string, velocity: { x: number, y: number }) {
    super(ctx, x, y, raduis, color, velocity);
  }
}

class Enemy extends MovingBall {
  constructor(ctx: CanvasRenderingContext2D, x: number, y: number, raduis: number, color: string, velocity: { x: number, y: number }) {
    super(ctx, x, y, raduis, color, velocity);
  }
}

class Particle extends MovingBall {
  public alpha = 1
  private friction = 0.99
  constructor(ctx: CanvasRenderingContext2D, x: number, y: number, raduis: number, color: string, velocity: { x: number, y: number }) {
    super(ctx, x, y, raduis, color, velocity);
  }

  draw() {
    ctx.save()
    this.ctx.beginPath()
    ctx.globalAlpha = this.alpha
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    this.ctx.fillStyle = this.color
    this.ctx.fill()
    ctx.restore()
  }

  update() {
    this.draw()
    this.velocity.x *= this.friction
    this.velocity.y *= this.friction
    this.x = this.x + this.velocity.x
    this.y = this.y + this.velocity.y
    this.alpha -= 0.01
  }
}

function spawnEnemies() {
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
    const color = `hsl(${Math.random() * 360}, 50%, 50%)`
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

const player = new Player(ctx, x, y, 20, 'white')
let projectiles: Projectile[] = []
let enemies: Enemy[] = []
let particles: Particle[] = []

let animationId: number;
function animate() {
  animationId = requestAnimationFrame(animate)
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  player.draw()
  particles.forEach((part, i) => {
    if (part.alpha <= 0) {
      particles.splice(i, 1)
    } else {
      part.update()
    }
  })
  projectiles.forEach((pr, i) => {
    pr.update()

    // remove from edges of the screen
    if (pr.x + pr.radius < 0 ||
      pr.x - pr.radius > canvas.width ||
      pr.y + pr.radius < 0 ||
      pr.y - pr.radius > canvas.width) {
      setTimeout(() => {
        projectiles.splice(i, 1)
      }, 0);
    }
  })

  enemies.forEach((en, i) => {
    en.update()

    const distToPlayer = Math.hypot(player.x - en.x, player.y - en.y)

    if (distToPlayer - en.radius - player.radius < 1) {
      cancelAnimationFrame(animationId)
    }

    projectiles.forEach((pr, j) => {
      const distToEnemy = Math.hypot(pr.x - en.x, pr.y - en.y)
      // projectiles touch enemy
      if (distToEnemy - pr.radius - en.radius < 1) {
        // enemy explosions
        for (let i = 0; i < en.radius * 2; i++) {
          particles.push(new Particle(ctx, pr.x, pr.y, Math.random() * 2, en.color, { x: (Math.random() - 0.5 * (Math.random() * 6)), y: (Math.random() - 0.5) * (Math.random() * 6) }))
        }

        if (en.radius - 10 > 5) {
          gsap.to(en, {
            radius: en.radius - 10
          })
          setTimeout(() => {
            projectiles.splice(j, 1)
          }, 0);
        } else {
          setTimeout(() => {
            enemies.splice(i, 1)
            projectiles.splice(j, 1)
          }, 0);
        }
      }
    })
  })
}

addEventListener('click', (evt: MouseEvent) => {
  const angle = Math.atan2(evt.clientY - y, evt.clientX - x)
  const velocity = {
    x: Math.cos(angle) * 4,
    y: Math.sin(angle) * 4
  }
  projectiles.push(new Projectile(ctx, x, y, 5, 'white', velocity))
})

animate()
spawnEnemies()