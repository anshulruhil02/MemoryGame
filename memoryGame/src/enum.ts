export enum CatColor {
    Brown = 'brown',
    Orange = 'orange',
    Blue = 'blue'
}

export enum EyeAlignment {
    Left = 'left',
    Centre = 'centre',
    Right = 'right'
}

export function getRandomCatColor(): CatColor {
    const colors = Object.values(CatColor);
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex] as CatColor;
  }
  
