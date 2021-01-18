import Matter from "matter-js";

const Engine = Matter.Engine,
  Render = Matter.Render,
  World = Matter.World,
  Bodies = Matter.Bodies;


export function render() {
  const engine = Engine.create();
  const world = engine.world;
  const screenWidth = document.body.clientWidth;
  const screenHeight = document.body.clientHeight;

  const mouse = Matter.Mouse.create(render.canvas),
    mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false
        }
      }
    });

  Matter.World.add(world, mouseConstraint);
  render.mouse = mouse;

  const circleA = createCircle(400, 200, 80);
  const circleB = createCircle(450, 50, 80);
  const groundWidth = screenWidth;
  const groundHeight = 60;
  const ground = Bodies.rectangle(groundWidth/2, screenHeight - groundHeight/2, screenWidth, 60, {isStatic: true});

  World.add(engine.world, [circleA, circleB, ground]);

  Engine.run(engine);

  // RENDERING
  const canvas = document.getElementById("FunZoom");
  const ctx = canvas.getContext('2d');
  canvas.width = screenWidth;
  canvas.height = screenHeight;

  window.onresize = function(event) {
    ctx.canvas.width = document.body.clientWidth;
    ctx.canvas.height = document.body.clientHeight;
  };

  ctx.lineWidth = 1;
  ctx.strokeStyle = '#ff0';
  ctx.fillStyle = '#000';

  function canvasRender() {
    Engine.update(engine, 16);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const bodies = Matter.Composite.allBodies(engine.world);
    ctx.beginPath();
    for (let i = 0; i < bodies.length; i += 1) {
      const vertices = bodies[i].vertices;
      ctx.moveTo(vertices[0].x, vertices[0].y);
      for (let j = 1; j < vertices.length; j += 1) {
        ctx.lineTo(vertices[j].x, vertices[j].y);
      }
      ctx.lineTo(vertices[0].x, vertices[0].y);
    }
    ctx.fill();
    ctx.stroke();

    window.requestAnimationFrame(canvasRender);
  }

  window.requestAnimationFrame(canvasRender);
}

function createCircle(x, y, radius) {
  return Bodies.circle(x, y, radius);
}
