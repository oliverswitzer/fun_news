import Matter from "matter-js";

const Bodies = Matter.Bodies;

export class ShapeFactory {
  constructor(screenWidthFun, screenHeightFun) {
    this.screenWidthFun = screenWidthFun;
    this.screenHeightFun = screenHeightFun;
  }

  createCircle(x, y, radius, options) {
    const scaleFactor = (this.screenWidthFun() > 1200 ? 1200 : this.screenWidthFun()) / 1200;

    return Bodies.circle(x, y, radius * scaleFactor, options);
  }

  createRectangle(x, y, w, h, options) {
    return Bodies.rectangle(x, y, w, h, options)
  }

  createWalls(wallThickness) {
    const groundHeight = this.screenWidthFun() < 1200 ?  wallThickness + 100 : wallThickness

    const ground = this.createRectangle(this.screenWidthFun() / 2, this.screenHeightFun() - wallThickness / 2, this.screenWidthFun(), groundHeight, {isStatic: true});
    const ceiling = this.createRectangle(this.screenWidthFun() / 2, 0, this.screenWidthFun(), wallThickness, {isStatic: true});
    const leftWall = this.createRectangle(0, this.screenHeightFun() / 2, wallThickness, this.screenHeightFun(), {isStatic: true});
    const rightWall = this.createRectangle(this.screenWidthFun(), this.screenHeightFun() / 2, wallThickness, this.screenHeightFun(), {isStatic: true});
    return [leftWall, ground, rightWall, ceiling]
  }
}