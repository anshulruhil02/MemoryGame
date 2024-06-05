import {
  Cat,
  Circle,
  Polygon,
  Square,
  StartText,
  GameText,
  MemorizeText,
  WinText,
  HotBox,
} from "./drawable";
import { CatColor, EyeAlignment } from "./enum";
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
type Text = StartText | GameText | MemorizeText | WinText;

enum State {
  GameSetupState,
  GamePlayState,
  MemorizeState,
  WinState,
  LoseState,
}

let shapes: Shape[] = [];
let boxes: Square[] = [];
let texts: Text[] = [];
let hotBoxes: HotBox[] = [];
let availableBoxIndices: number[] = [];
// mouse position
let mx = 0;
let my = 0;
let newShape: Shape;

const cat1 = new Cat(200, 600, 40, CatColor.Brown, EyeAlignment.Centre);
const cat2 = new Cat(300, 600, 40, CatColor.Orange, EyeAlignment.Left);
const cat3 = new Cat(400, 600, 40, CatColor.Blue, EyeAlignment.Right);
const circle1 = new Circle(500, 600, 40, ["orange", "blue", "orange"]);
const circle2 = new Circle(600, 600, 40, ["black", "black", "black"]);
const circle3 = new Circle(700, 600, 40, [
  "yellow",
  "blue",
  "yellow",
  "blue",
  "yellow",
  "blue",
]);
const polygon1 = new Polygon(800, 600, 40, 6, "brown");
const polygon2 = new Polygon(900, 600, 40, 7, "orange");
const polygon3 = new Polygon(1000, 600, 40, 8, "blue");

const intialshapes = [cat1, cat2, cat3];
shapes.push(...intialshapes);

const intialHotBoxes = [
  new HotBox(200, 600, 100),
  new HotBox(300, 600, 100),
  new HotBox(400, 600, 100),
];
hotBoxes.push(...intialHotBoxes);

const intialBoxes = [
  new Square(100, 300, 100, "red"),
  new Square(210, 300, 100, "red"),
  new Square(320, 300, 100, "red"),
  new Square(430, 300, 100, "red"),
  new Square(540, 300, 100, "red"),
];
boxes.push(...intialBoxes);

let shapeCount = 3;
let boxCount = 5;
let gameCount = 1;

// map of type iD and x-coordinate
let desiredPattern: Shape[] = [];
let temp: Shape[] = [];
let userPattern: Shape[] = [];
let randomPattern: Shape[] = []; // This will store the actual symbols as per the game's logic

const startText = new StartText(3, 5);
const memorizeText = new MemorizeText();
const winText = new WinText();
const gameText = new GameText();

texts.push(startText);
let currentState: State = State.GameSetupState;

function handleEvent(e: SKEvent) {
  switch (e.type) {
    case "keydown":
      handleKeyboardEvent(e as SKKeyboardEvent);
      break;
    case "mousedown":
      handleMouseDownEvent(e as SKMouseEvent);
      break;
    case "mousemove":
      handleMouseMoveEvent(e as SKMouseEvent);
      break;
  }
}

let levelCount: number = 1;
function handleKeyboardEvent(e: SKKeyboardEvent) {
  if (currentState === State.GameSetupState) {
    userPattern = [];
    desiredPattern = [];
    // console.log("desiredPattern", desiredPattern);
    // console.log("userPattern", userPattern);
    // console.log("shapes", shapes);
    // console.log("boxes", boxes);
    // console.log("hotBoxes", hotBoxes);
    // if the user presses the left/right arrow keys
    // if the user presses the left/right arrow keys
    switch (e.key) {
      case "ArrowLeft":
        if (shapes.length > 1) {
          decreaseShapeCount();
        }
        break;
      case "ArrowRight":
        if (shapes.length < 9) {
          increaseShapeCount();
        }
        break;
      case "ArrowUp":
        increaseBoxCount();
        break;
      case "ArrowDown":
        decreaseBoxCount();
        break;

      case " ":
        currentState = State.MemorizeState;
        texts.pop();
        texts.push(memorizeText);
        initializeAvailableBoxes();
        generateHiddenCode();
        break;
      default:
        break;
    }
  } else if (currentState === State.MemorizeState) {
    //console.log("Desired", desiredPattern);
    switch (e.key) {
      case " ":
        console.log("Desired pattern for level" + levelCount + " is: " + desiredPattern);
        currentState = State.GamePlayState;
        texts.pop();
        texts.push(gameText);
        
        break;
      default:
        break;
    }
  } else if (currentState === State.GamePlayState) {
    const patternsMatch = checkPatternsMatch(userPattern, desiredPattern);

    switch (e.key) {
      case " ":
        // console.log(`LevelCount: ${levelCount}`);
        // console.log(`NUMBER OF BOXES: ${boxCount} ${boxes.length}`);
        if (patternsMatch) {
          levelCount++;
          currentState = State.MemorizeState;
          texts.pop();
          texts.push(memorizeText);
          generateHiddenCode();
        } else {
          currentState = State.GamePlayState;
        }

        if (levelCount == boxes.length + 1) {
          currentState = State.WinState;
          texts.pop();
          texts.push(winText);
          levelCount = 1;
        }

        break;

      default:
        break;
    }
  } else if (currentState === State.WinState) {
    let startText = new StartText(shapeCount, boxCount);
    switch (e.key) {
      case " ":
        currentState = State.GameSetupState;
        texts.pop();
        texts.push(startText);
        levelCount = 1;
        gameCount++;
        break;
      default:
        break;
    }
  }
}

