import Matter from "matter-js";

const Engine = Matter.Engine,
  Render = Matter.Render,
  World = Matter.World,
  Bodies = Matter.Bodies;

export async function render() {
  await initStream();

  const engine = Engine.create();
  const world = engine.world;
  const screenWidth = document.body.clientWidth;
  const screenHeight = document.body.clientHeight;

  addMouse(engine, world);

  const circleA = createCircle(400, 200, 80);
  const circleB = createCircle(450, 50, 80);
  const circleC = createCircle(500, 10, 80);
  const groundWidth = screenWidth;
  const groundHeight = 60;
  const ground = Bodies.rectangle(groundWidth/2, screenHeight - groundHeight/2, screenWidth, 60, {isStatic: true});
  const barrier = Bodies.rectangle(400, 300, screenWidth, 60, {isStatic: true});

  World.add(world, [circleA, circleB, circleC, ground, barrier]);
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

  ctx.globalCompositeOperation = 'destination-over'
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'black';
  ctx.fillStyle = 'white';

  function canvasRender() {
    Engine.update(engine, 16);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const bodies = Matter.Composite.allBodies(engine.world);

    bodies
      .filter(b => b.label === "Circle Body")
      .forEach(circle => {
        const video = document.querySelector('#local-video');

        ctx.save();
        ctx.beginPath()
        ctx.arc(
          circle.position.x,
          circle.position.y,
          circle.circleRadius,
          0, Math.PI*2,true
        )
        ctx.closePath();
        ctx.clip();

        ctx.drawImage(
          video,
          circle.position.x - circle.circleRadius - video.videoWidth*0.25/4,
          circle.position.y - circle.circleRadius,
          video.videoWidth*0.25,
          video.videoHeight*0.25
        )

        ctx.restore()
      })

    bodies
      .filter(b => b.label !== "Circle Body")
      .forEach(b => {
        const vertices = b.vertices;
        ctx.moveTo(vertices[0].x, vertices[0].y);
        vertices.forEach(v => {
          ctx.lineTo(v.x, v.y);
        })
        ctx.lineTo(vertices[0].x, vertices[0].y);
      })

    ctx.fill();
    ctx.stroke();

    window.requestAnimationFrame(canvasRender);
  }

  window.requestAnimationFrame(canvasRender);
}

function createCircle(x, y, radius) {
  return Bodies.circle(x, y, radius);
}

function addMouse(engine, world) {
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
}

async function initStream() {
  try {
    // Gets our local media from the browser and stores it as a const, stream.
    const stream = await navigator.mediaDevices.getUserMedia({audio: true, video: true, width: "1280"})
    // Stores our stream in the global constant, localStream.
    // localStream = stream
    // Sets our local video element to stream from the user's webcam (stream).
    document.getElementById("local-video").srcObject = stream
  } catch (e) {
    console.log(e)
  }
}