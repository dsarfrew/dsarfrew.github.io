const SupplyStates = {
    INACTIVE: 0,
    FALLING: 1,
    LANDED: 2
};

class MySupply extends CGFobject {
    constructor(scene) {
        super(scene);
        //Posiçao de partida do supply
        this.positionXYZ = [this.scene.vehicle.positionXYZ[0], this.scene.vehicle.positionXYZ[1] - 1.0, this.scene.vehicle.positionXYZ[2]];   
        this.fallingPoint = this.scene.vehicle.positionXYZ[1];
        this.passedtime = 0;
        this.box = new MyUnitCube(this.scene);
        this.state = SupplyStates.INACTIVE; 
        this.package = new MyUnitCube(this.scene);
        this.initMaterials();
    }

    initMaterials() {
        //Textura da caixa a cair
        this.texture = new CGFappearance(this.scene);
        this.texture.setAmbient(0.3, 0.3, 0.3, 1);
        this.texture.setDiffuse(0.4, 0.4, 0.4, 1);
        this.texture.setSpecular(0.1, 0.1, 0.1, 1);
        this.texture.setShininess(10.0);
        this.texture.loadTexture('images/supply2.png');
        this.texture.setTextureWrap('REPEAT', 'REPEAT');

        //Textura da caixa que foi largada no chao
        this.cross = new CGFappearance(this.scene);
        this.cross.setAmbient(0.3, 0.3, 0.3, 1);
        this.cross.setDiffuse(0.4, 0.4, 0.4, 1);
        this.cross.setSpecular(0.1, 0.1, 0.1, 1);
        this.cross.setShininess(10.0);
        this.cross.loadTexture('images/cruz_vermelha.jpg');
        this.cross.setTextureWrap('REPEAT', 'REPEAT');
    }

    //Com o passar do tempo, colocar a posiçao do y cada vez menor, atualizando-a
    //Quando chega a y = 0.4, chamar land() que muda o estado do supply para landed 
    update(elapsedtime) {
        if (this.state === SupplyStates.FALLING) {
            // Se chegou ao fim, chamar land
            this.passedtime += elapsedtime;
            this.positionXYZ[1] = this.fallingPoint - (this.passedtime * 0.0030);
            if (this.positionXYZ[1] <= 0.1)
                this.land();
        }
        
        if (this.state === SupplyStates.INACTIVE) {
            this.fallingPoint = this.scene.vehicle.positionXYZ[1] - 1.0;
        }
    }

    //Muda o estado para falling e atualiza as posiçoes x e z do supply
    drop(dropx, dropz){
        this.state = SupplyStates.FALLING;
        this.positionXYZ[0] = dropx;
        this.positionXYZ[2] = dropz;
    }

    //Muda o estado para landed e da update da billboard para aumentar o numero de supplies que cairam
    land(){
        this.positionXYZ[1] = 0.6;
        this.state = SupplyStates.LANDED;
        this.scene.billboard.updateBillboard();
    }

    display() {

        
        this.texture.apply();
        
       
            this.scene.pushMatrix();
        if (this.state === SupplyStates.LANDED)
            this.scene.translate(0, -0.09, 0);
        this.scene.translate(this.positionXYZ[0], this.positionXYZ[1], this.positionXYZ[2]);
        this.box.display(this.state); // da dispplay do supply dependendo do seu estado (cruz se estiver landed e um cubo se tiver falling)
        this.scene.popMatrix();

        if (this.state === SupplyStates.LANDED) {
            this.cross.apply();
         
            this.scene.pushMatrix();
            this.scene.translate(this.positionXYZ[0], this.positionXYZ[1] - 0.30, this.positionXYZ[2]);
            this.scene.scale(0.5, 0.5, 0.5);
            this.package.display(1);
            this.scene.popMatrix();
        }
    }
}