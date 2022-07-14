import * as THREE from './libs/three/build/three.module.js';
class MapHandler{
    constructor(mapMesh, scene) {
        this.mesh = mapMesh.mesh.clone();
        this.scene = scene;
        
    }

    spawnMap(){
        this.scene.add(this.mesh);
    }

}

export{MapHandler};