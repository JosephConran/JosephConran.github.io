import Vector2D from "./vector2d";

class Boid {
  constructor(x, y, canvasWidth, canvasHeight) {
    this.position = new Vector2D(x, y);
    this.velocity = new Vector2D(
      Math.random() * 2 - 1.5,
      Math.random() * 1 - 0.5,
    );
    this.acceleration = new Vector2D();
    this.maxSpeed = 2.0;
    this.maxForce = 0.02;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.separationRadius = 40;
  }

  debugDraw(ctx, showPerception = false, showVelocity = false) {
    // Draw separation radius (red)
    ctx.strokeStyle = "rgba(255, 0, 0, 0.2)";
    ctx.beginPath();
    ctx.arc(
      this.position.x,
      this.position.y,
      this.separationRadius,
      0,
      Math.PI * 2,
    );
    ctx.stroke();

    // Draw perception radius (blue)
    if (showPerception) {
      ctx.strokeStyle = "rgba(0, 0, 255, 0.1)";
      ctx.beginPath();
      ctx.arc(this.position.x, this.position.y, 120, 0, Math.PI * 2);
      ctx.stroke();
    }

    if (showVelocity) {
      ctx.strokeStyle = "rgba(85, 140, 244, 0.5)";
      ctx.beginPath();
      ctx.moveTo(this.position.x, this.position.y);
      ctx.lineTo(
        this.position.x + this.velocity.x * 20,
        this.position.y + this.velocity.y * 20,
      );
      ctx.stroke();
    }
  }

  flock(boids) {
    const perceptionRadius = 60;

    const separation = this.separateAdvanced(boids);
    const alignment = this.align(boids, perceptionRadius);
    const cohesion = this.cohere(boids, perceptionRadius);

    separation.multiplyInPlace(2.0);
    alignment.multiplyInPlace(1.0);
    cohesion.multiplyInPlace(0.75);

    this.acceleration.addInPlace(separation);
    this.acceleration.addInPlace(alignment);
    this.acceleration.addInPlace(cohesion);
  }

  separate(boids) {
    const steering = new Vector2D();
    let total = 0;

    // Define zones
    const repulsionZone = 25; // Strong avoidance
    const conflictZone = 50; // Medium avoidance

    for (const other of boids) {
      if (other === this) continue;

      const diff = this.position.subtract(other.position);
      const d = diff.magnitude();

      if (d < repulsionZone) {
        // Strong repulsion in inner zone
        const force = (repulsionZone / d - 1.0) * 0.5;
        diff.normalizeInPlace().multiplyInPlace(force);
        steering.addInPlace(diff);
        total++;
      } else if (d < conflictZone) {
        // Medium repulsion in conflict zone
        const normalizedDist =
          (d - repulsionZone) / (conflictZone - repulsionZone);
        const force = Math.cos(normalizedDist * Math.PI) * 0.3;
        diff.normalizeInPlace().multiplyInPlace(force);
        steering.addInPlace(diff);
        total++;
      }
    }

    if (total > 0) {
      steering.divideInPlace(total);
      steering.normalizeInPlace();
      steering.multiplyInPlace(this.maxSpeed);
      steering.subtractInPlace(this.velocity);
      steering.limitInPlace(this.maxForce);
    }
    return steering;
  }

  separateAdvanced(boids) {
    const steering = new Vector2D();
    let totalWeight = 0;

    for (const other of boids) {
      if (other === this) continue;

      const diff = this.position.subtract(other.position);
      const d = diff.magnitude();

      if (d < this.separationRadius && d > 0) {
        // Urgency factor: stronger repulsion when very close
        const urgency = Math.max(0, 1 - d / this.separationRadius);
        const weight = urgency * urgency * 2.0; // Quadratic urgency

        diff.normalizeInPlace().multiplyInPlace(weight);
        steering.addInPlace(diff);
        totalWeight += weight;
      }
    }

    if (totalWeight > 0) {
      // Use weighted average instead of simple division
      steering.divideInPlace(totalWeight);
      steering.normalizeInPlace();
      steering.multiplyInPlace(this.maxSpeed);
      steering.subtractInPlace(this.velocity);
      steering.limitInPlace(this.maxForce);
    }
    return steering;
  }

  align(boids, radius) {
    const steering = new Vector2D();
    let total = 0;

    for (const other of boids) {
      const d = this.position.subtract(other.position).magnitude();
      if (other !== this && d < radius && d > 0) {
        steering.addInPlace(other.velocity);
        total++;
      }
    }

    if (total > 0) {
      steering.divideInPlace(total);
      steering.normalizeInPlace();
      steering.multiplyInPlace(this.maxSpeed);
      steering.subtractInPlace(this.velocity);
      steering.limitInPlace(this.maxForce);
    }

    return steering;
  }

  cohere(boids, radius) {
    const steering = new Vector2D();
    let total = 0;

    for (const other of boids) {
      const d = this.position.subtract(other.position).magnitude();
      if (other !== this && d < radius && d > 0) {
        steering.addInPlace(other.position);
        total++;
      }
    }

    if (total > 0) {
      steering.divideInPlace(total);
      steering.subtractInPlace(this.position);
      steering.normalizeInPlace();
      steering.multiplyInPlace(this.maxSpeed);
      steering.subtractInPlace(this.velocity);
      steering.limitInPlace(this.maxForce);
    }

    return steering;
  }

  update() {
    this.velocity.addInPlace(this.acceleration);
    this.velocity.limitInPlace(this.maxSpeed);
    this.position.addInPlace(this.velocity);
    this.acceleration.multiplyInPlace(0);
  }

  edges() {
    if (this.position.x > this.canvasWidth) this.position.x = 0;
    if (this.position.x < 0) this.position.x = this.canvasWidth;
    if (this.position.y > this.canvasHeight) this.position.y = 0;
    if (this.position.y < 0) this.position.y = this.canvasHeight;
  }
}

export default Boid;
