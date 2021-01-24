import Matter from "matter-js";
import _shuffle from 'lodash/shuffle';
import _random from 'lodash/random';
import {ShapeFactory} from "./shape-factory";

const Constraint = Matter.Constraint,
  Engine = Matter.Engine,
  Events = Matter.Events,
  Mouse = Matter.Mouse,
  MouseConstraint = Matter.MouseConstraint,
  Render = Matter.Render,
  Runner = Matter.Runner,
  World = Matter.World;

const POLITICAL_BIAS_COLOR_MAP = {
  "Left": "#2f66e9",
  "Lean Left": "#4977ea",
  "Center": "#771cb6",
  "Mixed": "#771cb6",
  "Lean Right": "#ea7e7e",
  "Right": "#ea1919"
}

const shapeFactory = new ShapeFactory(screenWidth, screenHeight)

export async function render(container) {
  const engine = Engine.create();
  const world = engine.world;

  const render = Render.create({
    element: container,
    engine: engine,
    options: {
      width: screenWidth(),
      height: screenHeight(),
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

  const projectile = shapeFactory.createCircle(80, screenHeight() - 60, 60);
  const walls = shapeFactory.createWalls(60);
  World.add(world, [projectile].concat(walls));

  await spawnNewsBlocks(render, world)
  addCollisionListener(world, engine);
  addDocumentVisibilityListener(world, engine, render);

  Engine.run(engine);
}

function removeMouse(world) {
  const mouseConstraint = world.constraints.find(c => c.label === "Mouse Constraint")
  World.remove(world, mouseConstraint)
}
function addMouse(engine, world, render) {
  const mouse = Mouse.create(render.canvas),
    mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false
        }
      }
    });
  World.add(world, mouseConstraint);
  render.mouse = mouse;
}

async function spawnNewsBlocks(render, world) {
  const newsArticles = await fetch('/api/news.json').then(res => res.json())
  const newsBlocks = _shuffle(newsArticles.data).splice(0,30).map(article => {
    const newsRect = shapeFactory.createCircle(
      _random(30, render.options.width - 30),
      _random(30, render.options.height - 200),
      30,
      {
        isStatic: true,
        render: {
          fillStyle: POLITICAL_BIAS_COLOR_MAP[article.bias]
        }
      }
    );

    newsRect.href = article.link
    return newsRect;
  })

  World.add(world, newsBlocks)
}

function screenWidth() {
  return document.body.clientWidth;
}

function screenHeight() {
  return document.body.clientHeight;
}

function addDocumentVisibilityListener(world, engine, render) {
  document.addEventListener("visibilitychange", function () {
    const currentConstraints = world.constraints.map(c => c.label)

    if (document.visibilityState === 'visible' && !currentConstraints.includes("Mouse Constraint")) {
      addMouse(engine, world, render)
    } else {
      removeMouse(world);
    }
  });
}

function addCollisionListener(world, engine) {
  let lastArticleOpened = null;

  const collisionStart = function (event) {
    const collision = event.pairs[0];

    if (collision.bodyB.label !== "Circle Body") {return;} // then the ball is colliding with the ground
    if (collision.bodyA.href) {return;} // bodyA should always be the user's particle. Collisions between news articles are not allowed

    const particle = collision.bodyA;
    const article = collision.bodyB;

    if (!article.tiedToPlayer) {
      const constraint = Constraint.create({
        bodyA: lastArticleOpened ? lastArticleOpened : particle,
        bodyB: article,
        pointB: {x: 0, y: 0},
        pointA: {x: 0, y: 0},
        stiffness: 1
      })
      World.add(world, constraint)
      Matter.Body.setStatic(article, false);
      article.tiedToPlayer = true;
      article.isSensor = true;

      lastArticleOpened = article;
    }

    if (article.href && !article.previouslyLookedAt) {
      article.previouslyLookedAt = true;
      window.open(article.href, "_blank")
    }
  };
  Events.on(engine, 'collisionStart', collisionStart);
}
