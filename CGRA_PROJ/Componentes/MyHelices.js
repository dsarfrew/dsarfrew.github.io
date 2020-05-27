class MyHelices extends CGFobject{
    constructor(scene) {
        super(scene);
        this.scene = scene;
        this.sphere = new MySphere(scene, 16, 8);
        this.initBuffers();
    }

    display() {

        //Alongando a esfera, atraves do scale, obtemos as helices
        this.scene.pushMatrix();
        this.scene.translate(-0.3, 3, 0);
        
        this.scene.scale( 0.2 ,3, 0.3);
        this.scene.translate(1,-1,0);
        this.sphere.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.scale(0.7, 0.7, 0.7)
        this.sphere.display();
        this.scene.popMatrix();
    }
}