function checkPatternsMatch(pattern1: Shape[], pattern2: Shape[]): boolean {
  if (pattern1.length !== pattern2.length) {
    return false;
  }

  for (let i = 0; i < pattern1.length; i++) {
    const shape1 = pattern1[i];
    const shape2 = pattern2[i];

    if (!shapesMatch(shape1, shape2)) {
      return false;
    }
  }

  return true;
}

function shapesMatch(shape1: Shape, shape2: Shape): boolean {
  if (shape1 instanceof Cat && shape2 instanceof Cat) {
    return (
      shape1.centerX === shape2.centerX &&
      shape1.centerY === shape2.centerY &&
      shape1.color === shape2.color &&
      shape1.eyeAlignment === shape2.eyeAlignment &&
      shape1.faceRadius === shape2.faceRadius
    );
  } else if (shape1 instanceof Polygon && shape2 instanceof Polygon) {
    return (
      shape1.centerX === shape2.centerX &&
      shape1.centerY === shape2.centerY &&
      shape1.sides === shape2.sides &&
      shape1.color === shape2.color
    );
  } else if (shape1 instanceof Circle && shape2 instanceof Circle) {
    return (
      shape1.constructor === shape2.constructor &&
      shape1.centerX === shape2.centerX &&
      shape1.centerY === shape2.centerY &&
      shape1.radius === shape2.radius &&
      shape1.colors === shape2.colors
    );
  } else {
    return (
      shape1.constructor === shape2.constructor &&
      shape1.centerX === shape2.centerX &&
      shape1.centerY === shape2.centerY
    );
  }
}
let isSymbolFollowingMouse = false; // Track if a symbol is currently following the mouse cursor

function handleMouseDownEvent(e: SKMouseEvent) {
  if (currentState === State.GamePlayState) {
    ({ x: mx, y: my } = e as SKMouseEvent);

    // Check if a symbol is currently following the mouse cursor
    if (isSymbolFollowingMouse) {
      // Find the box in the secret pattern that was clicked
      boxes.forEach((s) => {
        if (s.hitTest(mx, my)) {
          newShape.centerX = s.centerX;
          newShape.centerY = s.centerY;
          isSymbolFollowingMouse = false; // The symbol is no longer following the mouse cursor
          userPattern.push(newShape);
          temp.pop();
        }
      });
    } else {
      // Create a copy of the clicked box's symbol
      shapes.forEach((s) => {
        if (s.hitTest(mx, my)) {
          if (s instanceof Cat) {
            newShape = new Cat(
              s.centerX,
              s.centerY,
              s.faceRadius,
              s.color,
              s.eyeAlignment
            ); // Assuming Cat constructor takes name, age, and color
          } else if (s instanceof Circle) {
            newShape = new Circle(s.centerX, s.centerY, s.radius, s.colors); // Assuming Circle constructor takes radius and colors
          } else if (s instanceof Polygon) {
            newShape = new Polygon(
              s.centerX,
              s.centerY,
              s.radius,
              s.sides,
              s.color
            ); // Assuming Polygon constructor takes points array and color
          }
          temp.push(newShape);
          isSymbolFollowingMouse = true; // A symbol is now following the mouse cursor
        }
      });
    }
  }
}

function handleMouseMoveEvent(e: SKMouseEvent) {
  if (currentState === State.GamePlayState) {
    ({ x: mx, y: my } = e as SKMouseEvent);
    if (isSymbolFollowingMouse) {
      // Update the position of the copied symbol to follow the mouse cursor
      temp.forEach((s) => {
        s.centerX = mx;
        s.centerY = my;
      });
    }
  }
}

function increaseShapeCount() {
  if (shapeCount < 9) {
    shapeCount++;
    updateStartText(shapeCount, boxCount);
  }
  if (shapeCount == 2) {
    const hotBox = new HotBox(300, 600, 100);
    hotBoxes.push(hotBox);
    shapes.push(cat2);
  }
  if (shapeCount == 3) {
    const hotBox = new HotBox(400, 600, 100);
    hotBoxes.push(hotBox);
    shapes.push(cat3);
  }
  if (shapeCount == 4) {
    const hotBox = new HotBox(500, 600, 100);
    hotBoxes.push(hotBox);
    shapes.push(circle1);
  }
  if (shapeCount == 5) {
    const hotBox = new HotBox(600, 600, 100);
    hotBoxes.push(hotBox);
    shapes.push(circle2);
  }
  if (shapeCount == 6) {
    const hotBox = new HotBox(700, 600, 100);
    hotBoxes.push(hotBox);
    shapes.push(circle3);
  }
  if (shapeCount == 7) {
    const hotBox = new HotBox(800, 600, 100);
    hotBoxes.push(hotBox);
    shapes.push(polygon1);
  }
  if (shapeCount == 8) {
    const hotBox = new HotBox(900, 600, 100);
    hotBoxes.push(hotBox);
    shapes.push(polygon2);
  }
  if (shapeCount == 9) {
    const hotBox = new HotBox(1000, 600, 100);
    hotBoxes.push(hotBox);
    shapes.push(polygon3);
  }
}

