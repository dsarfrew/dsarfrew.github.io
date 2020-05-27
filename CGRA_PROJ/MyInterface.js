/**
* MyInterface
* @constructor
*/
class MyInterface extends CGFinterface {
    constructor() {
        super();
    }

    init(application) {
        // call CGFinterface init
        super.init(application);
        // init GUI. For more information on the methods, check:
        // http://workshop.chromeexperiments.com/examples/gui
        this.gui = new dat.GUI();
        
        var obj = this;

        //Checkbox element in GUI
        this.gui.add(this.scene, 'displayAxis').name('Display Axis');
        
        
        //Manipulação de fatores para o veículo
        this.gui.add(this.scene,'displaySpeedFactor',0.1, 3).name('SpeedFactor');

        this.gui.add(this.scene, 'displayScale', 0.1, 5).name('ScaleAxis');
       
        this.gui.add(this.scene, 'displayScaleFactorVehicle', 0.5, 10).name('ScaleVehicle');
            
        this.gui.add(this.scene, 'displayScaleFactorTerrain', 0.1, 3).name('ScaleTerrain');
        
        
        //Texturas
        this.gui.add(this.scene, 'selectedTexture', this.scene.textureList).onChange(this.scene.onSelectedTextureChanged.bind(this.scene));

        this.gui.add(this.scene, 'displayFlag').name('Display Flag');
        
        this.gui.add(this.scene, 'displayVehicle').name('Vehicle');

        this.gui.add(this.scene, 'displayCubeMap').name('CubeMap');

        this.gui.add(this.scene, 'displayTerrain').name('Terrain');

        

        
        this.initKeys();
 
        return true;


    }
    

    initKeys() {
        // create reference from the scene to the GUI
        this.scene.gui=this;
        // disable the processKeyboard function
        this.processKeyboard=function(){};
        // create a named array to store which keys are being pressed
        this.activeKeys={};
     }
     processKeyDown(event) {
            // called when a key is pressed down
            // mark it as active in the array
            this.activeKeys[event.code]=true;
    }

    processKeyUp(event) {
            // called when a key is released, mark it as inactive in the array
            this.activeKeys[event.code]=false;
    }

    isKeyPressed(keyCode) {
            // returns true if a key is marked as pressed, false otherwise
            return this.activeKeys[keyCode] || false;
    }

}