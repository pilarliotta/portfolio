// CC Assignment 4 — Exquisite Corpse - Pilar Liotta
// Canvas: 400 x 600

let armSize = 80;  //  arm size
let growing = false;

// Functions w/ arguments 
function drawUnitard(col) {
  fill(col);
  noStroke();
  beginShape();
  vertex(140, 240);
  vertex(140, 310);
  quadraticVertex(150, 330, 170, 330);
  vertex(230, 330);
  quadraticVertex(250, 330, 260, 310);
  vertex(260, 240);
  endShape(CLOSE);
}

function drawStraps(col) {
  fill(col);
  rect(170, 170, 15, 90, 8);
  rect(215, 170, 15, 90, 8);
}

function drawArms(size) {
  push();
  textStyle(NORMAL);   
  textSize(size);
  text('💪🏼', 120, 200);
  scale(-1, 1);
  text('💪🏼', -280, 200);
  pop();
}

function drawSock(x, baseCol, heartCol, side="left") {
  // sock 
  fill(baseCol); 
  stroke(0); 
  strokeWeight(3);
  rect(x, 410, 35, 70);

  // foot 
  if (side === "left") {
    rect(110, 470, 80, 35); 
  } else {
    rect(210, 470, 80, 35);
  }

  // hearts
  fill(heartCol);
  noStroke();
  textSize(17);
  if (side === "left") {
    text('♥', 165, 425);
    text('♥', 175, 455);
    text('♥', 135, 490);
  } else {
    text('♥', 224, 425);
    text('♥', 230, 455);
    text('♥', 255, 490);
  }
}

function setup() {
  // create the logical canvas at the intended resolution
  const cnv = createCanvas(400, 600);
  // avoid high-DPI doubling artifacts on Retina displays
  pixelDensity(1);
  // scale the displayed canvas to fit the parent container responsively
  // keeps drawing coordinates the same while allowing the canvas to scale
  cnv.style('width', '100%');
  cnv.style('height', 'auto');
  // ensure the element itself doesn't force a white background
  cnv.style('background', 'transparent');
  textAlign(CENTER, CENTER);
}

function windowResized() {
  // keep the internal drawing resolution fixed (400x600)
  // but ensure the displayed canvas still fills the container width
  const cnv = document.querySelector('canvas');
  if (cnv) {
    cnv.style.width = '100%';
    cnv.style.height = 'auto';
  }
}

function draw() {
  // use the parent blue so the canvas matches the page
  background('#3C71FF');

  // Ears
  fill(255, 208, 176);
  stroke(0);
  strokeWeight(3);
  ellipse(120, 130, 65, 70);
  ellipse(280, 130, 65, 70);
  ellipse(140, 150, 55, 60);
  ellipse(260, 150, 55, 60);

  // Head
  ellipse(200, 120, 140, 140);

  // Eyes
  fill(0);
  ellipse(170, 115, 12, 12);
  ellipse(230, 115, 12, 12);

  // Nose 
  fill(255, 208, 176);
  triangle(200, 125, 190, 145, 210, 145);

  // Chest
  fill(255, 208, 176);
  rect(180, 180, 50, 80);

  // Belly button
  fill(0);
  ellipse(200, 220, 4, 4);

  // Unitard / straps
  drawUnitard(color(255, 107, 157));
  drawStraps(color(255, 107, 157));

  // Buttons
  fill(0, 85, 255);
  ellipse(180, 280, 14, 14);
  ellipse(220, 280, 14, 14);

  // Arms 
  drawArms(armSize);

  // Growth/shrink 
  if (growing && armSize < 120) {  
    armSize += 2;   
  } else if (!growing && armSize > 80) {
    armSize -= 2;   
  }

  // Legs
  fill(255, 208, 176);
  rect(160, 330, 25, 80);
  rect(215, 330, 25, 80);

  // Leg hair (left)
  stroke(139, 107, 71);
  strokeWeight(2);
  for (let i = 0; i < 10; i++) {
    let y = 340 + i * 7;
    line(163, y, 159, y + 4);
    line(178, y, 182, y + 4);
  }

  // Leg hair (right)
  for (let i = 0; i < 10; i++) {
    let y = 340 + i * 7;
    line(218, y, 214, y + 4);
    line(233, y, 237, y + 4);
  }

  // Socks
  drawSock(155, color(255, 229, 229), color(255, 0, 85), "left");   // left
  drawSock(210, color(229, 229, 255), color(0, 85, 255), "right");  // right

  // text
  push();
  noStroke();
  fill(0, 180);        
  textStyle(NORMAL);
  textSize(18);
  text('Press SPACE to flex arms', width/2, height - 40);
  pop();
}

// Spacebar 
function keyPressed() {
  if (key === ' ') {
    growing = !growing;  
  } 
}
