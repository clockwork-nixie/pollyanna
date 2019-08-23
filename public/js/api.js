'use strict';

export default {
    getZone: function (zoneName) {
        return {
            name: zoneName,
            materials: { "demo": "/images/demo.jpg" },
            models: { "example": { file: "/models/example.obj", isComputeNormals: true, meshes: { "triangle": { sharedMaterial: "demo" } } } },
            presets: { "ball" : { type: "sphere", options: { diameter: 2 }, x:5, y: 0, z: 5 } },
            sounds: { "opendoor": "/sounds/opendoor1.wav" }
        };
    }
};
