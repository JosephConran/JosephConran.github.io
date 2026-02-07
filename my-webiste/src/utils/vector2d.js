class Vector2D {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  add(v) {
    return new Vector2D(this.x + v.x, this.y + v.y);
  }
  subtract(v) {
    return new Vector2D(this.x - v.x, this.y - v.y);
  }
  multiply(scalar) {
    return new Vector2D(this.x * scalar, this.y * scalar);
  }
  divide(scalar) {
    return scalar > 0
      ? new Vector2D(this.x / scalar, this.y / scalar)
      : new Vector2D();
  }

  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  normalize() {
    return this.divide(this.magnitude());
  }
  limit(max) {
    const mag = this.magnitude();
    return mag > max ? this.normalize().multiply(max) : this;
  }

  addInPlace(v) {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  subtractInPlace(v) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  multiplyInPlace(scalar) {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  divideInPlace(scalar) {
    if (scalar > 0) {
      this.x /= scalar;
      this.y /= scalar;
    }
    return this;
  }

  normalizeInPlace() {
    const mag = this.magnitude();
    if (mag > 0) {
      this.x /= mag;
      this.y /= mag;
    }
    return this;
  }

  limitInPlace(max) {
    const mag = this.magnitude();
    if (mag > max) {
      this.normalizeInPlace();
      this.multiplyInPlace(max);
    }
    return this;
  }

  clone() {
    return new Vector2D(this.x, this.y);
  }
}

export default Vector2D;
