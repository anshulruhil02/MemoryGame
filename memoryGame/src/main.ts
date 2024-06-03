import { Cat, Circle, Polygon, Square, StartText, GameText, MemorizeText, WinText, HotBox } from "./drawable";
import { CatColor, EyeAlignment, getRandomCatColor } from "./enum";
import {
  SKEvent,
  SKKeyboardEvent,
  SKMouseEvent,
  setSKDrawCallback,
  setSKEventListener,
  startSimpleKit,
} from "simplekit/canvas-mode";

// define a type for the shapes array
type Shape = Cat | Circle | Polygon;
type Text = StartText | GameText | MemorizeText;

let shapes: Shape[] = [];
let boxes: Square[] = [];
let texts: Text[] = [];
let currentPattern: Shape[] = [];
let hotBoxes: HotBox[] = [];
let catClicked = false;
let catchX: number;
let catchY: number;
// mouse position
let mx = 0;
let my = 0;


const intialshapes = [
  new Cat(200, 600, 40, CatColor.Brown, EyeAlignment.Centre),
  new Cat(300, 600, 40, CatColor.Orange, EyeAlignment.Left),
  new Cat(400, 600, 40, CatColor.Blue, EyeAlignment.Right)
];
shapes.push(...intialshapes);

const intialHotBoxes = [
  new HotBox(200, 600, 100),
  new HotBox(300, 600, 100),
  new HotBox(400, 600, 100)
];
hotBoxes.push(...intialHotBoxes);

const intialBoxes = [
  new Square(400, 300, 100, "red"),
  new Square(510, 300, 100, "red"),
  new Square(620, 300, 100, "red"),
  new Square(730, 300, 100, "red"),
  new Square(840, 300, 100, "red"),
];
boxes.push(...intialBoxes);


let positions = [400, 510, 620, 730, 840, 950, 1060, 1170, 1280];
// create an array to hold all the shapes
// let shapes: Shape[] = [];
let shapeCount = 3;
let boxCount = 5;
let textCount = 1;
let levelCount = 0;

const pattern = new Map<string, [number, number]>();

// map.set("cat1", [100, 100]);
// map.set("cat2", [200, 100]);
// map.set("cat3", [300, 100]);
// map.set("circle1", [100, 200]);
// map.set("circle2", [200, 200]);
// map.set("circle3", [300, 200]);
// map.set("polygon1", [100, 300]);
// map.set("polygon2", [200, 300]);
// map.set("polygon3", [300, 300]);
const startText = new StartText(shapeCount, boxCount);
texts.push(startText);

