class MyAirship extends CGFobject
{
    constructor(scene) 
    {
        super(scene);
        this.scene = scene;

        this.mainbody = new MySphere(scene, 16, 8);
        this.wing = new MyWings(scene);
        this.helices = new MyHelices(scene);
        this.gond = new MyGond(scene);
        this.flag = new MyPlane(scene, 20);
        this.holdflag = new MyUnitCube(scene);

        this.time = 0;
        this.timeShader = 0;
        this.VehicleSpeed = 0;
        this.waveshader = new CGFshader(scene.gl, 'shaders/flag.vert', 'shaders/flag.frag');
        this.waveshader_ot = new CGFshader(scene.gl, 'shaders/otherside.vert', 'shaders/flag.frag');
        

        this.waveshader.setUniformsValues({VehicleSpeed: 0});
        this.waveshader.setUniformsValues({timeShader: this.time});
        this.waveshader_ot.setUniformsValues({VehicleSpeed: 0});
        this.waveshader_ot.setUniformsValues({timeShader: this.time});
        this.waveshader.setUniformsValues({uSampler1: 1})
        this.initMaterialsTex(scene);//materiais a usar
             
        

        this.initBuffers();
    }
    initMaterialsTex(){
        //materiais a aplicar nas várias formas que constituem o airship

        this.vermelho = new CGFappearance(this.scene);
        this.vermelho.setAmbient(0.5, 0.5, 0.5, 1);
        this.vermelho.setDiffuse(0.6, 0.6, 0.6, 1);
        this.vermelho.setSpecular(0.2, 0.2, 0.2, 1);
        this.vermelho.setShininess(10.0);
        this.vermelho.loadTexture('images/red.jpg');
        this.vermelho.setTextureWrap('REPEAT', 'REPEAT');

        this.branco = new CGFappearance(this.scene);
        this.branco.setAmbient(0.5, 0.5, 0.3, 1);
        this.branco.setDiffuse(0.46, 0.6, 0.6, 1);
        this.branco.setSpecular(0.2, 0.2, 0.2, 1);
        this.branco.setShininess(10.0);
        this.branco.loadTexture('images/branco.jpg');
        this.branco.setTextureWrap('REPEAT', 'REPEAT');

        this.preto = new CGFappearance(this.scene);
        this.preto.setAmbient(0.5, 0.5, 0.5, 1);
        this.preto.setDiffuse(0.6, 0.6, 0.6, 1);
        this.preto.setSpecular(0.2, 0.2, 0.2, 1);
        this.preto.setShininess(10.0);
        this.preto.loadTexture('images/preto.jpg');
        this.preto.setTextureWrap('REPEAT', 'REPEAT');

        this.socrates = new CGFappearance(this.scene);
        this.socrates.setAmbient(0.5, 0.5, 0.5, 1);
        this.socrates.setDiffuse(0.6, 0.6, 0.6, 1);
        this.socrates.setSpecular(0.2, 0.2, 0.2, 1);
        this.socrates.setShininess(10.0);
        this.socrates.loadTexture('images/socrates.png');
        this.socrates.setTextureWrap('REPEAT', 'REPEAT');
       
        //Material a aplicar na bandeira
        this.flagTex = new CGFappearance(this.scene);
        this.flagTex.setAmbient(0.1, 0.1, 0.1, 1);
        this.flagTex.setDiffuse(0.9, 0.9, 0.9, 1);
        this.flagTex.setSpecular(0.1, 0.1, 0.1, 1);
        this.flagTex.setShininess(10.0);
        this.flagTex.loadTexture('images/Portugal_flag.png');
        this.flagTex.setTextureWrap('REPEAT', 'REPEAT');

        this.normal = new CGFappearance(this.scene);

        this.flagtexx = new CGFtexture(this.scene, 'images/Portugal_flag.png');

    }

   
    display(autopilot)
    {     
        //main Body
        this.scene.pushMatrix();
        this.socrates.apply(); // aplicar a textura ao main body
        this.scene.scale(0.5,0.5,1);
        this.mainbody.display();
        this.scene.popMatrix();

        //parte de Baixo (cilindro e esferas)
        this.scene.pushMatrix();
        this.preto.apply(); // aplicar a textura a gondola
        this.scene.translate(0,-0.5,0);
        this.scene.scale(0.1,0.1,0.1);
        this.gond.display();
        this.scene.popMatrix();

        //Helices
        //H1
        this.scene.pushMatrix();

        this.preto.apply(); // aplicar a textura as helices

        this.scene.pushMatrix();
        this.scene.translate(-0.12, -0.55, -0.30);
        this.scene.rotate(this.scene.vehicle.helicesangle, 0, 0, 1);  // fazer com que as helices girem
        this.scene.scale(0.012, 0.012, 0.012);
        this.helices.display();
        this.scene.popMatrix();

        //H2
        this.scene.pushMatrix();
        this.scene.translate(0.12, -0.55, -0.30);
        this.scene.rotate(this.scene.vehicle.helicesangle, 0, 0, 1); // fazer com que as helices girem
        this.scene.scale(0.012, 0.012, 0.012);
        this.helices.display();
        this.scene.popMatrix();

        this.scene.popMatrix();

        // Motor das helices ( esferas)
        this.scene.pushMatrix();

        this.branco.apply(); 
        
        this.scene.translate(0.12, -0.55, -0.2)
        this.scene.scale(0.045,0.045,0.1);
        this.mainbody.display();
        this.scene.popMatrix();

        // Motor das helices ( esferas)
        this.scene.pushMatrix();

        this.branco.apply();
        this.scene.translate(-0.12, -0.55, -0.2)
        this.scene.scale(0.045,0.045,0.1);
        this.mainbody.display();
        this.scene.popMatrix();

        //Moving Wings
        //W1 Horizontal
        this.scene.pushMatrix()

        this.vermelho.apply(); // aplicar a todas as asas

        this.scene.pushMatrix();
        this.scene.translate(0.25, 0, -0.7);
        //Inclinaoçao das asas quando se pressiona a tecla "ArrowDown" e quando nao esta em autopilot
        if ((this.scene.gui.isKeyPressed("ArrowDown") || this.scene.vehicle.state === 3)  && !this.scene.vehicle.autopilot)
            this.scene.rotate(Math.PI / 8.0, 1, 0, 0);
        if ((this.scene.gui.isKeyPressed("ArrowUp") || this.scene.vehicle.state === 4 ) && !this.scene.vehicle.autopilot)
            this.scene.rotate(-Math.PI / 8.0, 1, 0, 0);
        this.scene.rotate(90*Math.PI/180.0, 0, 0, 1);
        this.wing.display();
        this.scene.popMatrix();

         //W2 Horizontal
         this.scene.pushMatrix();
         this.scene.translate(-0.25, 0, -0.7);
         //Inclinaoçao das asas quando se pressiona a tecla "ArrowDown" e quando nao esta em autopilot
         if ((this.scene.gui.isKeyPressed("ArrowDown") || this.scene.vehicle.state === 3 ) && !this.scene.vehicle.autopilot)
             this.scene.rotate(Math.PI / 8.0, 1, 0, 0);
         if ((this.scene.gui.isKeyPressed("ArrowUp") || this.scene.vehicle.state === 4 ) && !this.scene.vehicle.autopilot)
             this.scene.rotate(-Math.PI / 8.0, 1, 0, 0);
         this.scene.rotate(90*Math.PI/180.0, 0, 0, 1);
         this.wing.display();
         this.scene.popMatrix();
 
         //W3 Vertical
         this.scene.pushMatrix();
         this.scene.translate(0, 0.25, -0.7);
        if (this.scene.vehicle.autopilot)  // Se estiver em autopilot, as asas horizontais vao estar sempre inclinadas
            this.scene.rotate(Math.PI / 9.0, 0, 1, 0);
        else{
            if (this.scene.gui.isKeyPressed("KeyD"))
                this.scene.rotate(Math.PI / 9.0, 0, 1, 0);
            if (this.scene.gui.isKeyPressed("KeyA"))
                this.scene.rotate(-Math.PI / 9.0, 0, 1, 0);
        }
         this.wing.display();
         this.scene.popMatrix();
 
         //W4 Vertical
         this.scene.pushMatrix();
         this.scene.translate(0, -0.25, -0.7);
        if(this.scene.vehicle.autopilot) // Se estiver em autopilot, as asas horizontais vao estar sempre inclinadas
            this.scene.rotate(Math.PI / 9.0, 0, 1, 0);
        else{
            if (this.scene.gui.isKeyPressed("KeyD"))
                this.scene.rotate(Math.PI / 9.0, 0, 1, 0);
            if (this.scene.gui.isKeyPressed("KeyA"))
                this.scene.rotate(-Math.PI / 9.0, 0, 1, 0);
        }
        this.wing.display();
        this.scene.popMatrix();

        this.scene.popMatrix();


        if (this.scene.displayFlag === true) {
            // Flag Side 1
            this.scene.setActiveShader(this.waveshader_ot);
            this.scene.pushMatrix();
            this.flagtexx.bind();

            this.scene.translate(0,0,-2.5);
            this.scene.scale(1,0.5,1.3);
            this.scene.rotate(-90*Math.PI/180.0,0,1,0);
            this.flag.display();
            this.scene.popMatrix();
            this.scene.setActiveShader(this.scene.defaultShader);

            // Flag Side 2
            this.waveshader.setUniformsValues({uSampler1: 0})
            this.scene.setActiveShader(this.waveshader);
            this.scene.pushMatrix();
            this.scene.translate(0,0,-2.5);
            this.scene.scale(1,0.5,1.3);
            this.scene.rotate(90*Math.PI/180.0,0,1,0);
            this.flag.display();
            this.scene.popMatrix();
            this.scene.setActiveShader(this.scene.defaultShader);

            // Holder to Flag
            this.scene.pushMatrix();
            this.scene.translate(0, 0, -1);
            this.scene.rotate(16 * Math.PI / 180.0, 1, 0, 0);
            this.scene.scale(0.005, 0.005, 1.8);
            this.holdflag.display(1);
            this.scene.popMatrix();

            // Holder to Flag
            this.scene.pushMatrix();
            this.scene.translate(0, 0, -1);
            this.scene.rotate(-16 * Math.PI / 180.0, 1, 0, 0);
            this.scene.scale(0.005, 0.005, 1.8);
            this.holdflag.display(1);
            this.scene.popMatrix();
        }
    }

    //Dar update do tempo e da veocidade do veiculo, diminuindo ou aumentado a velocidade de movimento da bandeira, variando movimento da bandeira
    update(elapsedTime, speed)
    {
        this.time += elapsedTime;
        this.waveshader.setUniformsValues({timeShader: this.time});
        this.waveshader.setUniformsValues({VehicleSpeed: speed});
        this.waveshader_ot.setUniformsValues({timeShader: this.time});
        this.waveshader_ot.setUniformsValues({VehicleSpeed: speed});
    }


    setFillMode() {this.primitiveType=this.scene.gl.TRIANGLES;}
    
    setLineMode() {this.primitiveType=this.scene.gl.LINE_STRIP;}//ou strip?


}