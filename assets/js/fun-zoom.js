import Matter from "matter-js";
import _shuffle from 'lodash/shuffle';
import _random from 'lodash/random';

const Engine = Matter.Engine,
  Render = Matter.Render,
  World = Matter.World,
  Runner = Matter.Runner,
  Events = Matter.Events,
  Bodies = Matter.Bodies;

const BIAS_COLOR_MAP = {
  "Left": "#2f66e9",
  "Lean Left": "#4977ea",
  "Center": "#771cb6",
  "Mixed": "#771cb6",
  "Lean Right": "#ea7e7e",
  "Right": "#ea1919"
}

export async function render(container) {
  const engine = Engine.create();
  const world = engine.world;

  // create renderer
  const screenWidth = document.body.clientWidth;
  const screenHeight = document.body.clientHeight;

  const render = Render.create({
    element: container,
    engine: engine,
    options: {
      width: screenWidth,
      height: screenHeight,
      showAngleIndicator: false,
      wireframes: false
    }
  });
  window.onresize = function(event) {
    render.canvas.width = document.body.clientWidth;
    render.canvas.height = document.body.clientHeight;
  };
  Render.run(render);

  // create runner
  const runner = Runner.create();
  Runner.run(runner, engine);

  addMouse(engine, world, render);
  const groundWidth = screenWidth;
  const groundThickness = 60;
  const projectile = createCircle(80, screenHeight - groundThickness, groundThickness);
  const ground = Bodies.rectangle(groundWidth/2, screenHeight - groundThickness/2, screenWidth, 60, {isStatic: true});
  const leftWall = Bodies.rectangle(-screenWidth/2 + groundThickness, screenHeight/2, groundWidth, screenHeight, {isStatic: true});
  World.add(world, [projectile, ground,leftWall]);

  spawnNewsBlocks(render, world)

  let lastArticle = null;
  const collisionStart = function(event) {
    const collision = event.pairs[0];
    if(collision.bodyB.label !== "Circle Body") { return; } // then the ball is colliding with the ground
    if(collision.bodyA.href) { return; } // bodyA should always be the users particle. Collisions between news articles are not allowed

    const particle = collision.bodyA;
    const article = collision.bodyB;

    if(!article.tied) {
      console.log(lastArticle)
      const constraint = Matter.Constraint.create({
        bodyA: lastArticle ? lastArticle : particle,
        bodyB: article,
        pointB: { x: 0, y: 0},
        pointA: { x: 0, y: 0},
        stiffness: 1
      })
      World.add(world, constraint)
      Matter.Body.setStatic(article, false);
      article.tied = true;
      article.isSensor = true;

      lastArticle = article;

      // Render.lookAt(render, [particle, lastArticle], { x: 400, y: 400 })
    }

    if (article.href && !article.lookedAt) {
      // setTimeout(() => {
        article.lookedAt = true;
        window.open(article.href, "_blank")
      // }, 500)
    }
  };

  Events.on(engine, 'collisionStart', collisionStart);
  Engine.run(engine);
}

function createCircle(x, y, radius) {
  return Bodies.circle(x, y, radius);
}

function addMouse(engine, world, render) {
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

async function spawnNewsBlocks(render, world) {
  const newsArticles = await fetch('/api/news.json').then(res => res.json())

  const newsBlocks = _shuffle(newsArticles).splice(0,30).map(article => {
    if(!BIAS_COLOR_MAP[article.bias]) {
      console.log(article)
    }

    const newsRect = Bodies.circle(
      _random(30, render.options.width - 30),
      _random(30, render.options.height - 200),
      30,
      {
        isStatic: true,
        render: {
          fillStyle: BIAS_COLOR_MAP[article.bias]
        }
      }
    );

    newsRect.href = article.link
    return newsRect;
  })

  World.add(world, newsBlocks)
}