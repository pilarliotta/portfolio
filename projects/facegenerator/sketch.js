// CC Lecture/Lab Assigment 2 Face Generator
//Pilar Liotta

let sad = 240;
let smile = 240;
let morph = 0;   // 0 = small circle, 1 = big square
let target = 0;  // target morph value
let palIdx = 0;

const palettes = [
  { color1: [255, 105, 180], color2: [0, 255, 255] },
  { color1: [0, 255, 0], color2: [249,52,49 ] },
  { color1: [255,154,0], color2: [227,255,0] },
];

function setup() {
  createCanvas(400, 400);
  colorMode(RGB);
  noStroke();
  frameRate(60);
  bgColor = color(40); // background
}

function draw() {
  background(bgColor); // background
  
  // morph in
  morph = lerp(morph, target, 0.12);
  const u = easeInOutCubic(morph);

  // face
  Face(sad, smile, u);
  
    // instruction text on bottom 
  fill(255);
  textSize(11);
  text(
    "Space = morph | C = change colors | R = randomize | click = move & morph",
    width/25, height - 15
  );
}


function Face(x, y, u) {
  push();
  translate(x, y);
  
  // Size changes small to big
  const size = lerp(70, 200, u);
  
  // Shape changes circle to square
  const corner = lerp(size / 2, 5, u);
  
  //  transition between two colors
  const pal = palettes[palIdx];
  const faceColor = lerpColor(
    color(pal.color1[0], pal.color1[1], pal.color1[2]),
    color(pal.color2[0], pal.color2[1], pal.color2[2]),
    u
  );

  //  face shape
  rectMode(CENTER);
  fill(faceColor);
  rect(0, 0, size, size, corner);
  
  //eyes 
  fill(20);
  let eyeSize = size * 0.10;
  let eyeOffsetX = lerp(size * 0.18, size * 0.22, u);
  let eyeY = -size * 0.15;
  
  ellipse(-eyeOffsetX, eyeY, eyeSize);
  ellipse(eyeOffsetX, eyeY, eyeSize);
  
  //mouth 
  stroke(70);
  strokeWeight(max(4, size * 0.03));
  noFill();
  
  let mouthY = size * 0.15;
  let mouthWidth = size * 0.3;
  
  if (u < 0.3) {
    // meh face
    line(-mouthWidth/2, mouthY, mouthWidth/2, mouthY);
  } else if (u < 0.7) {
    // smile
    arc(0, mouthY, mouthWidth, mouthWidth * 0.3, 0, PI);
  } else {
    // big smile
    arc(0, mouthY, mouthWidth, mouthWidth * 0.7, 0, PI);
  }
  
  pop();
}

function keyPressed() {
  if (key === ' ') {
    // Spacebar goes to morphing colors 
    target = target === 0 ? 1 : 0;
  }
  if (key === 'C' || key === 'c') {
    // change color palettes
    palIdx = (palIdx + 1) % palettes.length;
  }
  if (key === 'R' || key === 'r') {
    // randomize
    randomizeColors();
    randomizeBackground();
  }

}
 
function mousePressed() {
  //  move face and triggers morph
  sad = mouseX;
  smile = mouseY;
  target = 1; // square
  randomizeBackground(); //  change background on click
  
  // return back
   setTimeout(() => { target = 0; }, 1000);

}

function randomizeColors() {
  for (let i = 0; i < palettes.length; i++) {
    palettes[i].color1 = [random(255), random(255), random(255)];
    palettes[i].color2 = [random(255), random(255), random(255)];
  }
  palIdx = 0;
}

function randomizeBackground() {
  //random color for the background
  bgColor = color(random(255), random(255), random(255));
}

function easeInOutCubic(u) {
  return u < 0.5 ? 4 * u * u * u : 1 - pow(-2 * u + 2, 3) / 2;
}
  
