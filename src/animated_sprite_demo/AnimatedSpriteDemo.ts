/*
 * AnimatedSpriteDemo.ts - demonstrates some simple sprite rendering and 
 * animation as well as some basic mouse interactions. Note that the
 * AnimationSpriteDemo class loads and creates custom content for the
 * purpose of demonstrating basic functionality.
 */
import {Game} from '../wolfie2d/Game'
import {ResourceManager} from '../wolfie2d/files/ResourceManager'
import {TextToRender} from '../wolfie2d/rendering/TextRenderer'
import {WebGLGameRenderingSystem} from '../wolfie2d/rendering/WebGLGameRenderingSystem'
import {SceneGraph} from '../wolfie2d/scene/SceneGraph'
import {AnimatedSprite} from '../wolfie2d/scene/sprite/AnimatedSprite'
import {AnimatedSpriteType} from '../wolfie2d/scene/sprite/AnimatedSpriteType'
import { CircleSprite } from '../wolfie2d/scene/sprite/CircleSprite'
import { SceneObject } from '../wolfie2d/scene/SceneObject'

// IN THIS EXAMPLE WE'LL HAVE 2 SPRITE TYPES THAT EACH HAVE THE SAME 2 STATES
// AND WHERE EACH SPRITE TYPE HAS ITS OWN SPRITE SHEET
const DEMO_SPRITE_TYPES : string[] = [
    'resources/animated_sprites/RedCircleMan.json',
    'resources/animated_sprites/MultiColorBlock.json'
];
const DEMO_SPRITE_STATES = {
    FORWARD_STATE: 'FORWARD',
    REVERSE_STATE: 'REVERSE'
};
const DEMO_TEXTURES : string[] = [
    'resources/images/EightBlocks.png', 
    'resources/images/RedCircleMan.png'
];

class AnimatedSpriteDemo {
    constructor() {}

    /**
     * This method initializes the application, building all the needed
     * game objects and setting them up for use.
     */
    public buildTestScene(game : Game, callback : Function) {
        let renderingSystem : WebGLGameRenderingSystem = game.getRenderingSystem();
        let sceneGraph : SceneGraph = game.getSceneGraph();
        let resourceManager : ResourceManager = game.getResourceManager();
        let builder = this;
 
        // EMPLOY THE RESOURCE MANAGER TO BUILD ALL THE WORLD CONTENT
        resourceManager.loadTextures(DEMO_TEXTURES, renderingSystem, function() {
            // ONLY AFTER ALL THE TEXTURES HAVE LOADED LOAD THE SPRITE TYPES
            resourceManager.loadSpriteTypes(DEMO_SPRITE_TYPES, function() {
                // ONLY AFTER ALL THE SPRITE TYPES HAVE LOADED LOAD THE SPRITES
                builder.buildAnimatedSprites(resourceManager, sceneGraph);

                // AND BUILD ALL THE TEXT OUR APP WILL USE
                builder.buildText(game);

                // EVERYTHING HAS BEEN BUILT, CALL THE CALLBACK
                callback();
            });
        });
    }

    /*
     * Builds all the animated sprites to be used by the application and
     * adds them to the scene.
     */
    private buildAnimatedSprites(resourceManager : ResourceManager, scene : SceneGraph) {
        let canvasWidth : number = (<HTMLCanvasElement>document.getElementById("game_canvas")).width;
        let canvasHeight : number = (<HTMLCanvasElement>document.getElementById("game_canvas")).height;

        // BUILD A BUNCH OF CIRCLE SPRITES
        for (let i = 0; i < DEMO_SPRITE_TYPES.length; i++) {
            for (let j = 0; j < 5; j++) {
                let spriteTypeToUse : string = DEMO_SPRITE_TYPES[i];
                let animatedSpriteType : AnimatedSpriteType = resourceManager.getAnimatedSpriteTypeById(spriteTypeToUse);
                let spriteToAdd : AnimatedSprite = new AnimatedSprite(animatedSpriteType, DEMO_SPRITE_STATES.FORWARD_STATE);
                let randomX : number = Math.floor(Math.random() * canvasWidth) - (animatedSpriteType.getSpriteWidth()/2);
                let randomY : number = Math.floor(Math.random() * canvasHeight) - (animatedSpriteType.getSpriteHeight()/2);
                spriteToAdd.getPosition().set(randomX, randomY, 0.0, 1.0);
                scene.addAnimatedSprite(spriteToAdd);
            }
        }
        for (let z = 0; z < 5; z++){
            let circle : CircleSprite = new CircleSprite();
            let randomX : number = Math.floor(Math.random() * canvasWidth) - (circle.getWidth()/2);
            let randomY : number = Math.floor(Math.random() * canvasHeight) - (circle.getHeight()/2);
            circle.getPosition().set(randomX, randomY, 0.0, 1.0);
            scene.addCircleSprite(circle);
        }
    }

    /*
     * Builds all the text to be displayed in the application.
     */
    private buildText(game : Game) {
        let sceneGraph : SceneGraph = game.getSceneGraph();
        let numSpritesText = new TextToRender("Num Sprites", "", 20, 50, function() {
            numSpritesText.text = "Number of Sprites: " + sceneGraph.getNumSprites();
        });
        let spriteInfo = new TextToRender("Sprite Info", "", 20, 70, function(){
            let sprite : SceneObject = game.getSceneGraph().getSpriteHover();
            if (sprite === null){
                spriteInfo.text = "";
            }else if(sprite instanceof AnimatedSprite){
                let info : string = "position: (" 
                +   sprite.getPosition().getX() + ", " + sprite.getPosition().getY() + ")   "
                +   "State: " + sprite.getState() + "   "
                +   "Animation Frame Index: " + sprite.getAnimationFrameIndex() + "   "
                +   "Frame Count: " + sprite.getFrameCounter();
                spriteInfo.text = info;
            }else{
                let circle : CircleSprite = <CircleSprite>sprite;
                let info : string = "position: ("
                                +   circle.getPosition().getX() + ", " + circle.getPosition().getY() + ")   "
                                +   "R: " + circle.getR() + "   G: " + circle.getG() + "   B:" + circle.getB();
                spriteInfo.text = info;
            }
        });
        let textRenderer = game.getRenderingSystem().getTextRenderer();
        textRenderer.addTextToRender(numSpritesText);
        textRenderer.addTextToRender(spriteInfo);
    }
}

// THIS IS THE ENTRY POINT INTO OUR APPLICATION, WE MAKE
// THE Game OBJECT AND INITIALIZE IT WITH THE CANVASES
let game = new Game();
game.init("game_canvas", "text_canvas");

// BUILD THE GAME SCENE
let demo = new AnimatedSpriteDemo();
demo.buildTestScene(game, function() {
    // AND START THE GAME LOOP
    game.start();
});