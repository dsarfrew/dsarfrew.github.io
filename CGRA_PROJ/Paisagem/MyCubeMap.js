/**
 * MyCubeMap
 * @constructor
 * @param scene - Reference to MyScene object
 *
 */
class MyCubeMap extends CGFobject {
    constructor(scene) {
        super(scene);
        this.initBuffers();
    }
    initBuffers() {
        this.vertices = [

            // Plano x = 0.5
            0.5, 0.5, 0.5,      // 8
            0.5, 0.5, -0.5,      // 9
            0.5, -0.5, -0.5,      // 10
            0.5, -0.5, 0.5,      // 11

            // Plano x = -0.5
            -0.5, 0.5, -0.5,      // 16
            -0.5, 0.5, 0.5,      // 17
            -0.5, -0.5, 0.5,      // 18
            -0.5, -0.5, -0.5,      // 19

            // Plano y = 0.5
            -0.5, 0.5, -0.5,      // 4
            0.5, 0.5, -0.5,      // 5
            0.5, 0.5, 0.5,      // 6
            -0.5, 0.5, 0.5,      // 7

            // Plano y = -0.5
            -0.5, -0.5, 0.5,      // 12
            0.5, -0.5, 0.5,      // 13
            0.5, -0.5, -0.5,      // 14
            -0.5, -0.5, -0.5,      // 15
                  
            // Plano z = 0.5
            -0.5, 0.5, 0.5,     // 0
            0.5, 0.5, 0.5,      // 1
            0.5, -0.5, 0.5,     // 2
            -0.5, -0.5, 0.5,    // 3

            // Plano z = -0.5
            0.5, 0.5, -0.5,      // 20
            -0.5, 0.5, -0.5,      // 21
            -0.5, -0.5, -0.5,      // 22
            0.5, -0.5, -0.5,      // 23
        ];

        //Counter-clockwise reference of vertices
        // Usar outros vertices e não só 0-7 para melhorar a iluminação
        this.indices = [
            // Plano x = 0.5
            1, 2, 0,
            0, 2, 3,
            // Plano x = -0.5
            4, 5, 6,
            4, 6, 7,
            // Plano y = 0.5
            8, 9, 10,
            8, 10, 11,
            // Plano y = -0.5
            12, 13, 14,
            12, 14, 15,
            // Plano z = 0.5
            16, 17, 18,
            16, 18, 19,
            // Plano z = -0.5
            20, 21, 22,
            20, 22, 23,
        ];

        this.normals = [
            // Face 1 - plano x = 0.5
            -1, 0, 0,
            -1, 0, 0,
            -1, 0, 0,
            -1, 0, 0,
            // Face 2 - plano x = -0.5
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,
            // Face 3 - plano y = 0.5
            0, -1, 0,
            0, -1, 0,
            0, -1, 0,
            0, -1, 0,
            // Face 4 - plano y = -0.5
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,
            // Face 5 - plano z = 0.5
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            // Face 6 - plano z = -0.5
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
        ];

        this.texCoords=[
            //Dividimos a imagem em 4 partes na horizontal (0.0,0.25,0.5,0.75,1.0) e 3 na Vertival(0.0, 0.33, 0.66, 1)
            // Face 1 - Back Face
            1.00, (0.333), 
            0.75, (0.333), 
            0.75, (0.666), 
            1.00, (0.666), 
            
            // Face 2 - Front Face
            0.50, (0.333),
            0.25, (0.333),
            0.25, (0.666),
            0.50, (0.666),

            // Face 3 - Top Face
            0.5, (0.333), 
            0.5, 0,  
            0.25, 0, 
            0.25, (0.333), 

            // Face 4 - Bottom Face
            0.25, 1,  
            0.5, 1,  
            0.5, (0.666), 
            0.25, (0.666), 

            // Face 5 - Left Face
            0.25, (0.333),
            0.00, (0.333),
            0.00, (0.666),
            0.25, (0.666),

            // Face 6 - Right Face
            0.75, (0.333),
            0.50, (0.333),
            0.50, (0.666),
            0.75, (0.666),
            

        ];


        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();
    }

    display() {
        this.scene.setGlobalAmbientLight(0.7, 0.7, 0.7, 1);
        this.scene.setDiffuse(0,0,0);
        this.scene.setSpecular(0, 0, 0, 0);
        this.scene.setAmbient(1, 1, 1, 0);

        this.scene.pushMatrix();
        
        //dimensoes 50x50
        this.scene.scale(50,50,50);
        super.display();
        
        this.scene.popMatrix();
    }

    setFillMode() {
        this.primitiveType=this.scene.gl.TRIANGLES;
    }

    setLineMode()
    {
        this.primitiveType=this.scene.gl.LINE_STRIP;
    };
}