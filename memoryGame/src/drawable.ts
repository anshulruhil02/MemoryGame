import { CatColor, EyeAlignment } from "./enum";

export interface Drawable {
    draw: (gc: CanvasRenderingContext2D) => void;
}


 export class Cat implements Drawable {
    public faceCenterX: number;
    public faceCenterY: number;
    public faceRadius: number;
    public color: CatColor;
    public eyeAlignment: EyeAlignment;

    constructor(faceCenterX: number, faceCenterY: number, faceRadius: number, color: CatColor, eyeAlignment: EyeAlignment) {
        this.faceCenterX = faceCenterX;
        this.faceCenterY = faceCenterY;
        this.faceRadius = faceRadius;
        this.color = color;
        this.eyeAlignment = eyeAlignment;
    }
    

    draw(gc: CanvasRenderingContext2D): void {
        const leftEar = [
            [this.faceCenterX - this.faceRadius * 0.875, this.faceCenterY - this.faceRadius * 0.375], // (125, 375)
            [this.faceCenterX - this.faceRadius, this.faceCenterY - this.faceRadius * 1.25], // (100, 550)
            [this.faceCenterX - this.faceRadius * 0.25, this.faceCenterY - this.faceRadius * 0.875] // (250, 475)
        ];

        const rightEar = [
            [this.faceCenterX + this.faceRadius * 0.875, this.faceCenterY - this.faceRadius * 0.375], // (125, 375)
            [this.faceCenterX + this.faceRadius, this.faceCenterY - this.faceRadius * 1.25], // (100, 550)
            [this.faceCenterX + this.faceRadius * 0.25, this.faceCenterY - this.faceRadius * 0.875] // (250, 475)
        ];
        
        let eyeOffsetX;
        switch (this.eyeAlignment) {
            case EyeAlignment.Left:
                eyeOffsetX = -this.faceRadius * 0.1;
                break;
            case EyeAlignment.Centre:
                eyeOffsetX = 0;
                break;
            case EyeAlignment.Right:
                eyeOffsetX = this.faceRadius * 0.1;
                break;
        }
        
        
        // Draw the left ear
        gc.beginPath();
        
        gc.lineWidth = 3;
        gc.strokeStyle = "black";
        gc.moveTo(leftEar[0][0], leftEar[0][1]); // Move to the first point
        leftEar.forEach((p) => {
            const [x, y] = p;
            gc.lineTo(x, y);
        });
        gc.strokeStyle = "black"
        gc.fillStyle = this.color;
        gc.fill();
        gc.closePath();
        gc.stroke();

        // Draw the right ear
        gc.beginPath();
        gc.lineWidth = 3;
        gc.strokeStyle = "black";
        gc.moveTo(rightEar[0][0], rightEar[0][1]); // Move to the first point
        rightEar.forEach((p) => {
            const [x, y] = p;
            gc.lineTo(x, y);
        });
        gc.strokeStyle = "black"
        gc.fillStyle = this.color;
        gc.fill();
        gc.closePath();
        gc.stroke();

        // Draw the face
        
        gc.beginPath();
        gc.arc(this.faceCenterX, this.faceCenterY, this.faceRadius, 0, 2 * Math.PI);
        gc.strokeStyle = "black";
        gc.fillStyle = this.color;
        gc.fill();
        gc.stroke();

        // Draw the left eye
        gc.strokeStyle = "black";
        gc.beginPath();
        gc.ellipse(
            this.faceCenterX - this.faceRadius * 0.5, // x coordinate
            this.faceCenterY, // y coordinate
            this.faceRadius * 0.2, // x radius
            this.faceRadius * 0.3, // y radius
            0, // no rotation
            0, 2 * Math.PI // full ellipse
        );
        gc.fillStyle = "white";
        gc.fill();
        gc.stroke();

        // Draw the right eye
        gc.strokeStyle = "black";
        gc.beginPath();
        gc.ellipse(
            this.faceCenterX + this.faceRadius * 0.5, // x coordinate
            this.faceCenterY, // y coordinate
            this.faceRadius * 0.2, // x radius
            this.faceRadius * 0.3, // y radius
            0, // no rotation
            0, 2 * Math.PI // full ellipse
        );
        gc.fillStyle = "white";
        gc.fill();
        gc.stroke();

        // Draw the left pupil
        gc.fillStyle = "black";
        gc.beginPath();
        gc.ellipse(
            this.faceCenterX - this.faceRadius * 0.5 + eyeOffsetX, // x coordinate
            this.faceCenterY, // y coordinate
            this.faceRadius * 0.05, // x radius (smaller than eye)
            this.faceRadius * 0.075, // y radius (smaller than eye)
            0, // no rotation
            0, 2 * Math.PI // full ellipse
        );
        gc.fill();

        // Draw the right pupil
        gc.fillStyle = "black";
        gc.beginPath();
        gc.ellipse(
            this.faceCenterX + this.faceRadius * 0.5 + eyeOffsetX, // x coordinate
            this.faceCenterY, // y coordinate
            this.faceRadius * 0.05, // x radius (smaller than eye)
            this.faceRadius * 0.075, // y radius (smaller than eye)
            0, // no rotation
            0, 2 * Math.PI // full ellipse
        );
        gc.fill();
    }

    hitTest(mx: number, my: number): boolean{
        return Math.sqrt((mx - this.faceCenterX) ** 2 + (my - this.faceCenterY) ** 2) < this.faceRadius;
    }
}

export class Circle implements Drawable {
    public centerX: number;
    public centerY: number;
    public radius: number;
    public colors: string[];

