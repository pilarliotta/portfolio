// CC Assignment 5 — Optical Illusion - Pilar Liotta
// Canvas: 600 x 600


let img;
let r = 120;              // size of the ball
let sx = 0, sy = 0;       // ball position
let rotX = 0, rotY = 0;   // ball spins when I drag it
let pmx = 0, pmy = 0;     //  drag distance
let draggingMove = false; //dragging the ball

function preload() {
  img = loadImage('12.jpg.webp');
}

function setup() {
  createCanvas(600, 600, WEBGL);
  noStroke();
}

function draw() {
  // draw my background image first , blurry for vibes
  push();
  resetMatrix(); camera();
  ortho(-width/2, width/2, -height/2, height/2, 0.1, 10000);
  imageMode(CENTER);
  image(img, 0, 0, width, height);
  filter(BLUR, 2);
  pop();

  // orbit camera 
  if (!draggingMove) orbitControl();

  // stops the ball from escaping the screen
  sx = constrain(sx, -width/2 + r, width/2 - r);
  sy = constrain(sy, -height/2 + r, height/2 - r);

  // spin 
  if (draggingMove && mouseIsPressed) {
    let dx = mouseX - pmx;
    let dy = mouseY - pmy;

    // make it grow/shrink 
    r = r - dy * 0.2;
    r = constrain(r, 20, 300); // so it doesn't vanish 
    // move the ball around
    sx += dx;
    sy += dy;

    // contained 
    sx = constrain(sx, -width/2 + r, width/2 - r);
    sy = constrain(sy, -height/2 + r, height/2 - r);
  
    // slight rotation 
    rotY += dx / r;
    rotX += -dy / r; 
    
  }

  //  mouse position 
  pmx = mouseX;
  pmy = mouseY;

  //  the ball 
  push();
  translate(sx, sy, 0);
  rotateX(rotX);
  rotateY(rotY);
  texture(img);
  sphere(r);
  pop();

  // NESTED FOR LOOP — sparkle dots//  requirement for assignment
  const cell = 85;
  resetMatrix(); camera(); ortho();
  noStroke();
  for (let y = cell/2; y < height; y += cell) {
    for (let x = cell/2; x < width; x += cell) {
      fill(255, 220); // soft white dots sparkly 
      ellipse(x - width/2, y - height/2, 6, 6);
    }
  }
}

function mousePressed() {
  // start dragging only if I'm actually clicking on the ball
  if (mouseButton === LEFT) {
    const mx = mouseX - width/2;
    const my = mouseY - height/2;
    if (dist(mx, my, sx, sy) <= r + 20) {
      draggingMove = true;
      pmx = mouseX; pmy = mouseY;
    }
  }
}

function mouseReleased() {
  draggingMove = false;
}

