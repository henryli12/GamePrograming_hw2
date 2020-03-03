import {SceneObject} from '../SceneObject'
import { Vector3 } from '../../math/Vector3';
export class CircleSprite extends SceneObject {
    private color : Array<number>;
    private width : number;
    private height : number;
    public constructor(){
        super();
        this.width = 256;
        this.height = 256;
        this.color = [255.0,255.0,255.0,1.0];

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
    public getColor() : Array<number>{
        return this.color;
    }
    public getWidth() : number{
        return this.width;
    }
    public getHeight() : number{
        return this.height;
    }
}