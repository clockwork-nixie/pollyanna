'use strict';

export default {
    getZone: function (zoneName) {
        return {
            name: zoneName,
            models: { "example": { file: "/models/example.obj", isComputeNormals: true } },
            presets: { "ball" : { type: "sphere", options: { diameter: 2 }, x:5, y: 0, z: 5 } },
            sounds: { "opendoor": "/sounds/opendoor1.wav" }
        };
    }
};
