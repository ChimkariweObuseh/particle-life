class Cell {
  constructor(x, y) {
    this.swarm = [];
    this.internalForces = [];
    this.externalForces = [];
    this.internalMins = [];
    this.externalMins = [];
    this.internalRadii = [];
    this.externalRadii = [];
    this.positions = [];
    this.numParticles = 40;
    this.energy = startingEnergy;
    this.radius = 0;
    this.center = createVector(0, 0);
    this.generateNew(x, y);
  }

  generateNew(x, y) {
    for (let i = 0; i < numTypes; i++) {
      this.internalForces.push([]);
      this.externalForces.push([]);
      this.internalMins.push([]);
      this.externalMins.push([]);
      this.internalRadii.push([]);
      this.externalRadii.push([]);
      for (let j = 0; j < numTypes; j++) {
        this.internalForces[i][j] = random(0.1, 1.0);
        this.internalMins[i][j] = random(40, 70);
        this.internalRadii[i][j] = random(this.internalMins[i][j] * 2, 300);
        this.externalForces[i][j] = random(-1.0, 1.0);
        this.externalMins[i][j] = random(40, 70);
        this.externalRadii[i][j] = random(this.externalMins[i][j] * 2, 300);
      }
    }
    for (let i = 0; i < this.numParticles; i++) {
      this.positions[i] = createVector(x + random(-50, 50), y + random(-50, 50));
      this.swarm.push(new Particle(this.positions[i], 1 + Math.floor(random(numTypes - 1))));
    }
  }

  copyCell(c) {
    for (let i = 0; i < numTypes; i++) {
      for (let j = 0; j < numTypes; j++) {
        if (c.internalForces[i][j] != undefined) {
        this.internalForces[i][j] = c.internalForces[i][j];
        this.internalMins[i][j] = c.internalMins[i][j];
        this.internalRadii[i][j] = c.internalRadii[i][j];
        this.externalForces[i][j] = c.externalForces[i][j];
        this.externalMins[i][j] = c.externalMins[i][j];
        this.externalRadii[i][j] = c.externalRadii[i][j];
        } else {
          this.generateNew(random(width), random(height));
        }
      }
    }
    let x = random(width);
    let y = random(height);
    for (let i = 0; i < this.numParticles; i++) {
      let p = this.swarm[i];
      let temp = new Particle(p.position.copy(), p.type);
      this.swarm.push(temp);
    }
  }

  mutateCell() {
    for (let i = 0; i < numTypes; i++) {
      for (let j = 0; j < numTypes; j++) {
        this.internalForces[i][j] += random(-0.1, 0.1);
        this.internalMins[i][j] += random(-5, 5);
        this.internalRadii[i][j] += random(-10, 10);
        this.externalForces[i][j] += random(-0.1, 0.1);
        this.externalMins[i][j] += random(-5, 5);
        this.externalRadii[i][j] += random(-10, 10);
      }
    }
    for (let i = 0; i < this.numParticles; i++) {
      this.positions[i].add(createVector(random(-5, 5), random(-5, 5)));
      if (random(100) < 10) {
        let p = this.swarm[i];
        p.type = 1 + Math.floor(random(numTypes - 1));
      }
    }
  }

  update() {
    for (let p of this.swarm) {
      p.applyInternalForces(this);
      p.applyExternalForces(this);
      p.applyFoodForces(this);
    }
    this.energy -= 1.0;
  }

  display() {
    if (drawLines) {
      stroke('white');
      for (let i = 0; i < this.numParticles - 1; i++) {
        let p1 = this.swarm[i];
        let p2 = this.swarm[i + 1];
        line(p1.position.x, p1.position.y, p2.position.x, p2.position.y);
      }
    }
    noStroke();
    for (let p of this.swarm) {
      p.display();
    }
  }
}
