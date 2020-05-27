/**
* MyScene
* @constructor
*/
class MyScene extends CGFscene {
    constructor() {
        super();
        this.texture = null;
        this.appearance = null;

        //seleção inicial na interface
        
        this.displayVehicle = true;
        this.selectedTexture = 0;
    }
    init(application) {
        super.init(application);
        this.initCameras();
        this.initLights();

        //Background color
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);
        
        
        this.enableTextures(true);


        //Initialize scene objects
        this.axis = new CGFaxis(this);
        this.vehicle = new MyVehicle(this, 4);
        this.Terrain = new MyTerrain(this);
        this.cubeMap = new MyCubeMap(this);
        this.airship = new MyAirship(this);
        
        this.cube = new MyUnitCube(this);
        this.billboard = new MyBillboard(this);
        

        
        //Material para aplicar texturas
        this.materialCube = new CGFappearance(this);
        this.materialCube.setAmbient(0.1, 0.1, 0.1, 1);
        this.materialCube.setDiffuse(0.9, 0.9, 0.9, 1);
        this.materialCube.setSpecular(0.1, 0.1, 0.1, 1);
        this.materialCube.setShininess(10.0);
        this.materialCube.loadTexture('images/cubemap.png');  
        this.materialCube.setTextureWrap('REPEAT', 'REPEAT');

       
       //supplies
        this.supplies = [
            new MySupply(this),
            new MySupply(this),
            new MySupply(this),
            new MySupply(this),
            new MySupply(this),
        ];

       
        //Objects connected to MyInterface and vehicle

        this.displayAxis = true;
        this.displayVehicle = true;
        this.displayTerrain = true;
        this.selectedCubeTex = false;
        this.displayFlag = true;
        this.displayAxis = true;
        this.displayCubeMap = true;


        this.displaySpeedFactor = 1;

        
        this.displayScaleFactorVehicle = 3;
         
        this.displayScaleFactorTerrain = 1;
        this.displayScale = 1;


        //Objects connected to MyVehicle
        this.angleInc = 5;
        this.constSpeed = 1; 


        //texturas possíveis para o cubeMap
        this.textures = [
            new CGFtexture(this, 'images/earth.jpg'),
            new CGFtexture(this, 'images/cubemap.png'),
            new CGFtexture(this, 'images/testMap.jpg'),
            new CGFtexture(this, 'images/testCubeMap.jpg'),
            new CGFtexture(this, 'images/earth.jpg'),
            new CGFtexture(this,'images/lavaWorld.png')
        ];
        this.textureList = {
            'Earth' : 0,
            'CubeMap' : 1,
            'TestFaces' : 2,
            'TestAjustes' : 3,
            'Earth' : 4,
            'LavaWorld':5
        };

        this.heightmap = new CGFtexture(this, 'images/heightmap.jpg');


        this.setUpdatePeriod(1000/60);
        
        //tempo do ultimo update
        this.lastUpdate = 0;

        //Numero de supplys foram lançados
        this.nSupplyDelivered = 0;

        
        
