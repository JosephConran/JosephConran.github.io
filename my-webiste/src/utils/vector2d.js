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
}
