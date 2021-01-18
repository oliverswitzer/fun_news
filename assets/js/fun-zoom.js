import Matter from "matter-js";

export function render() {
  const canvas = document.getElementById("FunZoom");
  const screenHeight = document.body.clientHeight;
  const screenWidth = document.body.clientWidth;

  let Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies;

  const engine = Engine.create();

  const render = Render.create({
    canvas,
    engine: engine,
    options: {
      width: screenWidth,
      height: screenHeight
    }
  });

  console.log(document.body.clientHeight)

  const circleA = Bodies.circle(400, 200, 80, 80);
  const circleB = Bodies.circle(450, 50, 80, 80);
  const groundWidth = screenWidth;
  const groundHeight = 60;

  const ground = Bodies.rectangle(groundWidth/2, screenHeight - groundHeight/2, screenWidth, 60, {isStatic: true});

  World.add(engine.world, [circleA, circleB, ground]);

  Engine.run(engine);
  Render.run(render);
}