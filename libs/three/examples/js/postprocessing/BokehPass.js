( function () {

	/**
 * Depth-of-field post-process with bokeh shader
 */

	class BokehPass extends THREE.Pass {

		constructor( scene, camera, params ) {

			super();
			this.scene = scene;
			this.camera = camera;
			const focus = params.focus !== undefined ? params.focus : 1.0;
			const aspect = params.aspect !== undefined ? params.aspect : camera.aspect;
			const aperture = params.aperture !== undefined ? params.aperture : 0.025;
			const maxblur = params.maxblur !== undefined ? params.maxblur : 1.0; // render targets

			const width = params.width || window.innerWidth || 1;
			const height = params.height || window.innerHeight || 1;
			this.renderTargetDepth = new THREE.WebGLRenderTarget( width, height, {
				minFilter: THREE.NearestFilter,
				magFilter: THREE.NearestFilter
			} );
			this.renderTargetDepth.texture.name = 'BokehPass.depth'; // depth material

			this.materialDepth = new THREE.MeshDepthMaterial();
			this.materialDepth.depthPacking = THREE.RGBADepthPacking;
			this.materialDepth.blending = THREE.NoBlending; // bokeh material

			if ( THREE.BokehShader === undefined ) {

				console.error( 'THREE.BokehPass relies on THREE.BokehShader' );

			}

			const bokehShader = THREE.BokehShader;
			const bokehUniforms = THREE.UniformsUtils.clone( bokehShader.uniforms );
			bokehUniforms[ 'tDepth' ].value = this.renderTargetDepth.texture;
			bokehUniforms[ 'focus' ].value = focus;
			bokehUniforms[ 'aspect' ].value = aspect;
			bokehUniforms[ 'aperture' ].value = aperture;
			bokehUniforms[ 'maxblur' ].value = maxblur;
			bokehUniforms[ 'nearClip' ].value = camera.near;
			bokehUniforms[ 'farClip' ].value = camera.far;
			this.materialBokeh = new THREE.ShaderMaterial( {
				defines: Object.assign( {}, bokehShader.defines ),
				uniforms: bokehUniforms,
				vertexShader: bokehShader.vertexShader,
				fragmentShader: bokehShader.fragmentShader
			} );
			this.uniforms = bokehUniforms;
			this.needsSwap = false;
			this.fsQuad = new THREE.FullScreenQuad( this.materialBokeh );
			this._oldClearColor = new THREE.Color();

		}

		render( renderer, writeBuffer, readBuffer
			/*, deltaTime, maskActive*/
		) {

			// Render depth into texture
			this.scene.overrideMaterial = this.materialDepth;
			renderer.getClearColor( this._oldClearColor );
			const oldClearAlpha = renderer.getClearAlpha();
			const oldAutoClear = renderer.autoClear;
			renderer.autoClear = false;
			renderer.setClearColor( 0xffffff );
			renderer.setClearAlpha( 1.0 );
			renderer.setRenderTarget( this.renderTargetDepth );
			renderer.clear();
			renderer.render( this.scene, this.camera ); // Render bokeh composite

			this.uniforms[ 'tColor' ].value = readBuffer.texture;
			this.uniforms[ 'nearClip' ].value = this.camera.near;
			this.uniforms[ 'farClip' ].value = this.camera.far;

			if ( this.renderToScreen ) {

				renderer.setRenderTarget( null );
				this.fsQuad.render( renderer );

			} else {

				renderer.setRenderTarget( writeBuffer );
				renderer.clear();
				this.fsQuad.render( renderer );

			}

			this.scene.overrideMaterial = null;
			renderer.setClearColor( this._oldClearColor );
			renderer.setClearAlpha( oldClearAlpha );
			renderer.autoClear = oldAutoClear;

		}

	}

	THREE.BokehPass = BokehPass;

} )();
