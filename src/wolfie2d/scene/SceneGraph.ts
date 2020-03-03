import {SceneObject} from './SceneObject'
import {AnimatedSprite} from './sprite/AnimatedSprite'
import { CircleSprite } from './sprite/CircleSprite';

export class SceneGraph {
    // AND ALL OF THE ANIMATED SPRITES, WHICH ARE NOT STORED
    // SORTED OR IN ANY PARTICULAR ORDER. NOTE THAT ANIMATED SPRITES
    // ARE SCENE OBJECTS
    private animatedSprites : Array<AnimatedSprite>;
    private circleSprites : Array<CircleSprite>;

    // SET OF VISIBLE OBJECTS, NOTE THAT AT THE MOMENT OUR
    // SCENE GRAPH IS QUITE SIMPLE, SO THIS IS THE SAME AS
    // OUR LIST OF ANIMATED SPRITES
    private visibleSet : Array<SceneObject>;
    private spriteHover : SceneObject;

    public constructor() {
        // DEFAULT CONSTRUCTOR INITIALIZES OUR DATA STRUCTURES
        this.animatedSprites = new Array();
        this.circleSprites = new Array();
        this.visibleSet = new Array();
        this.spriteHover = null;
    }

    public getNumSprites() : number {
        return this.animatedSprites.length + this.circleSprites.length;
    }

    public addAnimatedSprite(sprite : AnimatedSprite) : void {
        this.animatedSprites.push(sprite);
    }

    public addCircleSprite(circle : CircleSprite) : void{
        this.circleSprites.push(circle);
    }
    public getSpriteAt(testX : number, testY : number) : AnimatedSprite {
        for (let sprite of this.animatedSprites) {
            if (sprite.contains(testX, testY))
                return sprite;
        }
        return null;
    }
    public getCircleAt(testX : number, testY : number) : CircleSprite {
        for (let circle of this.circleSprites){
            if(circle.contains(testX,testY))
                return circle;
        }
    }

    /**
     * update
     * 
     * Called once per frame, this function updates the state of all the objects
     * in the scene.
     * 
     * @param delta The time that has passed since the last time this update
     * funcation was called.
     */
    public update(delta : number) : void {
        for (let sprite of this.animatedSprites) {
            sprite.update(delta);
        }
    }

    public scope() : Array<SceneObject> {
        // CLEAR OUT THE OLD
        this.visibleSet = [];

        // PUT ALL THE SCENE OBJECTS INTO THE VISIBLE SET
        for (let sprite of this.animatedSprites) {
            this.visibleSet.push(sprite);
        }

        return this.visibleSet;
    }

    public circleScope() : Array<SceneObject> {
        this.visibleSet = [];
        for (let circle of this.circleSprites){
            this.visibleSet.push(circle);
        }
        return this.visibleSet;
    }
    public remove(sprite : AnimatedSprite) : void{
        let index : number = this.animatedSprites.indexOf(sprite);
        this.animatedSprites.splice(index, 1);
    }
    public removeCircle(circle : CircleSprite) : void{
        let index : number = this.circleSprites.indexOf(circle);
        this.circleSprites.splice(index, 1);
    }
    public setSpriteHover(spriteHover : SceneObject) : void{
        this.spriteHover = spriteHover;
    }
    public getSpriteHover() : SceneObject{
        return this.spriteHover;
    }
}