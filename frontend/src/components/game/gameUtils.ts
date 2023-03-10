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
