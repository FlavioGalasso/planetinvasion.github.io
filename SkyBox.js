import * as THREE from './libs/three/build/three.module.js';

class SkyBox{

    constructor(filename){

        const skyboxTextureFullPath = "./skybox/" + filename + "_";
        const skyboxTextureImageType = ".jpg";
        this.skyboxTexture = new THREE.CubeTextureLoader().load([
            skyboxTextureFullPath + 'ft' + skyboxTextureImageType,
            skyboxTextureFullPath + 'bk' + skyboxTextureImageType,
            skyboxTextureFullPath + 'up' + skyboxTextureImageType,
            skyboxTextureFullPath + 'dn' + skyboxTextureImageType,
            skyboxTextureFullPath + 'rt' + skyboxTextureImageType,
            skyboxTextureFullPath + 'lf' + skyboxTextureImageType,
        ] );

    }

    
}

export {SkyBox};
