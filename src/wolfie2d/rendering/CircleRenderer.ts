import {WebGLGameShader} from './WebGLGameShader'
import {MathUtilities} from '../math/MathUtilities'
import { Matrix } from '../math/Matrix'
import { Vector3 } from '../math/Vector3'
import {AnimatedSprite} from '../scene/sprite/AnimatedSprite'
import {AnimatedSpriteType} from '../scene/sprite/AnimatedSpriteType'
import {WebGLGameTexture} from './WebGLGameTexture'
import {HashTable} from '../data/HashTable'
import { CircleSprite } from '../scene/sprite/CircleSprite'

var CircleDefaults = {
    A_POSITION: "a_Position",
    A_VALUE_TO_INTERPOLATE: "a_ValueToInterpolate",
    U_SPRITE_TRANSFORM: "u_SpriteTransform",
    U_R: "u_r",
    U_G: "u_g",
    U_B: "u_b",
    NUM_VERTICES: 4,
    FLOATS_PER_VERTEX: 2,
    FLOATS_PER_TEXTURE_COORDINATE: 2,
    OFFSET: 0,
    STRIDE: 0,
    INDEX_OF_FIRST_VERTEX: 0,
};

export class CircleRenderer {
    private shader : WebGLGameShader;
    private vertexTexCoordBuffer : WebGLBuffer;

    private spriteTransform : Matrix;
    private spriteTranslate : Vector3;
    private spriteRotate : Vector3;
    private spriteScale : Vector3;    

    private webGLAttributeLocations : HashTable<GLuint>;
    private webGLUniformLocations : HashTable<WebGLUniformLocation>;

    public constructor() {}

    public init(webGL : WebGLRenderingContext) : void {
        this.shader = new WebGLGameShader();
        var vertexShaderSource =
            'precision highp float;\n'+
            'attribute vec4 ' + CircleDefaults.A_POSITION + ';\n'+
            'attribute vec2 ' + CircleDefaults.A_VALUE_TO_INTERPOLATE + ';\n'+
            'varying vec2 val;\n'+
            'uniform mat4 ' + CircleDefaults.U_SPRITE_TRANSFORM +';\n'+
            'void main() {\n'+
            '    val = ' + CircleDefaults.A_VALUE_TO_INTERPOLATE +' * 2.0 ;\n'+
            '  gl_Position = ' + CircleDefaults.U_SPRITE_TRANSFORM + ' * ' + CircleDefaults.A_POSITION + ';\n' +
            '}\n'
        
        var fragmentShaderSource =
            'precision highp float;\n'+
            'varying vec2 val;\n'+
            'uniform float ' + CircleDefaults.U_R + ';\n'+
            'uniform float ' + CircleDefaults.U_G + ';\n'+
            'uniform float ' + CircleDefaults.U_B + ';\n'+
            'void main() {\n'+
            '    float R = 1.0;\n'+
            '    float dist = sqrt(dot(val,val));\n'+
            '    float alpha = 1.0;\n'+
            '    if (dist > R) {\n'+
            '        discard;\n'+
            '    }\n'+
            '    if (u_r == 0.0){\n'+
            '        gl_FragColor = vec4(dist, ' + CircleDefaults.U_G + '* 100.0 + dist, ' + CircleDefaults.U_B + '*100.0 + dist, alpha);\n'+
            '    }\n'+
            '    if(u_g == 0.0){\n'+
            '        gl_FragColor = vec4( ' + CircleDefaults.U_R + ' *100.0+ dist, dist, ' + CircleDefaults.U_B +'*100.0 + dist, alpha);\n'+
            '    }\n'+
            '    if(u_b == 0.0){\n'+
            '        gl_FragColor = vec4('+CircleDefaults.U_R +'*100.0 + dist, ' + CircleDefaults.U_G + '*100.0 + dist, dist, alpha);\n'+
            '    }\n'+
            '}\n'
        
        this.shader.init(webGL, vertexShaderSource, fragmentShaderSource);
        // GET THE webGL OBJECT TO USE
        var verticesTexCoords = new Float32Array([
            -0.5,  0.5,
            -0.5, -0.5,
             0.5,  0.5,
             0.5, -0.5,
        ]);
        // CREATE THE BUFFER ON THE GPU
        this.vertexTexCoordBuffer = webGL.createBuffer();

        // BIND THE BUFFER TO BE VERTEX DATA
        webGL.bindBuffer(webGL.ARRAY_BUFFER, this.vertexTexCoordBuffer);

        // AND SEND THE DATA TO THE BUFFER WE CREATED ON THE GPU
        webGL.bufferData(webGL.ARRAY_BUFFER, verticesTexCoords, webGL.STATIC_DRAW);

        // SETUP THE SHADER ATTRIBUTES AND UNIFORMS
        this.webGLAttributeLocations = {};
        this.webGLUniformLocations = {};
        this.loadAttributeLocations(webGL, [CircleDefaults.A_POSITION, CircleDefaults.A_VALUE_TO_INTERPOLATE]);
        this.loadUniformLocations(webGL, [CircleDefaults.U_B, CircleDefaults.U_G, CircleDefaults.U_R, CircleDefaults.U_SPRITE_TRANSFORM]);

        // WE'LL USE THESE FOR TRANSOFMRING OBJECTS WHEN WE DRAW THEM
        this.spriteTransform = new Matrix(4, 4);
        this.spriteTranslate = new Vector3();
        this.spriteRotate = new Vector3();
        this.spriteScale = new Vector3();
    }
    private loadAttributeLocations(webGL : WebGLRenderingContext, attributeLocationNames : Array<string>) {
        for (var i = 0; i < attributeLocationNames.length; i++) {
            let locationName : string = attributeLocationNames[i];
            let location : GLuint = webGL.getAttribLocation(this.shader.getProgram(), locationName);
            this.webGLAttributeLocations[locationName] = location;
        }
    }

