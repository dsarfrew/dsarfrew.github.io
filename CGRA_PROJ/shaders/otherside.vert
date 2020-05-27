#ifdef GL_ES
precision highp float;
#endif

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec2 vTextureCoord;
uniform sampler2D uSampler1;



uniform float timeShader;
uniform float VehicleSpeed;

void main() {
    vTextureCoord = aTextureCoord;

    vec3 offset  = vec3(0.0,0.0,0.0);


    if (VehicleSpeed == 0.0)
        offset.z = 0.5 * sin(-aVertexPosition.x + (timeShader * 0.001)) * (aVertexPosition.x - 0.7);
    else
        offset.z = 0.5 * sin(aVertexPosition.x + (VehicleSpeed*50.0) * (timeShader * 0.001)) * (aVertexPosition.x - 0.7);

    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition + offset, 1.0);

}