let numTypes = 6; // 0 is food, plus 5 more, type 1 'eats' food, the others just generate forces
let colorStep = 360 / numTypes;
let friction = 0.85;
let minPopulation = 15;
let numFood = 200; // starting amount of food
let foodRange = 5; // distance to collect food
let foodEnergy = 100; // energy from food
let reproductionEnergy = 1000;
let startingEnergy = 400;
let K = 0.2;
let swarm = [];
let food = [];
let display = true; // whether or not to display, d toggles, used to evolve faster
let drawLines = false; // whether or not to draw lines connecting a cell's particles, l to toggle

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);
  swarm = [];
  for (let i = 0; i < minPopulation; i++) {
    swarm.push(new Cell(random(width), random(height)));
  }
  food = [];
  for (let i = 0; i < numFood; i++) {
    food.push(new Particle(createVector(random(width), random(height)), 0));
  }
}

function draw() {
  background(0);
  for (let c of swarm) {
    c.update();
    if (display) {
      c.display();
    }
  }
  for (let i = swarm.length - 1; i >= 0; i--) {
    let c = swarm[i];
    if (c.energy <= 0) {
      swarm.splice(i, 1);
    }
  }
  eat();
  replace();
  reproduce();
  if (display) {
    for (let p of food) {
      p.display();
    }
  }
  if (frameCount % 5 == 0) {
    food.push(new Particle(createVector(random(width), random(height)), 0));
  }
}

function convertToFood(c) {
  for (let p of c.swarm) {
    food.push(new Particle(p.position.copy(), 0));
  }
}

function reproduce() {
  for (let i = swarm.length - 1; i >= 0; i--) {
    let c = swarm[i];
    if (c.energy > reproductionEnergy) {
      let temp = new Cell(random(width), random(height));
      temp.copyCell(c);
      c.energy -= startingEnergy;
      temp.mutateCell();
      swarm.push(temp);
    }
  }
}

function replace() {
  if (swarm.length < minPopulation) {
    let parent = Math.floor(random(swarm.length));
    let parentCell = swarm[parent];
    let temp = new Cell(random(width), random(height));
    temp.copyCell(parentCell);
    temp.mutateCell();
    swarm.push(temp);
  }
}

function eat() {
  for (let c of swarm) {
    for (let p of c.swarm) {
      if (p.type == 1) {
        for (let i = food.length - 1; i >= 0; i--) {
          let f = food[i];
          let vector = p5.Vector.sub(f.position, p.position);
          if (vector.x > width * 0.5) {
            vector.x -= width;
          }
          if (vector.x < width * -0.5) {
            vector.x += width;
          }
          if (vector.y > height * 0.5) {
            vector.y -= height;
          }
          if (vector.y < height * -0.5) {
            vector.y += height;
          }
          let dis = vector.mag();
          if (dis < foodRange) {
            c.energy += foodEnergy;
            food.splice(i, 1);
          }
        }
      }
    }
  }
}

function keyPressed() {
  if (key === 'd') {
    display = !display;
  }
  if (key === 'l') {
    drawLines = !drawLines;
  }
}

