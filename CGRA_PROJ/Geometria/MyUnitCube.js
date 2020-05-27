/**
 * MyUnitCubeQuad
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyUnitCube extends CGFobject {
    constructor(scene) {
        super(scene);
        this.face = new MyQuad(this.scene);
    }

    
    display(state) {

        //Se o supply estiver no estado de FALLING sera um cubo
        if (state === 1) {
            
            this.scene.pushMatrix();
            this.scene.translate(0, 0, 0.5);
            this.face.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
            this.scene.rotate(180.0 * Math.PI / 180.0, 0, 1, 0);
            this.scene.translate(0, 0, 0.5);
            this.face.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
            this.scene.translate(0.5, 0, 0);
            this.scene.rotate(90.0 * Math.PI / 180.0, 0, 1, 0);
            this.face.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
            this.scene.translate(-0.5, 0, 0);
            this.scene.rotate(-90.0 * Math.PI / 180.0, 0, 1, 0);
            this.face.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
            this.scene.translate(0, 0.5, 0);
            this.scene.rotate(-90.0 * Math.PI / 180.0, 1, 0, 0);
            this.face.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
            this.scene.translate(0, -0.5, 0);
            this.scene.rotate(90.0 * Math.PI / 180.0, 1, 0, 0);
            this.face.display();
            this.scene.popMatrix();
            
        }
        //Se o supply estiver no state LANDED, sera desenhado uma cruz
        if (state === 2) {
            this.scene.pushMatrix();
            this.scene.translate(0, -0.5, 1);
            this.scene.rotate(Math.PI / 2.0, 1, 0, 0);
            this.scene.rotate(Math.PI, 0, 1, 0);
            this.face.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
            this.scene.translate(0, -0.5, -1);
            this.scene.rotate(-Math.PI / 2.0, 1, 0, 0);
            this.face.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
            this.scene.translate(1, -0.5, 0);
            this.scene.rotate(Math.PI / 2.0, 0, 0, 1);
            this.scene.rotate(Math.PI / 2.0, 0, 1, 0);
            this.face.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
            this.scene.translate(-1, -0.5, 0);
            this.scene.rotate(-Math.PI / 2.0, 0, 0, 1);
            this.scene.rotate(-Math.PI / 2.0, 0, 1, 0);
            this.face.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
            this.scene.translate(0, -0.5, 0);
            this.scene.rotate(-90.0 * Math.PI / 180.0, 1, 0, 0);
            this.face.display();
            this.scene.popMatrix();
        }
    }
}