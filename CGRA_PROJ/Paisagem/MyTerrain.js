class MyTerrain extends CGFobject {
    constructor(scene) {
        super(scene);
        this.scene = scene;
        
        this.plane = new MyPlane(scene, 20);

        this.terrainShader = new CGFshader(scene.gl, 'shaders/terrain.vert', 'shaders/terrain.frag');

        this.terrainShader.setUniformsValues({uSampler : 0});
        this.terrainShader.setUniformsValues({uSampler2 : 1});

        
        this.initMaterials();


        
    }

    initMaterials(){
        this.texture = new CGFappearance(this.scene);
        this.texture.setAmbient(0.3, 0.3, 0.3, 1);
        this.texture.setDiffuse(0.4, 0.4, 0.4, 1);
        this.texture.setSpecular(0.1, 0.1, 0.1, 1);
        this.texture.setShininess(10.0);
        this.texture.loadTexture('images/terrain.jpg');
        this.texture.setTextureWrap('REPEAT', 'REPEAT');

    }

    display() {
        //Aplicar o material e fazer bind do heightmap
        this.texture.apply();

        this.scene.setActiveShader(this.terrainShader);
        
        this.scene.heightmap.bind(1);

        this.scene.pushMatrix();

        this.scene.pushMatrix();
        //this.scene.translate(0,-25,0);
        this.scene.rotate(-Math.PI / 2.0, 1, 0, 0);
        this.scene.scale(50,50, 15);
        this.plane.display();

        this.scene.popMatrix();

        
        this.scene.setActiveShader(this.scene.defaultShader);
    }

}


