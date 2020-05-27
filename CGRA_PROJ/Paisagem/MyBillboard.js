class MyBillboard extends CGFobject {
    constructor(scene) {
        super(scene);

        this.board = new MyPlane(scene, 50);
        this.support = new MyPlane(scene, 50);
        this.progressbar = new MyPlane(scene, 50);

        this.billboardshader = new CGFshader(scene.gl, 'shaders/billboard.vert', 'shaders/billboard.frag');

        this.dropped = 0;

        this.billboardshader.setUniformsValues({ drops: 0 });
        this.plane = new MyPlane(scene, 20);
        this.initMaterials();
    }

    initMaterials() {
        this.boardTex = new CGFappearance(this.scene);
        this.boardTex.setAmbient(0.1, 0.1, 0.1, 1);
        this.boardTex.setDiffuse(0.9, 0.9, 0.9, 1);
        this.boardTex.setSpecular(0.1, 0.1, 0.1, 1);
        this.boardTex.setShininess(10.0);
        this.boardTex.loadTexture('images/Billboard.png');
        this.boardTex.setTextureWrap('REPEAT', 'REPEAT');

        this.legs = new CGFappearance(this.scene);
        this.legs.setAmbient(0.1, 0.1, 0.1, 1);
        this.legs.setDiffuse(0.1, 0.1, 0.1, 1);
        this.legs.setSpecular(0.1, 0.1, 0.1, 1);
        this.legs.setShininess(10.0);
        
    }
    // Ao pressionar "L", cai uma bomba, e damos update ao numero de bombas que cairam
    updateBillboard() {
        this.billboardshader.setUniformsValues({ drops: ++this.dropped});
    }
    // Ao pressionar "R", da-mos reset ao billboard, colocando o numero de bombas que cairam a 0 e damos update ao shader o billboard tambem
    resetBillboard() {
        this.dropped = 0;
        this.billboardshader.setUniformsValues({ drops: 0 });
    }

    display() {
        this.scene.pushMatrix();

        //Sitio onde colocar o billboard
        this.scene.translate(12, 4, 17);
        this.scene.rotate(Math.PI / 3.0, 0, 1, 0);

        this.boardTex.apply();
        this.scene.pushMatrix();
        this.scene.scale(4, 2, 2);
        this.board.display();
        this.scene.popMatrix();


        //Colocaçao do suporte do billboard ( 2 "pernas")
        this.legs.apply();
        this.scene.pushMatrix();
        this.scene.translate(-0.7, -1.5, 0);
        this.scene.scale(0.1, 1, 1);
        this.support.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0.7, -1.5, 0);
        this.scene.scale(0.1, 1, 1);
        this.support.display();
        this.scene.popMatrix();

        this.scene.setActiveShader(this.billboardshader);
        this.scene.pushMatrix();
        this.scene.translate(0, -0.15, 0.01);
        this.scene.scale(3, 0.4, 2);
        this.progressbar.display();
        this.scene.popMatrix();
        
        this.scene.popMatrix();

        this.scene.setActiveShader(this.scene.defaultShader);
    }

}   