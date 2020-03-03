/*
 * This provides responses to UI input.
 */
import {AnimatedSprite} from "../scene/sprite/AnimatedSprite"
import {SceneGraph} from "../scene/SceneGraph"
import { CircleSprite } from "../scene/sprite/CircleSprite";

export class UIController {
    private spriteToDrag : AnimatedSprite;
    private circleToDrag : CircleSprite;
    private scene : SceneGraph;
    private dragOffsetX : number;
    private dragOffsetY : number;

    public constructor() {}

    public init(canvasId : string, initScene : SceneGraph) : void {
        this.spriteToDrag = null;
        this.scene = initScene;
        this.dragOffsetX = -1;
        this.dragOffsetY = -1;

        let canvas : HTMLCanvasElement = <HTMLCanvasElement>document.getElementById(canvasId);
        canvas.addEventListener("mousedown", this.mouseDownHandler);
        canvas.addEventListener("mousemove", this.mouseMoveHandler);
        canvas.addEventListener("mouseup", this.mouseUpHandler);
        canvas.addEventListener("dblclick", this.mouseDoubleClickHandler);
        canvas.addEventListener("mousemove", this.hoverInfo);
    }

    public mouseDownHandler = (event : MouseEvent) : void => {
        let mousePressX : number = event.clientX;
        let mousePressY : number = event.clientY;
        let sprite : AnimatedSprite = this.scene.getSpriteAt(mousePressX, mousePressY);
        let circle : CircleSprite = this.scene.getCircleAt(mousePressX, mousePressY);
        console.log("mousePressX: " + mousePressX);
        console.log("mousePressY: " + mousePressY);
        console.log("sprite: " + sprite);
        if (sprite != null) {
            // START DRAGGING IT
            this.spriteToDrag = sprite;
            this.dragOffsetX = sprite.getPosition().getX() - mousePressX;
            this.dragOffsetY = sprite.getPosition().getY() - mousePressY;
        }else if(circle != null){
            this.circleToDrag = circle;
            this.dragOffsetX = circle.getPosition().getX() - mousePressX;
            this.dragOffsetY = circle.getPosition().getY() - mousePressY;
        }else{
            let i : number = Math.floor(Math.random()*3);
            if (i === 2){
                let circle : CircleSprite = new CircleSprite();
                circle.getPosition().set(event.clientX, event.clientY, 0.0, 1.0);
                this.scene.addCircleSprite(circle);
            }else{
                // let spriteTypeToUse : string = DEMO_SPRITE_TYPES[i];
                // let animatedSpriteType : AnimatedSpriteType = resourceManager.getAnimatedSpriteTypeById(spriteTypeToUse);
                // let spriteToAdd : AnimatedSprite = new AnimatedSprite(animatedSpriteType, DEMO_SPRITE_STATES.FORWARD_STATE);
            }
        }
    }
    
    public mouseMoveHandler = (event : MouseEvent) : void => {
        if (this.spriteToDrag != null) {
            this.spriteToDrag.getPosition().set(event.clientX + this.dragOffsetX, 
                                                event.clientY + this.dragOffsetY, 
                                                this.spriteToDrag.getPosition().getZ(), 
                                                this.spriteToDrag.getPosition().getW());
        }else if(this.circleToDrag != null){
            this.circleToDrag.getPosition().set(event.clientX + this.dragOffsetX, 
                                                event.clientY + this.dragOffsetY, 
                                                this.circleToDrag.getPosition().getZ(), 
                                                this.circleToDrag.getPosition().getW());
        }
    }

    public mouseUpHandler = (event : MouseEvent) : void => {
        this.spriteToDrag = null;
        this.circleToDrag = null;
    }

    public mouseDoubleClickHandler = (event : MouseEvent) : void => {
        let mousePressX : number = event.clientX;
        let mousePressY : number = event.clientY;
        let sprite : AnimatedSprite = this.scene.getSpriteAt(mousePressX, mousePressY);
        let circle : CircleSprite = this.scene.getCircleAt(mousePressX, mousePressY);
        if(sprite != null){
            this.scene.remove(sprite);
        }else if(circle != null){
            this.scene.removeCircle(circle);
        }
    }

    public hoverInfo = (event : MouseEvent) : void => {
        let mousePressX : number = event.clientX;
        let mousePressY : number = event.clientY;
        let sprite : AnimatedSprite = this.scene.getSpriteAt(mousePressX, mousePressY);
        let circle : CircleSprite = this.scene.getCircleAt(mousePressX, mousePressY);
        if(sprite != null){
            // let info : string = "position: (" 
            //                 +   sprite.getPosition().getX() + ", " + sprite.getPosition().getY() + ")   "
            //                 +   "State: " + sprite.getState() + "   "
            //                 +   "Animation Frame Index: " + sprite.getAnimationFrameIndex() + "   "
            //                 +   "Frame Count: " + sprite.getFrameCounter();
            // this.scene.setSpirteInfo(info);
            this.scene.setSpriteHover(sprite);
        }else if(circle != null){
            // let color : string = circle.getColor().toString();
            // let colorrbg : Array<string> = color.split(",");
            // colorrbg.splice(-1, 1);
            // color = colorrbg.join(",");
            // let info : string = "position: ("
            //                 +   circle.getPosition().getX() + ", " + circle.getPosition().getY() + ")   "
            //                 +   "Color: " + color;
            // this.scene.setSpirteInfo(info);
            this.scene.setSpriteHover(circle);
        }else{
            this.scene.setSpriteHover(null);
        }
    }
}