    private loadUniformLocations(webGL : WebGLRenderingContext, uniformLocationNames : Array<string>) {
        for (let i : number = 0; i < uniformLocationNames.length; i++) {
            let locationName : string = uniformLocationNames[i];
            let location : WebGLUniformLocation = webGL.getUniformLocation(this.shader.getProgram(), locationName);
            this.webGLUniformLocations[locationName] = location;
        }
    }
    public renderCicle(webGL : WebGLRenderingContext, canvasWidth : number,
                    canvasHeight : number, circle : CircleSprite){
        let circleWidth : number = circle.getWidth();
        let circleHeight : number = circle.getHeight();
        let circleXInPixels : number = circle.getPosition().getX() + (circleWidth/2);
        let circleYInPixels : number = circle.getPosition().getY() + (circleHeight/2);
        let circleXTranslate : number = (circleXInPixels - (canvasWidth/2))/(canvasWidth/2);
        let circleYTranslate : number = (circleYInPixels - (canvasHeight/2))/(canvasHeight/2);
        this.spriteTranslate.setX(circleXTranslate);
        this.spriteTranslate.setY(-circleYTranslate);

        let defaultWidth : number = canvasWidth/2;
        let defaultHeight : number = canvasHeight/2;
        let scaleX : number = circleWidth/defaultWidth;
        let scaleY : number = circleHeight/defaultHeight;
        this.spriteScale.setX(scaleX);
        this.spriteScale.setY(scaleY);

        MathUtilities.identity(this.spriteTransform);
        MathUtilities.model(this.spriteTransform, this.spriteTranslate, this.spriteRotate, this.spriteScale);
        
        webGL.bindBuffer(webGL.ARRAY_BUFFER, this.vertexTexCoordBuffer);

        let a_PositionLocation : GLuint = this.webGLAttributeLocations[CircleDefaults.A_POSITION];
        webGL.vertexAttribPointer(a_PositionLocation, CircleDefaults.FLOATS_PER_VERTEX, webGL.FLOAT, false, CircleDefaults.STRIDE, CircleDefaults.OFFSET);
        webGL.enableVertexAttribArray(a_PositionLocation);
        let a_ValueToInterpolate : GLuint = this.webGLAttributeLocations[CircleDefaults.A_VALUE_TO_INTERPOLATE];
        webGL.vertexAttribPointer(a_ValueToInterpolate, CircleDefaults.FLOATS_PER_VERTEX, webGL.FLOAT, false, CircleDefaults.STRIDE, CircleDefaults.OFFSET);
        webGL.enableVertexAttribArray(a_ValueToInterpolate);

        let u_SpriteTransform : WebGLUniformLocation = this.webGLUniformLocations[CircleDefaults.U_SPRITE_TRANSFORM];
        webGL.uniformMatrix4fv(u_SpriteTransform, false, this.spriteTransform.getData());
        let u_r : WebGLUniformLocation = this.webGLUniformLocations[CircleDefaults.U_R];
        webGL.uniform1f(u_r, circle.getR());
        let u_g : WebGLUniformLocation = this.webGLUniformLocations[CircleDefaults.U_G];
        webGL.uniform1f(u_g, circle.getG());
        let u_b : WebGLUniformLocation = this.webGLUniformLocations[CircleDefaults.U_B];
        webGL.uniform1f(u_b, circle.getB());


        // DRAW THE SPRITE AS A TRIANGLE STRIP USING 4 VERTICES, STARTING AT THE START OF THE ARRAY (index 0)
        webGL.drawArrays(webGL.TRIANGLE_STRIP, CircleDefaults.INDEX_OF_FIRST_VERTEX, CircleDefaults.NUM_VERTICES);
    }

    public renderCircleSprites(webGL : WebGLRenderingContext, 
        canvasWidth : number, 
        canvasHeight : number, 
        visibleSet : Array<CircleSprite>) : void{
            let shaderProgramToUse = this.shader.getProgram();
            webGL.useProgram(shaderProgramToUse);
            for(let circle of visibleSet){
                this.renderCicle(webGL, canvasWidth, canvasHeight, circle);
            }
        }
}