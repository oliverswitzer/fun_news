import Matter from 'matter-js'

export const FunZoomHooks = {
  FunZoom: {
    mounted() {
      let Engine = Matter.Engine,
        Render = Matter.Render,
        World = Matter.World,
        Bodies = Matter.Bodies;

      const engine = Engine.create();

      // create a renderer
      const render = Render.create({
        element: document.body,
        engine: engine
      });

      const boxA = Bodies.rectangle(400, 200, 80, 80);
      const boxB = Bodies.rectangle(450, 50, 80, 80);
      const ground = Bodies.rectangle(400, 610, 810, 60, {isStatic: true});

      World.add(engine.world, [boxA, boxB, ground]);

      Engine.run(engine);

      Render.run(render);
    }
  }
}