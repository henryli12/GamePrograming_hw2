import {SceneObject} from '../SceneObject'
import { Vector3 } from '../../math/Vector3';
export class CircleSprite extends SceneObject {
    private color : Vector3;
    private width : number;
    private height : number;
    public constructor(color : Vector3, width : number, height : number){
        super();
        this.width = width;
        this.height = height;
        this.color = color;
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
    public getColor() : Vector3{
        return this.color;
    }
}