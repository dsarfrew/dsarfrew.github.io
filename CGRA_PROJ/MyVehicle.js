//Estados do airship, parecido com os do supply
const AircraftStates = {
    STABLE: 0,
    GOING_UP: 1,
    GOING_DOWN: 2,
    STABILIZING_DOWN: 3,
    STABILIZING_UP: 4,
};



class MyVehicle extends CGFobject
{
    constructor(scene, slices) 
    {
        super(scene);
        
        this.airship = new MyAirship(this.scene);
        this.helicesangle = 0;
        this.positionXYZ = [0.0,10.0,0.0];
        this.yTurnAngle = 0.0;
        this.xInclinationAngle = 0;
        this.autopilot = false;
        this.addedangle = 0;
        this.speed = 0.0;
        this.state = AircraftStates.STABLE;
        this.centerX = 0;
        this.centerZ = 0;


        this.maxAltitude = false;
        this.minAltitude = false;
        this.convertAngle = Math.PI/180.0;
              
        

        this.initBuffers();
        

    }


    

    initBuffers(){
       
        this.vertices = [];
        this.indices = [];
        this.normals = [];

        var ang = 0;
        var alphaAng = 2*Math.PI/this.slices;
        

        for(var i = 0; i < this.slices; i++){
            // All vertices have to be declared for a given face
            // even if they are shared with others, as the normals 
            // in each face will be different

            var sa=Math.sin(ang);
            var saa=Math.sin(ang+alphaAng);
            var ca=Math.cos(ang);
            var caa=Math.cos(ang+alphaAng);

            this.vertices.push(0,2,0);
            this.vertices.push( ca, 0, -sa);
            this.vertices.push(caa, 0, -saa);

            // triangle normal computed by cross product of two edges
            var normal= [
                saa-sa,
                ca*saa-sa*caa,
                caa-ca
            ];

            // normalization
            var nsize=Math.sqrt(
                normal[0]*normal[0]+
                normal[1]*normal[1]+
                normal[2]*normal[2]
                );
            normal[0]/=nsize;
            normal[1]/=nsize;
            normal[2]/=nsize;

            // push normal once for each vertex of this triangle
            this.normals.push(...normal);
            this.normals.push(...normal);
            this.normals.push(...normal);
            //unir série de triangulos
            this.indices.push(3*i + 2, 3*i + 1, 3 *i );

            ang+=alphaAng;

            
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();

    }

    //Ao pressionar "R", chama esta funçao, ativando o autopilot
    activateAutopilot() {
        this.autopilot = true;
        this.autopilotAngle = (this.yTurnAngle - 90.0) * this.convertAngle;

        //Cria o centro o circulo em que o veiculo vai estar a rodar 
        this.centerX =  this.positionXYZ[0] + Math.sin(this.autopilotAngle) * 5.0;
        this.centerZ = this.positionXYZ[2] + Math.cos(this.autopilotAngle) * 5.0;
    }


    update(elapsedTime) {
        if (this.autopilot) {
            //Atualiza os angulos necessarios e as posiçoes para que o veiculo circule a volta do centro e faça uma volta em 5 segundos, sozinho
            this.autopilotAngle += 2*Math.PI*elapsedTime/5000.0;
            let deltaAngle = 2.0*Math.PI*elapsedTime/5000.0;
            this.yTurnAngle -= deltaAngle * 180 / Math.PI;

            this.positionXYZ[0] -= this.centerX;
            this.positionXYZ[2] -= this.centerZ;
            let x = this.positionXYZ[0] * Math.cos(deltaAngle) - this.positionXYZ[2]*Math.sin(deltaAngle);
            let z = this.positionXYZ[0] * Math.sin(deltaAngle) + this.positionXYZ[2]*Math.cos(deltaAngle);
            this.positionXYZ[0] = x + this.centerX;
            this.positionXYZ[2] = z + this.centerZ;

            this.positionXYZ[1] += 0.1 * elapsedTime * this.speed * Math.sin(this.xInclinationAngle*this.convertAngle);
        }
        else {
            //Atualiza as posiçoes e os angulos de rotaçao do veiculo
            this.yTurnAngle += this.addedangle * elapsedTime/80;
            this.addedangle = 0;
            this.positionXYZ[0] += 0.1 * elapsedTime * this.speed * Math.sin(this.yTurnAngle*this.convertAngle);
            this.positionXYZ[1] += 0.1 * elapsedTime * this.speed * Math.sin(this.xInclinationAngle*this.convertAngle);
            this.positionXYZ[2] += 0.1 * elapsedTime * this.speed * Math.cos(this.yTurnAngle*this.convertAngle);
            
        //Verifica se o veiculo esta na altitude maxima ou minuma
        this.maxAltitude = (this.positionXYZ[1] >= 18.0);
        this.minAltitude = (this.positionXYZ[1] <= 6.0);

        //Se o veiculo tenta ultrupassar a altitude maxida este estabiliza
        if (this.positionXYZ[1] > 16.0 && !this.maxAltitude) {
            if (this.state === AircraftStates.GOING_UP || this.state === AircraftStates.STABILIZING_UP)
                this.stableUp(elapsedTime);
        }
        //Se o veiculo tenta ultrupassar a altitude minima este estabiliza  
        if (this.positionXYZ[1] < 8.0 && !this.minAltitude) {
            if (this.state === AircraftStates.GOING_DOWN || this.state === AircraftStates.STABILIZING_DOWN)
                this.stableDown(elapsedTime);
        }

        //Atualiza o angulo para a rotaçao da helice, dependendo da velocidade do veiculo
        this.helicesangle += 25 * this.speed;

        //Atualiza o airship, para atualizar o movimento da bandeira
        this.airship.update(elapsedTime, this.speed);
        }
    }

    //Estabiliza o veiculo se este ultrupassar a maxima altitude
    stableUp(elapsedTime) {
        this.xInclinationAngle -= elapsedTime*this.speed*0.5;
        this.state = AircraftStates.STABILIZING_UP;
        if (this.xInclinationAngle <= 0.0) {
            this.maxAltitude = true;
            this.state = AircraftStates.STABLE;
            this.xInclinationAngle = 0;
        }
    }

    //Estabiliza o veiculo se este ultrupassar a minima altitude
    stableDown(elapsedTime) {
        this.xInclinationAngle += elapsedTime*this.speed*0.5;
        this.state = AircraftStates.STABILIZING_DOWN;
        if (this.xInclinationAngle >= 0.0) {
            this.minAltitude = true;
            this.state = AircraftStates.STABLE;
            this.xInclinationAngle = 0;
        }
    } 

    //Movimenta o veiculo para cima e para baixo, com inclinaçao
    pitch(val) {
        if (this.state !== AircraftStates.STABILIZING_UP && this.state !== AircraftStates.STABILIZING_DOWN && this.speed > 0) {
            this.xInclinationAngle += val;
            if (this.xInclinationAngle > 25.0)
                this.xInclinationAngle = 25.0;
            if (this.xInclinationAngle < -25.0)
                this.xInclinationAngle = -25.0;

            if ((this.maxAltitude && this.xInclinationAngle > 0.0) || (this.minAltitude && this.xInclinationAngle < 0.0))
                this.xInclinationAngle = 0;

            if (this.xInclinationAngle === 0.0)
                this.state = AircraftStates.STABLE;
            if (this.xInclinationAngle < 0.0)
                this.state = AircraftStates.GOING_DOWN;
            else
                this.state = AircraftStates.GOING_UP;
        }
    }

    //Movimenta o veiculo para os lados, com inclinaçao
    turn(val){
        this.yTurnAngle += val;
    }

    //Aumenta ou reduz a velocidade do veiculo
    acelerate(val){
        this.speed += val;
        if(this.speed  < 0)
            this.speed = 0;
        if(this.speed > 0.3)
            this.speed = 0.3;
    }

    //Sobe e Desce o Veiculo, sem inclinar
    rise(val) {
        this.positionXYZ[1] += val;
        if (this.positionXYZ[1] < 6.0)
            this.positionXYZ[1] = 6.0;
        if (this.positionXYZ[1] > 18.0)
            this.positionXYZ[1] = 18.0;
    }

    //Dá reset ao veiculo, colocando-o na posicao inicial (0,10,0) sem inclinaçoes, assim como, a sua velocidade e o billboard
    reset(){
        this.positionXYZ[0] = 0;
        this.positionXYZ[1] = 10;
        this.positionXYZ[2] = 0;
        this.yTurnAngle = 0;
        this.speed = 0;
        this.xInclinationAngle = 0;
        this.autopilot = false;
        this.autopilotAngle = 0;
        this.maxAltitude = false;
        this.minAltitude = false;
        this.scene.billboard.resetBillboard();
        
    }

    updateBuffers(complexity){
        this.slices = 3 + Math.round(9 * complexity); //complexity varies 0-1, so slices varies 3-12

        // reinitialize buffers
        this.initBuffers();
        this.initNormalVizBuffers();
    }


    display(){

        this.scene.pushMatrix();
        
        this.scene.translate(this.positionXYZ[0],this.positionXYZ[1], this.positionXYZ[2] );
        this.scene.rotate(this.yTurnAngle*this.convertAngle,0,1,0);//rotação sobre si mesmo /direção para onde se movimenta
        this.scene.rotate(-this.xInclinationAngle*this.convertAngle,1,0,0);//rotação que inclina airship
        
        this.airship.display();
        this.scene.popMatrix();

    }


    
    setFillMode() {
        this.primitiveType=this.scene.gl.TRIANGLES;
    }

    setLineMode() {
        this.primitiveType=this.scene.gl.LINE_STRIP;
    }

}