function handleEvent(e: SKEvent) {
  switch (e.type) {
    case "keydown":
      console.log(`Key pressed: ${e.key}`); 
      if ((e as SKKeyboardEvent).key === "ArrowRight") {
        if(shapeCount < 9){
          shapeCount++;
        }
        if(shapeCount == 2){
          const cat2 = new Cat(300, 600, 40, CatColor.Orange, EyeAlignment.Left);
          const hotBox = new HotBox(300, 600, 100);
          hotBoxes.push(hotBox);
          shapes.push(cat2);
        }
        if(shapeCount == 3){
          const cat1 = new Cat(400, 600, 40, CatColor.Blue, EyeAlignment.Right);
          const hotBox = new HotBox(400, 600, 100);
          hotBoxes.push(hotBox);
          shapes.push(cat1);
        }
        if(shapeCount == 4){
          const circle1 = new Circle(500, 600, 40, ["orange", "blue", "orange"]);
          const hotBox = new HotBox(500, 600, 100);
          hotBoxes.push(hotBox);
          shapes.push(circle1);
        }
        if(shapeCount == 5 ){
          const circle2 = new Circle(600, 600, 40, ["black", "black", "black"]);
          const hotBox = new HotBox(600, 600, 100);
          hotBoxes.push(hotBox);
          shapes.push(circle2);
        }
        if(shapeCount == 6){
          const circle3 = new Circle(700, 600, 40, ["yellow", "blue", "yellow", "blue", "yellow", "blue"]);
          const hotBox = new HotBox(700, 600, 100);
          hotBoxes.push(hotBox);
          shapes.push(circle3);
        }
        if(shapeCount == 7){
          const polygon1 = new Polygon(800, 600, 40, 6, 'brown');
          const hotBox = new HotBox(800, 600, 100);
          hotBoxes.push(hotBox);
          shapes.push(polygon1);
        }
        if(shapeCount == 8){
          const polygon2 = new Polygon(900, 600, 40, 7, 'orange');
          const hotBox = new HotBox(900, 600, 100);
          hotBoxes.push(hotBox);
          shapes.push(polygon2);
        }
        if(shapeCount == 9){
          const polygon3 = new Polygon(1000, 600, 40, 8, 'blue');
          const hotBox = new HotBox(1400, 600, 100);
          hotBoxes.push(hotBox);
          shapes.push(polygon3);
        }
      } 
      else if ((e as SKKeyboardEvent).key === "ArrowLeft") {
        if(shapeCount > 1 ) {
          shapeCount--;
        }
        if(shapes.length > 1){
          shapes.pop();
          hotBoxes.pop();
        }  
      }
      else if((e as SKKeyboardEvent).key === "ArrowUp"){
        if(boxCount < 9){
          boxCount++;
        const lastBox = boxes[boxes.length - 1];
        const newBox = new Square(
          lastBox.centerX + 110,
          lastBox.centerY,
          100,
          "red"
        );
        boxes.push(newBox);
      }
      }
      else if((e as SKKeyboardEvent).key === "ArrowDown"){
        if(boxCount > 1){
          boxCount--;
        }
        if(boxes.length > 1){
          boxes.pop();
         }  
      }
      else if ((e as SKKeyboardEvent).key === " ") {
        levelCount++;
        function getRandomYCoordinate(currentSquares: number): number {
          const possibleValues = [400, 510, 620, 730, 840, 950, 1060, 1170, 1280];
          const startIndex = Math.min(currentSquares - 1, possibleValues.length - 1);
          const endIndex = Math.min(startIndex + 1, possibleValues.length - 1);
          const randomIndex = Math.floor(Math.random() * (endIndex - startIndex + 1)) + startIndex;
          return possibleValues[randomIndex];
        }
        
        // Usage example
        if (levelCount === 1) {
          pattern.set("square", [100, getRandomYCoordinate(1)]);
        }
        else if(levelCount == 2){

        }
        else if(levelCount == 3){
          
        }
        else if(levelCount == 4){
          
        }
        else if(levelCount == 5){
          
        }
        else if(levelCount == 6){

        }
        else if(levelCount == 7){
          
        }
        else if(levelCount == 8){
          
        }
        else if(levelCount == 9){
          
        }

        if(textCount < 3){
          textCount++;
          if(textCount == 2){
            texts.pop();
            const gameText = new GameText();
            texts.push(gameText);
          }
          else if(textCount == 3){
            texts.pop();  
            const memorizeText = new MemorizeText(); 
            texts.push(memorizeText);
            textCount = 1;
          } 
        }  
      }
      
      console.log(shapes);
      console.log(boxes);
      console.log(shapeCount);
      console.log(boxCount);
      break;

    case "drag":
    ({ x: mx, y: my } = e as SKMouseEvent);
    shapes.forEach((s) => {
      if (s instanceof Cat) {
        if (s.hitTest(mx, my)) {
          s.faceCenterX = mx;
          s.faceCenterY = my;
          const boxInHitTest = boxes.find((box) => box.hitTest(mx, my));
          if (boxInHitTest) {
            s.faceCenterX = boxInHitTest.centerX;
            s.faceCenterY = boxInHitTest.centerY;
          }
        }
      }
      else if(s instanceof Circle){
        if(s.hitTest(mx, my)){
          s.centerX = mx;
          s.centerY = my;
          const boxInHitTest = boxes.find((box) => box.hitTest(mx, my));
          if (boxInHitTest) {
            s.centerX = boxInHitTest.centerX;
            s.centerY = boxInHitTest.centerY;
          }
        }
      }
      else if(s instanceof Polygon){
        if(s.hitTest(mx, my)){
          s.centerX = mx;
          s.centerY = my;
        }
        const boxInHitTest = boxes.find((box) => box.hitTest(mx, my));
          if (boxInHitTest) {
            s.centerX = boxInHitTest.centerX;
            s.centerY = boxInHitTest.centerY;
        }
      } 
    });
    break;


  }
}


//Set the event listener
setSKEventListener(handleEvent);

setSKDrawCallback((gc: CanvasRenderingContext2D) => {
  
  gc.clearRect(0, 0, gc.canvas.width, gc.canvas.height);
  boxes.forEach((box) => {box.draw(gc); });
  hotBoxes.forEach((hotBox) => {hotBox.draw(gc); });
  texts.forEach((text) => {text.draw(gc); });
  shapes.forEach((cat) => {cat.draw(gc); });
  
  
});


// Start SimpleKit
startSimpleKit();
