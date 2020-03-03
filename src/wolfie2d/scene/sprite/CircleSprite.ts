import {SceneObject} from '../SceneObject'
import { Vector3 } from '../../math/Vector3';
import { textChangeRangeIsUnchanged } from 'typescript';
export class CircleSprite extends SceneObject {
    private colors : Array<Array<number>>;
    private width : number;
    private height : number;
    private r_value : number;
    private g_value : number;
    private b_value : number;
    public constructor(){
        super();
        this.colors = [[255.0,0.0,0.0],
                    [0.0, 255.0, 0.0],
                    [0.0, 0.0, 255.0],
                    [255.0,255.0,0.0],
                    [0.0, 255.0, 255.0],
                    [255.0, 0.0, 255.0]];
        let index = Math.floor(Math.random()*6);
        this.width = 256;
        this.height = 256;
        this.r_value = this.colors[index][0];
        this.g_value = this.colors[index][1];
        this.b_value = this.colors[index][2];
    }
    public contains(pointX : number, pointY : number) : boolean {
        let spriteWidth = this.width;
        let spriteHeight = this.height;
        let spriteLeft = this.getPosition().getX();
        let spriteRight = this.getPosition().getX() + spriteWidth;
        let spriteTop = this.getPosition().getY();
        let spriteBottom = this.getPosition().getY() + spriteHeight;
        if (    (pointX < spriteLeft)
            ||  (spriteRight < pointX)
            ||  (pointY < spriteTop)
            ||  (spriteBottom < pointY)) {
                return false;
        }
        else {
            return true;
        }
    }
    public getColors() : Array<Array<number>>{
        return this.colors;
    }
    public getWidth() : number{
        return this.width;
    }
    public getHeight() : number{
        return this.height;
    }
    public getR() : number{
        return this.r_value;
    }
    public getG() : number{
        return this.g_value;
    }
    public getB() : number{
        return this.b_value;
    }
}