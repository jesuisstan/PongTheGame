export const makeRectangleShape = (
  canvasContext: CanvasRenderingContext2D,
  cX: number,
  cY: number,
  width: number,
  height: number,
  color: string
) => {
  canvasContext.fillStyle = color;
  canvasContext.fillRect(cX, cY, width, height);
};

export const makeCircleShape = (
  canvasContext: CanvasRenderingContext2D,
  cX: number,
  cY: number,
  radius: number,
  color: string
) => {
  canvasContext.fillStyle = color;
  canvasContext.beginPath();
  canvasContext.arc(cX, cY, radius, 90, Math.PI / 2, true);
  canvasContext.fill();
};

export const roundToTen = (num: number) => {
  return Math.round(num / 10) * 10;
};

export const roundToFive = (num: number) => {
  return Math.round(num / 5) * 5;
};

export const calculateMousePosition = (
  canvas: HTMLCanvasElement,
  mouseEvent: MouseEvent
) => {
  let rect = canvas!.getBoundingClientRect();
  let root = document.documentElement;
  let mouseX = roundToTen(mouseEvent.clientX - rect.left - root.scrollLeft);
  let mouseY = roundToTen(mouseEvent.clientY - rect.top - root.scrollTop);
  return { x: mouseX, y: mouseY };
};

export const printGoal = (
  canvasContext: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number
) => {
  canvasContext.font = '100px Verdana';
  canvasContext.fillText(
    'G',
    canvasWidth / 2 - 35,
    canvasHeight / 4 - 42
  );
  canvasContext.fillText(
    'O',
    canvasWidth / 2 - 35,
    (canvasHeight / 4) * 2 - 42
  );
  canvasContext.fillText(
    'A',
    canvasWidth / 2 - 35,
    (canvasHeight / 4) * 3 - 42
  );
  canvasContext.fillText(
    'L',
    canvasWidth / 2 - 35,
    (canvasHeight / 4) * 4 - 42
  );
};