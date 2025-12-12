// CC Assignment 3 — Experimental Clock - Pilar Liotta
// Canvas: 600 x 600

let pixelFont;
let use24h = true;   // clock time
let fontSize = 40;   //  size
let spacing = 0.85;  // space w/ the text

// colors are the background, text color , hover color
const palettes = [
  { bg: [250,250,250], fg: [25,25,25],   hover: [137,243,54] },
  { bg: [249, 0, 255],    fg: [235,235,235], hover: [82, 0, 255] },
  { bg: [8,18,28],     fg: [137,243,54], hover: [255,255,255] }
];
let paletteIdx = 0;

function preload() {
  pixelFont = loadFont('PixelifySans.ttf'); // google font called Pixelify Sans
}

function setup() {
  createCanvas(600, 600);
  textFont(pixelFont);
  textAlign(CENTER, CENTER);
  noStroke();
}

function draw() {
  const P = palettes[paletteIdx % palettes.length];
  background(P.bg);

  // clock time
  let h = hour(), m = minute(), s = second();
  let dispH = use24h ? h : ((h % 12) === 0 ? 12 : h % 12);
  const hh = nf(dispH, 2);
  const mm = nf(m, 2);
  const ss = nf(s, 2);
  const timeStr = `${hh}:${mm}:${ss}`;

  // time grid
  textSize(fontSize);
  const tw = textWidth(timeStr);
  const th = fontSize * 1.1;         //  length
  const cellW = tw * (1 + (1 - spacing)); // how tighter the grid is
  const cellH = th * (1 + (1 - spacing));

  // grid fit
  const cols = max(1, floor(width / cellW));
  const rows = max(1, floor(height / cellH));
  const startX = (width  - cols * cellW) / 2 + cellW / 2;
  const startY = (height - rows * cellH) / 2 + cellH / 2;

  // changes color on hover
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = startX + c * cellW;
      const y = startY + r * cellH;

      // way to hover with the width and height 
      const hover =
        mouseX >= x - tw/2 && mouseX <= x + tw/2 &&
        mouseY >= y - th/2 && mouseY <= y + th/2;

      if (hover) fill(P.hover);
      else fill(P.fg);

      text(timeStr, x, y);
    }
  }
  // written instructions
  textSize(12);
  fill(P.fg[0], P.fg[1], P.fg[2], 140);
  text("t = 12 or 24hrs ,  q / w = size ,  c = colors", width/2, height - 16);
}

function keyPressed() {
  if (key === 't' || key === 'T') use24h = !use24h;
  if (key === 'q') fontSize = max(10, fontSize - 2);
  if (key === 'w') fontSize = min(100, fontSize + 2);
  if (key === 'c' || key === 'C') paletteIdx++;
}
