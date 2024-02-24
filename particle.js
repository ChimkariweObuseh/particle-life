class Particle {
  constructor(start, t) {
    this.position = createVector(start.x, start.y);
    this.velocity = createVector(0, 0);
    this.type = t;
  }

  applyInternalForces(c) {
    let totalForce = createVector(0, 0);
    let acceleration = createVector(0, 0);
    let vector = createVector(0, 0);
    let dis;
    for (let p of c.swarm) {
      if (p != this) {
        vector.mult(0);
        vector = p.position.copy();
        vector.sub(this.position);
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
        dis = vector.mag();
        vector.normalize();
        if (dis < c.internalMins[this.type][p.type]) {
          let force = vector.copy();
          force.mult(abs(c.internalForces[this.type][p.type]) * -3 * K);
          force.mult(map(dis, 0, c.internalMins[this.type][p.type], 1, 0));
          totalForce.add(force);
        }
        if (dis < c.internalRadii[this.type][p.type]) {
          let force = vector.copy();
          force.mult(c.internalForces[this.type][p.type] * K);
          force.mult(map(dis, 0, c.internalRadii[this.type][p.type], 1, 0));
          totalForce.add(force);
        }
      }
    }
    acceleration = totalForce.copy();
    this.velocity.add(acceleration);

    this.position.add(this.velocity);
    this.position.x = (this.position.x + width) % width;
    this.position.y = (this.position.y + height) % height;
    this.velocity.mult(friction);
  }

  applyExternalForces(c) {
    let totalForce = createVector(0, 0);
    let acceleration = createVector(0, 0);
    let vector = createVector(0, 0);
    let dis;
    for (let other of swarm) {
      if (other != c) {
        for (let p of other.swarm) {
          vector.mult(0);
          vector = p.position.copy();
          vector.sub(this.position);
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
          dis = vector.mag();
          vector.normalize();
          if (dis < c.externalMins[this.type][p.type]) {
            let force = vector.copy();
            force.mult(abs(c.externalForces[this.type][p.type]) * -3 * K);
            force.mult(map(dis, 0, c.externalMins[this.type][p.type], 1, 0));
            totalForce.add(force);
          }
          if (dis < c.externalRadii[this.type][p.type]) {
            let force = vector.copy();
            force.mult(c.externalForces[this.type][p.type] * K);
            force.mult(map(dis, 0, c.externalRadii[this.type][p.type], 1, 0));
            totalForce.add(force);
          }
        }
      }
    }
    acceleration = totalForce.copy();
    this.velocity.add(acceleration);
    this.position.add(this.velocity);
    this.position.x = (this.position.x + width) % width;
    this.position.y = (this.position.y + height) % height;
    this.velocity.mult(friction);
  }

  applyFoodForces(c) {
    let totalForce = createVector(0, 0);
    let acceleration = createVector(0, 0);
    let vector = createVector(0, 0);
    let dis;
    for (let p of food) {
      vector.mult(0);
      vector = p.position.copy();
      vector.sub(this.position);
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
      dis = vector.mag();
      vector.normalize();
      if (dis < c.externalRadii[this.type][p.type]) {
        let force = vector.copy();
        force.mult(c.externalForces[this.type][p.type] * K);
        force.mult(map(dis, 0, c.externalRadii[this.type][p.type], 1, 0));
        totalForce.add(force);
      }
    }
    acceleration = totalForce.copy();
    this.velocity.add(acceleration);
    this.position.add(this.velocity);
    this.position.x = (this.position.x + width) % width;
    this.position.y = (this.position.y + height) % height;
    this.velocity.mult(friction);
  }

  display() {
    fill(this.type * colorStep, 100, 100);
    circle(this.position.x, this.position.y, 8);
  }
}
