'use strict';

var canvas = document.getElementById("renderCanvas");
var engine = new BABYLON.Engine(canvas, true);


var createScene = function () {
    var scene = new BABYLON.Scene(engine);
    var camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, new BABYLON.Vector3(0,0,5), scene);

    camera.attachControl(canvas, true);

    new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
    var light = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 1, -1), scene);

    light.diffuse = new BABYLON.Color3(1, 1, 1);
    light.specular = new BABYLON.Color3(1, 1, 1);
    light.intensity = 0.8;
    
    var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter:2}, scene);
    var openDoorSound = new BABYLON.Sound("opendoorsound", "sounds/opendoor1.wav", scene, null);
    var customMesh;
    
    //customMesh = new BABYLON.Mesh("custom", scene);

    var positions = [
        -5,  2, -3, 
        -7, -2, -3, 
        -3, -2, -3,
        -5,  0, -5
    ];
    var indices = [2, 1, 3, 1, 0, 3, 0, 2, 3];
    var colors = [
        1, 0, 0, 1,
        0, 1, 0, 1,
        0, 0, 1, 1,
        0, 0, 0, 1
    ];
    var normals = [];
    
    BABYLON.VertexData.ComputeNormals(positions, indices, normals);
    
    var vertexData = new BABYLON.VertexData();
    
    vertexData.positions = positions;
    vertexData.indices = indices;
    vertexData.colors = colors;
    vertexData.normals = normals;
    //vertexData.applyToMesh(customMesh);

    BABYLON.OBJFileLoader.COMPUTE_NORMALS = true;

    BABYLON.SceneLoader.LoadAssetContainer("/models/", "foo.obj", scene, function (container) {
        var material = new BABYLON.StandardMaterial("concrete", scene);

        material.diffuseTexture = new BABYLON.Texture("/images/foo.jpg", scene);

        customMesh = container.meshes[0];
        customMesh.name = "custom";
        customMesh.material = material;
        container.addAllToScene();
    });

    var target = sphere;
    var glow = null;

    window.addEventListener("click", function () {
        var pickResult = scene.pick(scene.pointerX, scene.pointerY);

        if (pickResult.hit && pickResult.pickedMesh === target) {
            openDoorSound.play();
            //vertexData.indices = [2, 1, 0];
            //vertexData.applyToMesh(customMesh);

            if (glow) {
                glow.dispose();
                glow = null;
            } else {
                glow = new BABYLON.GlowLayer("glow", scene);
                glow.addIncludedOnlyMesh(customMesh);

                glow.customEmissiveColorSelector = function(mesh, subMesh, material, result) {                  
                    // This isn't needed because the add-included does the filter
                    // if (mesh.name === "custom") {
                        result.set(1, 0, 1, .1);
                    // } else {
                    //    result.set(0, 0, 0, 0);
                    // }
                }
            }
        }
    });

    engine.runRenderLoop(function () { scene.render(); });
};

createScene();

window.addEventListener("resize", function () { engine.resize(); });