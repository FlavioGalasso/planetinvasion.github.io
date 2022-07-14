import * as THREE from './libs/three/build/three.module.js';
import { EffectComposer } from './libs/three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from './libs/three/examples/jsm/postprocessing/RenderPass.js';
import { GlitchPass } from './libs/three/examples/jsm/postprocessing/GlitchPass.js';

class EffectsHandler{

    constructor(composer){
        this.composer = composer;
        this.clock = new THREE.Clock();
        this.clock.getElapsedTime();
        this.lowHealthThreshold = 40;
        this.lowAmmoThreshold = 5;
        this.glitchStarted = false;
        this.glitchDuration = 1;
    }

    update(hp,ammo){
    
            if (hp <= this.lowHealthThreshold || ammo <= this.lowAmmoThreshold){
                this.composer.passes[1].enabled = true;
                this.composer.passes[0].renderToScreen = false;
            }
            else{
                this.composer.passes[1].enabled = false;
                this.composer.passes[0].renderToScreen = true;
            }
        }

}

export {EffectsHandler};