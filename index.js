export class Environment {
  static ANT_RADIUS = 1.5
  static ANT_LIMB_LENGTH = 2

  constructor(antClass) {
    this.antClass = antClass

    this.putAntInBounds = this.putAntInBounds.bind(this)
    this.createFoodPiece = this.createFoodPiece.bind(this)
    this.createAnt = this.createAnt.bind(this)
    this.renderAnt = this.renderAnt.bind(this)
    this.renderFoodPiece = this.renderFoodPiece.bind(this)

    this.canvas = document.createElement('canvas')
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
    this.context = this.canvas.getContext('2d')

    this.ants = this.createAnts(50)
    this.food = this.createFood(100)

    this.antGraphics = this.renderAntGraphics()
  }

  onTick() {
    this.ants.forEach(ant => ant.onAct())
    this.putAntsInBounds()
  }

  putAntsInBounds() {
    this.ants.forEach(this.putAntInBounds)
  }

  putAntInBounds(ant) {
    if (ant.position.x < 0) {
      ant.position.x = 0
    } else if (ant.position.x > this.canvas.width - 1) {
      ant.position.x = this.canvas.width - 1
    }
    if (ant.position.y < 0) {
      ant.position.y = 0
    } else if (ant.position.y > this.canvas.height - 1) {
      ant.position.y = this.canvas.height - 1
    }
  }

  createAnts(amount) {
    return repeat(this.createAnt, amount)
  }

  createAnt() {
    return new this.antClass(
      this,
      this.createRandomPosition(),
      this.createRandomAngle()
    )
  }

  createFood(amount) {
    return repeat(this.createFoodPiece, amount)
  }

  createFoodPiece() {
    const position = this.createRandomPosition()
    return new Food(position)
  }

  createRandomPosition() {
    return {
      x: randomInteger(0, this.canvas.width - 1),
      y: randomInteger(0, this.canvas.height - 1)
    }
  }

  createRandomAngle() {
    return randomFloat(0, 2 * Math.PI)
  }

  render() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.renderAnts()
    this.renderFood()
  }

  renderAnts() {
    this.ants.forEach(this.renderAnt)
  }

  renderAnt(ant) {
    this.context.save()
    this.context.translate(ant.position.x, ant.position.y)
    this.context.rotate(ant.angle)
    this.context.drawImage(this.antGraphics, 0, 0)
    this.context.restore()
  }

  renderAntGraphics() {
    const antGraphics = document.createElement('canvas')
    antGraphics.width = 8 * Environment.ANT_RADIUS
    antGraphics.height = 6 * Environment.ANT_RADIUS
    const context = antGraphics.getContext('2d')

    const center = {
      x: antGraphics.width * 0.5,
      y: antGraphics.height * 0.5
    }

    context.beginPath()
    context.arc(
      center.x + 2 * Environment.ANT_RADIUS,
      center.y,
      Environment.ANT_RADIUS,
      0,
      2 * Math.PI
    )
    context.fill()

    context.beginPath()
    context.arc(
      center.x,
      center.y,
      Environment.ANT_RADIUS,
      0,
      2 * Math.PI
    )
    context.fill()

    context.beginPath()
    context.arc(
      center.x - 2 * Environment.ANT_RADIUS,
      center.y,
      Environment.ANT_RADIUS,
      0,
      2 * Math.PI
    )
    context.fill()

    const angle = 45 * (2 * Math.PI / 360)

    this.renderAntLimb(
      context,
      {
        x: center.x + 2 * Environment.ANT_RADIUS,
        y: center.y - Environment.ANT_RADIUS
      },
      -angle
    )

    this.renderAntLimb(
      context,
      {
        x: center.x + 2 *  Environment.ANT_RADIUS,
        y: center.y + Environment.ANT_RADIUS
      },
      angle
    )

    this.renderAntLimb(
      context,
      {
        x: center.x - 2 * Environment.ANT_RADIUS,
        y: center.y - Environment.ANT_RADIUS
      },
      Math.PI + angle
    )

    this.renderAntLimb(
      context,
      {
        x: center.x - 2 * Environment.ANT_RADIUS,
        y: center.y + Environment.ANT_RADIUS
      },
      Math.PI - angle
    )

    return antGraphics
  }

  renderAntLimb(context, fromPosition, angle) {
    context.beginPath()
    const {x, y} = fromPosition
    context.moveTo(x, y)
    context.lineTo(
      x + Environment.ANT_LIMB_LENGTH * Math.cos(angle),
      y + Environment.ANT_LIMB_LENGTH * Math.sin(angle)
    )
    context.stroke()
  }

  renderFood() {
    this.food.forEach(this.renderFoodPiece)
  }

  renderFoodPiece(food) {
    this.context.beginPath()
    this.context.arc(
      food.position.x,
      food.position.y,
      1.5,
      0,
      2 * Math.PI
    )
    this.context.fill()
  }
}

export class Ant {
  constructor(environment, position, angle) {
    this.environment = environment
    this.position = position
    this.angle = angle
  }

  onAct() {

  }
}

class Food {
  constructor(position) {
    this.position = position
  }
}

function repeat(factory, numberOfTimes) {
  return new Array(numberOfTimes).fill(null).map(factory)
}

function randomInteger(min, max) {
  min = Math.floor(min)
  max = Math.floor(max)
  return Math.floor(randomFloat(min, max))
}

export function randomFloat(min, max) {
  return min + (max - min) * Math.random()
}
