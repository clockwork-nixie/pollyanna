'use strict';


function bindKeys(scene, camera) {
    const actionManager = scene.actionManager;
    const map = {};
    const setKeys = evt => map[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";

    actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, setKeys));
    actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, setKeys));

    scene.registerAfterRender(() => {
        if ((map["a"] || map["A"])) {
            camera.position.x -= 0.4;
        }

        if ((map["w"] || map["W"])) {
            camera.position.z += 0.4;
        };

        if ((map["d"] || map["D"])) {
            camera.position.x += 0.4;
        };

        if ((map["s"] || map["S"])) {
            camera.position.z -= 0.4;
        };
    });
}


function loadMaterials(materials, scene) {
    const promises = [];

    for (const material in materials) {
        console.log(`Loading material: ${material} from ${materials[material]}`);

        const build = new BABYLON.StandardMaterial(material, scene);
        
        promises.push(new Promise(function (resolve) {
            const texture = new BABYLON.Texture(materials[material], scene, false, false, null, function () {
                console.log(`Loaded textture for material: ${material}`);

                build.ambientTexture = texture;
                build.diffuseTexture = texture;   
    
                resolve();
            });
        }));

        materials[material] = build;
    }
    return Promise.all(promises);
}


function loadModels(models, materials, scene) {
    const promises = [];

    for (const model in models) {
        const options = models[model];

        BABYLON.OBJFileLoader.COMPUTE_NORMALS = options.isComputeNormals;
        
        promises.push(BABYLON.SceneLoader.LoadAssetContainerAsync(options.file, null, scene).then(container => {
            if (options.meshes) {
                container.meshes.map(mesh => {
                    if (mesh.name && options.meshes[mesh.name]) {
                        const properties = options.meshes[mesh.name];
                        
                        if (properties.sharedMaterial) {
                            const material = materials[properties.sharedMaterial];

                            if (material) {                                    
                                console.log(`Added shared material ${properties.sharedMaterial} to ${mesh.name}`);
                                mesh.material = material;
                            } else {
                                console.error(`Missing shared material ${properties.sharedMaterial} for ${mesh.name}`);
                            }
                        }
                    }
                });
            }
            container.addAllToScene();
        }));
    }
    return Promise.all(promises);
}


function loadPresets(presets, scene) {
    for (const preset in presets) {
        const properties = presets[preset];
        let model = null;

        switch (properties.type) {
            case "sphere":
                model = BABYLON.MeshBuilder.CreateSphere(preset, properties.options, scene);
                break;

            default:
                console.error(`Unknown preset type ${properties.type} for preset: ${preset}`);
                break;
        }

        if (model) {
            model.position = new BABYLON.Vector3(properties.x || 0, properties.y || 0, properties.z || 0);
        }
        presets[preset] = model;
    }
}


function loadSounds(sounds, scene) {
    const promises = [];

    for (const sound in sounds) {
        console.log(`Loading sound: ${sound} from ${sounds[sound]}`);

        promises.push(new Promise(resolve =>
             sounds[sound] = new BABYLON.Sound(sound, sounds[sound], scene, () => {
                console.log(`Loaded sound: ${sound}`);
                resolve();
            })
        ));
    }
    return Promise.all(promises);
}


export default class Scene {
    constructor(engine, canvas, cameraPosition) {
        this._canvas = canvas;
        this._scene = new BABYLON.Scene(engine);
        this._scene.actionManager = new BABYLON.ActionManager(this._scene);

        this._camera = new BABYLON.UniversalCamera("UniversalCamera", cameraPosition || new BABYLON.Vector3(0, 0, -10), this._scene);
        this._camera.setTarget(BABYLON.Vector3.Zero());
        this._camera.attachControl(canvas, true);

        bindKeys(this._scene, this._camera);
    }


    async loadZone(zone) {
        const scene = this._scene;

        await Promise.all([
            loadMaterials(zone.materials, scene),
            loadSounds(zone.sounds, scene)
        ]);

        await loadModels(zone.models, zone.materials, scene);
        
        loadPresets(zone.presets, scene);
   
        new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
    }


    render() { this._scene.render(); }
};