function decreaseShapeCount() {
  if (shapeCount > 1) {
    shapeCount--;
    shapes.pop();
    hotBoxes.pop();
    updateStartText(shapeCount, boxCount);
  }
}

function increaseBoxCount() {
  boxCount++;
  const lastBox = boxes[boxes.length - 1];
  const newBox = new Square(lastBox.centerX + 110, lastBox.centerY, 100, "red");
  boxes.push(newBox);
  updateStartText(shapeCount, boxCount);
}

function decreaseBoxCount() {
  if (boxCount > 1) {
    boxCount--;
    boxes.pop();
    updateStartText(shapeCount, boxCount);
  }
}

function updateStartText(patternLength: number, symbolLength: number) {
  const startText = new StartText(patternLength, symbolLength);
  texts.pop();
  texts.push(startText);
}

// Global variables to hold the current game state
// Function to generate a hidden code based on the current symbols in the hotbar

// function pickRandomBox(boxes: Square[], totalSymbols: number): Square {
//   const randomIndex = Math.floor(Math.random() * boxes.length);
//   const baseX = 100; // Initial x-coordinate
//   const incrementX = 110; // Increment for each x-coordinate
//   let availablePositions: any[] = [] ;

//   // Initialize available positions based on the total number of symbols needed
//   for (let i = 0; i < totalSymbols; i++) {
//     availablePositions.push(0);
//   }

//   let indices = Array.from({ length: totalSymbols }, (_, index) => index);

//   boxes.forEach((symbol) => {
//     const posIndex = (symbol.centerX - baseX) / incrementX;
//     availablePositions = availablePositions.filter(
//       (index) => index !== posIndex
//     );
//   });

//   const randomPosition = Math.floor(Math.random() * availablePositions.length);
//   return boxes[availablePositions[randomPosition]];

//   // for (let i = totalSymbols; i >= 0; i--) {
//   //       // Generate a random index between 0 and i
//   //       const j = Math.floor(Math.random() * (i + 1));
        
//   //       // Swap indices[i] and indices[j]
//   //       [indices[i], indices[j]] = [indices[j], indices[i]];

//   //       // Set the element at the shuffled index to 1
//   //       boxes[indices[i]];

//   //       // Log the array state to show progress
//   //       console.log(`Iteration ${totalSymbols}: Array state - ${totalSymbols}`);
//   //   }
// }

function initializeAvailableBoxes(): void {
  availableBoxIndices = boxes.map((_, index) => index);  // Initialize with all indices
}

function pickRandomBox(): Square {
  const randomIndex = Math.floor(Math.random() * availableBoxIndices.length);
  const boxIndex = availableBoxIndices.splice(randomIndex, 1)[0];
  return boxes[boxIndex];
}

function getRandomPatternSymbol(): Shape {
  const randomIndex = Math.floor(Math.random() * shapes.length);
  
  // Create a deep copy of the shape object
  let shape = Object.assign(
    Object.create(Object.getPrototypeOf(shapes[randomIndex])),
    shapes[randomIndex]
  );
  if(availableBoxIndices.length != 0){
    const box = pickRandomBox();
    shape.centerX = box.centerX;
    shape.centerY = box.centerY;
  }
  
  //console.log("shape picked for this level: ", shape);
  return shape;
}

function generateHiddenCode() {
    desiredPattern.push(getRandomPatternSymbol());
} 



//Set the event listener
setSKEventListener(handleEvent);

setSKDrawCallback((gc: CanvasRenderingContext2D) => {
  gc.clearRect(0, 0, gc.canvas.width, gc.canvas.height);
  boxes.forEach((box) => box.draw(gc));
  hotBoxes.forEach((hotBox) => hotBox.draw(gc));
  texts.forEach((text) => text.draw(gc));
  shapes.forEach((shape) => shape.draw(gc));

  if (currentState == State.MemorizeState) {
    desiredPattern.forEach((shape) => {
      if (shape) {
        shape.draw(gc);
      }
    });
  }

  if (currentState == State.GamePlayState) {
    temp.forEach((tempShape) => tempShape.draw(gc));
    userPattern.forEach((shape) => {
      if (shape) {
        shape.draw(gc);
      }
    });
  }
});

// Start SimpleKit
startSimpleKit();