    constructor(centerX: number, centerY: number, radius: number, colors: string[]) {
        this.centerX = centerX;
        this.centerY = centerY;
        this.radius = radius;
        this.colors = colors;
    }

    draw(gc: CanvasRenderingContext2D): void {
        const step = this.radius / this.colors.length;
        for (let i = 0; i < this.colors.length; i++) {
            gc.beginPath();
            gc.arc(this.centerX, this.centerY, this.radius - i * step, 0, 2 * Math.PI);
            gc.fillStyle = this.colors[i];
            gc.fill();
            gc.strokeStyle = "black";
            gc.lineWidth = 2;
            gc.stroke();
            gc.closePath();
        }
    }

    hitTest(mx: number, my: number): boolean{
        return Math.sqrt((mx - this.centerX) ** 2 + (my - this.centerY) ** 2) < this.radius;
    }
}


export class Polygon implements Drawable {
    public centerX: number;
    public centerY: number;
    public radius: number;
    public sides: number;
    public color: string;

    constructor(centerX: number, centerY: number, radius: number, sides: number, color: string) {
        this.centerX = centerX;
        this.centerY = centerY;
        this.radius = radius;
        this.sides = sides;
        this.color = color;
    }

    draw(gc: CanvasRenderingContext2D): void {
        const angleStep = (2 * Math.PI) / this.sides;
        gc.beginPath();
        for (let i = 0; i < this.sides; i++) {
            const x = this.centerX + this.radius * Math.cos(i * angleStep - Math.PI / 2);
            const y = this.centerY + this.radius * Math.sin(i * angleStep - Math.PI / 2);
            if (i === 0) {
                gc.moveTo(x, y);
            } else {
                gc.lineTo(x, y);
            }
        }
        gc.closePath();
        gc.fillStyle = this.color;
        gc.fill();
        gc.strokeStyle = "black";
        gc.lineWidth = 2;
        gc.stroke();
    }

    hitTest(mx: number, my: number): boolean{
        return Math.sqrt((mx - this.centerX) ** 2 + (my - this.centerY) ** 2) < this.radius;
    }
}

export class Square implements Drawable {
    public centerX: number;
    public centerY: number;
    private size: number;
    private color: string;

    constructor(centerX: number, centerY: number, size: number, color: string = "red") {
        this.centerX = centerX;
        this.centerY = centerY;
        this.size = size;
        this.color = color;
    }

    draw(gc: CanvasRenderingContext2D): void {
        gc.beginPath();
        // Calculate the top-left corner
        const topLeftX = this.centerX - this.size / 2;
        const topLeftY = this.centerY - this.size / 2;

        gc.rect(topLeftX, topLeftY, this.size, this.size);
        gc.fillStyle = this.color;
        gc.fill();
        gc.strokeStyle = "black";
        gc.lineWidth = 2;
        gc.stroke();
        gc.closePath();
    }

    hitTest(mx: number, my: number): boolean{
        return Math.sqrt((mx - this.centerX) ** 2 + (my - this.centerY) ** 2) < this.size / 2;
    }
}


export class StartText implements Drawable {
    private patternLength: number;
    private symbolLength: number;
    constructor(patternLength: number, symbolLength: number) {
        this.patternLength = patternLength;
        this.symbolLength = symbolLength;
    }
    draw(gc: CanvasRenderingContext2D): void {
        gc.font = "24px Arial";
        gc.fillStyle = "black";
        gc.fillText("Press SPACE to play", 500, 50);

        gc.font = "24px Arial";
        gc.fillStyle = "black";
        gc.fillText("Pattern Length = " + this.patternLength + "Symbol Length = " + this.symbolLength, 400, 80);
    }
}

export class MemorizeText implements Drawable {
    draw(gc: CanvasRenderingContext2D): void {
        gc.font = "24px Arial";
        gc.fillStyle = "black";
        gc.fillText("What Was The Pattern:", 500, 50);

        gc.font = "24px Arial";
        gc.fillStyle = "black";
        gc.fillText("Press SPACE To Submit Your Guess!", 400, 80);
    }
}


export class GameText implements Drawable {
    draw(gc: CanvasRenderingContext2D): void {
        gc.font = "24px Arial";
        gc.fillStyle = "black";
        gc.fillText("Memorize The Pattern:", 500, 50);

        gc.font = "24px Arial";
        gc.fillStyle = "black";
        gc.fillText("Press SPACE To Start!", 400, 80);
    }
}



export class WinText implements Drawable {
    draw(gc: CanvasRenderingContext2D): void {
        gc.font = "24px Arial";
        gc.fillStyle = "black";
        gc.fillText("Congratulations, you won!", 500, 50);

        gc.font = "24px Arial";
        gc.fillStyle = "black";
        gc.fillText("Press SPACE To Play Again!", 400, 80);
    }
}

export class HotBox implements Drawable {
    private centerX: number;
    private centerY: number;
    private size: number;

    constructor(centerX: number, centerY: number, size: number) {
        this.centerX = centerX;
        this.centerY = centerY;
        this.size = size;
    }

    draw(gc: CanvasRenderingContext2D): void {
        gc.beginPath();
        // Calculate the top-left corner
        const topLeftX = this.centerX - this.size / 2;
        const topLeftY = this.centerY - this.size / 2;

        gc.rect(topLeftX, topLeftY, this.size, this.size);
        gc.strokeStyle = "black";
        gc.lineWidth = 2;
        gc.stroke();
        gc.closePath();
    }
}