        this.timeafter = Number.MAX_VALUE;

        

    }
    initLights() {
        this.lights[0].setPosition(15, 2, 5, 1);
        this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
        this.lights[0].enable();
        this.lights[0].update();
    }
    initCameras() {
        this.camera = new CGFcamera(1.0, 0.2, 500, vec3.fromValues(23, 20, 21), vec3.fromValues(0, 6, 0));
    }
    setDefaultAppearance() {
        this.setAmbient(0.2, 0.4, 0.8, 1.0);
        this.setDiffuse(0.2, 0.4, 0.8, 1.0);
        this.setSpecular(0.2, 0.4, 0.8, 1.0);
        this.setShininess(10.0);
    }
    

    checkKeys() {
        var text="Keys pressed: ";
        var keysPressed=false;
        // Check for key codes e.g. in https://keycode.info/

        //Aumenta a Velocidade
        if (this.gui.isKeyPressed("KeyW")) {
            
            keysPressed=true;
            this.vehicle.acelerate(0.01 * this.constSpeed );
        }

        //Diminui a Velocidade
        if (this.gui.isKeyPressed("KeyS")) {
            
            keysPressed=true;
            this.vehicle.acelerate(-this.constSpeed * 0.05 );
        }

        //Move-se para a esquerda
        if(this.gui.isKeyPressed("KeyA") && !this.vehicle.autopilot){

            keysPressed = true;
            this.vehicle.turn(this.angleInc);
        }
        //Move-se para a direita
        if(this.gui.isKeyPressed("KeyD") && !this.vehicle.autopilot){
            
            keysPressed = true;
            
            this.vehicle.turn(-this.angleInc);
        }

        //Sobe sem haver inclinaçao do veiculo
        if (this.gui.isKeyPressed("KeyU") && !this.vehicle.autopilot){
            keysPressed = true;
            this.vehicle.rise(0.1);
        }

         //Desce sem haver inclinaçao do veiculo
        if (this.gui.isKeyPressed("KeyJ") && !this.vehicle.autopilot){
            this.vehicle.rise(-0.1);
            keysPressed = true;
        }

        //Sobe havendo inclinacao
        if (this.gui.isKeyPressed("ArrowDown") && !this.vehicle.autopilot){
            this.vehicle.pitch(3);
            keysPressed = true;
        }

        //Desce havendo inclinacao
        if (this.gui.isKeyPressed("ArrowUp") && !this.vehicle.autopilot){
            this.vehicle.pitch(-3);
            keysPressed = true;
        }

        //Dá reset no veiculo
        if(this.gui.isKeyPressed("KeyR")){;
            keysPressed = true;
            this.vehicle.reset();
            this.nSupplyDelivered = 0;
            for (var i=0 ; i<5; i++){
                this.supplies[i].state = SupplyStates.INACTIVE;
                this.supplies[i].passedtime = 0;
                this.supplies[i].positionXYZ[1] = 9;
            }
            
        }

        //Larga o supply
        if (this.gui.isKeyPressed("KeyL")) {
            keysPressed = true;
            if (this.nSupplyDelivered != 5 && this.timeafter > 500) {
                this.supplies[this.nSupplyDelivered].drop(this.vehicle.positionXYZ[0], this.vehicle.positionXYZ[2]);
                this.nSupplyDelivered++;
                this.timeafter = 0;
            }   

        }

        //Ativa o Auto-Pilot
        if (this.gui.isKeyPressed("KeyP")){
            this.vehicle.activateAutopilot();
            keysPressed = true;
        }

        if (keysPressed)
            console.log(text);
     }

    // called periodically (as per setUpdatePeriod() in init())
    update(t) {
        //Verifica o tempo passado desde o ultimo updade e guarda-o  em elapsedtime
        if (this.lastUpdate === 0)
            this.lastUpdate = t;
        let elapsedTime = t - this.lastUpdate;
        this.lastUpdate = t;

        this.checkKeys();
        
        this.vehicle.update(elapsedTime);
       
        for (var i=0 ; i<5; i++){
            this.supplies[i].update(elapsedTime);
        }

        
        this.timeafter += elapsedTime;
        this.vehicle.speed *= this.displaySpeedFactor;
    }
    

     //Function that resets selected texture we choose
    updateCubeMapTexture() {
        this.materialCube.setTexture(this.textures[this.selectedTexture]);
    }

    onSelectedTextureChanged(v) {
        // update textures mode when the object changes
        this.materialCube.setTexture(this.textures[this.selectedTexture]);
    }
    

    display() {
        // ---- BEGIN Background, camera and axis setup
        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        
        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();
        
        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();
        this.setDefaultAppearance();
       
       
        // Draw axis
        this.pushMatrix();
        if (this.displayAxis){
            
            this.scale(this.displayScale, this.displayScale, this.displayScale);
          
            this.axis.display();
           
        }
        
        
        if(this.displayVehicle){
            this.pushMatrix();
            
            this.translate(this.vehicle.positionXYZ[0],this.vehicle.positionXYZ[1],this.vehicle.positionXYZ[2]);//colocar na posição inicial
            this.scale(this.displayScaleFactorVehicle, this.displayScaleFactorVehicle, this.displayScaleFactorVehicle);
            this.translate(-this.vehicle.positionXYZ[0],-this.vehicle.positionXYZ[1],-this.vehicle.positionXYZ[2]);//colocar na origem
           
            this.vehicle.display();
           
            
            this.popMatrix();
    
        }

        if(this.displayTerrain){
        
            this.pushMatrix();
            this.scale(this.displayScaleFactorTerrain, this.displayScaleFactorTerrain, this.displayScaleFactorTerrain);
            this.Terrain.display();
            this.billboard.display();
            this.popMatrix();
        }
    
         for (var i=0 ; i<5; i++){
            this.supplies[i].display();
        }

        if(this.displayCubeMap){
            this.materialCube.apply();
            this.updateCubeMapTexture();

            if(this.selectedTexture == 1)
                this.cubeMap.display();    
            
            else{this.pushMatrix();
                this.pushMatrix();
                this.translate(0,24,0);
                this.cubeMap.display();
                this.popMatrix();

        }
    }
        

    }   



}
