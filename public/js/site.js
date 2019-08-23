'use strict';


(async function (window, document) {
    const api = (await import('/js/api.js')).default;
    const Scene = (await import('/js/scene.js')).default;

    const canvas = document.getElementById("renderCanvas");
    const engine = new BABYLON.Engine(canvas, true);
    const scene = new Scene(engine, canvas);

    const zone = await api.getZone("origin");

    await scene.loadZone(zone);
    
    engine.runRenderLoop(function () { scene.render(); });
    window.addEventListener("resize", function () { engine.resize(); });
})(window, window.document);
