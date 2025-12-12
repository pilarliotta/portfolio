// Assignment 7 - Autobiographical Game -COLOR BALL — Pilar Liotta 

const W = 600;
const H = 400;
const PLAYER_SPEED = 3;

// sequence lengths
const START_FRAMES = 80;
const FLAG_FRAMES  = 70;

// scene 3 obstacle
const OB_SPEED = 1.7;
const OB_SIZE  = 52;
const CATCH_FRAMES_TOTAL = 40;
const EXIT_FADE_TOTAL = 30;

// text
const ENDING_TEXT = "thank you for playing";
const ENDING_HINT = "press SPACE to play again";

// colors
const BLUE      = (a=255)=>color(52,152,255,a);
const BLUE_SOFT = ()=>color(180,200,255);
const SUN       = ()=>color(250,210,60);
const WHITE     = ()=>color(255);
const GRASS     = ()=>color(156,210,156);
const GRASS_D   = ()=>color(124,188,124);
const SKYLINE   = ()=>color(228,198,108);
const CITY_BG   = ()=>color(255,235,170);

let scene = 0;   // 0 = title, 1–4 = game scenes
let player, obstacle;

let collectibles = [];
let collectedCount = 0;
let goalUnlocked = false;
let messageAlpha = 255;

// mini-sequences
let startSeqActive = false, startSeqFrames = 0;
let flagSeqActive  = false, flagSeqFrames  = 0;

// obstacle catch n exit fade
let isCaught = false, catchFrames = 0;
let exitingToEnding = false, exitFadeFrames = 0;

// ending
let endingFrames = 0;

function setup() {
  createCanvas(W, H);
  textFont("monospace");
  noSmooth();
  player   = makePlayer();
  obstacle = makeObstacle();
  // start on title (scene 0)
}

function draw() {
  // Title
  if (scene === 0) {
    drawTitleScene();
    drawArcadeFrame();
    return; // skip game logic
  }

  // Game / End scene
  if (scene === 1)      drawScene1();
  else if (scene === 2) drawScene2();
  else if (scene === 3) drawScene3();
  else if (scene === 4) drawScene4();

  const paused =
    (scene === 1 && startSeqActive) ||
    (scene === 2 && flagSeqActive)  ||
    (scene === 3 && (isCaught || exitingToEnding)) ||
    scene === 4;

  if (!paused) {
    handleMovement();
    pickCollectibles();
    if (scene === 3) {
      updateObstacle();
      checkObstacleHit();
     
    }
  }

  if (scene !== 4) drawPlayer();

  if (scene === 1 && startSeqActive) drawPlaneSequence();
  if (scene === 2 && flagSeqActive)  drawSunSequence();
  if (scene === 3 && isCaught)       drawCatchEffect();

  drawHintText();
  drawArcadeFrame();
}

//Title scene 

function drawTitleScene() {
  
  for (let y = 0; y < H; y++) {
    const k = y / H;
    const c = lerpColor(color(5,10,30), color(2,0,10), k);
    stroke(c);
    line(0, y, W, y);
  }

  //  path same like ending
  const t = frameCount * 0.01;
  const currentX = W/2 + sin(t * 1.2) * 80;
  const currentY = H/2 + cos(t * 0.9) * 60;

  // same color animation as moving ball
  const tColor = frameCount * 0.05;
  const r = map(sin(tColor * 1.3), -1, 1, 200, 255);
  const g = map(sin(tColor * 1.7), -1, 1, 180, 255);
  const b = map(sin(tColor * 2.1), -1, 1, 160, 255);
  player.color = color(r, g, b);

  // draw ball
  noStroke();
  fill(player.color);
  circle(currentX, currentY, player.r * 2);

  // outline
  stroke(0, 60);
  strokeWeight(1);
  noFill();
  circle(currentX, currentY, player.r * 2 + 2);

  // title 
  textAlign(CENTER, CENTER);
  fill(255);
  textSize(20);
  text("COLOR BALL", W/2, H - 80);
     

  textSize(13);
  fill(200, 230, 255);
  text("press SPACE to start", W/2, H - 55);
text("Hi everyone! You’ll play as me in this game,", W/2, H - 320);
text("My journey from Argentina to the US, told through a colorful ball, enjoy!", W/2, H - 290);

  
}

//Game scenes

function drawScene1() {
  background(BLUE());
  drawCollectibles();
}

function drawScene2() {
  noStroke();
  fill(BLUE());   rect(0, 0, W, H/3);
  fill(WHITE());  rect(0, H/3, W, H/3);
  fill(BLUE());   rect(0, 2*H/3, W, H/3);
  drawCollectibles();
}
function drawScene3() {
  const splitX = W / 2;

  // left side farm
  fill(GRASS());
  rect(0, 0, splitX, H);

  // farm floor
  fill(GRASS_D());
  noStroke();
  rect(0, (H - 105) + 40, splitX, 85);

  // farm emojis
  drawFarmEmojis(splitX);

  // city
  fill(CITY_BG());
  rect(splitX, 0, W - splitX, H);

  // city floor 
  fill(SKYLINE());
  noStroke();
  rect(splitX, (H - 85) + 40, W - splitX, 85);

  // skyline 
  drawSkyline(splitX + 18);

  // city emojis
  drawCityEmojis(splitX);

  // obstacle
  fill(40, 40, 40, 200);
  rect(obstacle.x, obstacle.y, obstacle.size, obstacle.size, 10);

  drawCollectibles();

  // fade to ending
  if (exitingToEnding) {
    const k = 1 - exitFadeFrames / EXIT_FADE_TOTAL;
    fill(0, lerp(0, 220, k));
    rect(0, 0, W, H);
    exitFadeFrames--;
    if (exitFadeFrames <= 0) goToScene(4);
  }
}


function drawScene4() {
  endingFrames++;

  // dark gradient background
  for (let y = 0; y < H; y++) {
    const k = y / H;
    const c = lerpColor(color(5,10,30), color(2,0,10), k);
    stroke(c);
    line(0, y, W, y);
  }

  // gentle orbit movement
  const t = frameCount * 0.01;
  const currentX = W/2 + sin(t * 1.2) * 80;
  const currentY = H/2 + cos(t * 0.9) * 60;

  //player position
  player.x = currentX;
  player.y = currentY;

  // color animation/ moving ball
  const tColor = frameCount * 0.05;
  const r = map(sin(tColor * 1.3), -1, 1, 200, 255);
  const g = map(sin(tColor * 1.7), -1, 1, 180, 255);
  const b = map(sin(tColor * 2.1), -1, 1, 160, 255);
  player.color = color(r, g, b);

  // ball
  noStroke();
  fill(player.color);
  circle(currentX, currentY, player.r * 2);

  // outline
  stroke(0, 60);
  strokeWeight(1);
  noFill();
  circle(currentX, currentY, player.r * 2 + 2);

  // ending text
  textAlign(CENTER, CENTER);
  fill(255);
  textSize(16);
  text(ENDING_TEXT, W/2, H - 80);

  textSize(13);
  fill(200, 230, 255);
  text(ENDING_HINT, W/2, H - 55);
}


//mini sequence

function drawPlaneSequence() {
  const total = START_FRAMES;
  const t = 1 - startSeqFrames / total;
  const p = constrain(t, 0, 1);

  // sky gradient
  for (let y = 0; y < H; y++) {
    const k = y / H;
    const c = lerpColor(BLUE(), BLUE_SOFT(), k);
    stroke(c);
    line(0, y, W, y);
  }

 

  const planeX = lerp(-120, W + 120, p);
  const planeY = H * 0.35 + sin(p * TWO_PI) * 8;

  stroke(255, 200);
  strokeWeight(3);
  const trailStartX = max(0, planeX - 180);
  line(trailStartX, planeY + 3, planeX - 30, planeY + 3);

  drawPlane(planeX, planeY, 1.0);

  // badges: Argentina and US
  drawFlagBadge(W * 0.18, H * 0.8, 30, true);   // Argentina
  drawFlagBadge(W * 0.82, H * 0.8, 30, false);  // US

  fill(255);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(13);
  text("from Argentina to the US", W/2, H - 70);

  startSeqFrames--;
  if (startSeqFrames <= 0) {
    startSeqActive = false;
    goToScene(2);
  }
}

function drawSunSequence() {
  const total = FLAG_FRAMES;
  const t = 1 - flagSeqFrames / total;
  const k = constrain(t, 0, 1);
  const ease = easeInOutCubic(k);

  noStroke();
  fill(BLUE());  rect(0, 0, W, H/3);
  fill(WHITE()); rect(0, H/3, W, H/3);
  fill(BLUE());  rect(0, 2*H/3, W, H/3);

  const cx = W/2;
  const cy = H/2;
  const baseR = 26;
  const maxR  = 220;
  const sunR  = lerp(baseR, maxR, ease);

  for (let i = 3; i >= 1; i--) {
    fill(250,210,60, 40 + i * 25);
    circle(cx, cy, sunR * (1 + i * 0.3));
  }
  fill(250,210,60);
  circle(cx, cy, sunR);

  flagSeqFrames--;
  if (flagSeqFrames <= 0) {
    flagSeqActive = false;
    goToScene(3);
  }
}

//player

function makePlayer() {
  return { x:80, y:300, r:20, speed:PLAYER_SPEED, color:WHITE() };
}

function drawPlayer() {
  noStroke();
  fill(player.color);
  circle(player.x, player.y, player.r * 2);
  stroke(0, 60);
  strokeWeight(1);
  noFill();
  circle(player.x, player.y, player.r * 2 + 2);
}

function handleMovement() {
  let moving = false;
  if (keyIsDown(LEFT_ARROW))  { player.x -= player.speed; moving = true; }
  if (keyIsDown(RIGHT_ARROW)) { player.x += player.speed; moving = true; }
  if (keyIsDown(UP_ARROW))    { player.y -= player.speed; moving = true; }
  if (keyIsDown(DOWN_ARROW))  { player.y += player.speed; moving = true; }

  player.x = constrain(player.x, player.r, W - player.r);
  player.y = constrain(player.y, player.r, H - player.r);

  if (moving) {
    const t = frameCount * 0.05;
    const r = map(sin(t * 1.3), -1, 1, 200, 255);
    const g = map(sin(t * 1.7), -1, 1, 180, 255);
    const b = map(sin(t * 2.1), -1, 1, 160, 255);
    player.color = color(r, g, b);
  }
}

//collect

function spawnCollectiblesForScene(s) {
  collectibles = [];
  collectedCount = 0;
  goalUnlocked = false;
  messageAlpha = 255;

  if (s === 1) {
    startSeqActive = false;
    startSeqFrames = 0;
    collectibles.push(makePiece(500, 160));
    collectibles.push(makePiece(200, 140));
  } else if (s === 2) {
    flagSeqActive = false;
    flagSeqFrames = 0;
    collectibles.push(makePiece(100, 150));
    collectibles.push(makePiece(500, 260));
  } else if (s === 3) {
    collectibles.push(makePiece(180, 240));
    collectibles.push(makePiece(480, 140));
  }
}

function makePiece(x, y) {
  return { x, y, baseR:14, taken:false, pulseSpeed:random(0.08, 0.14) };
}

function drawCollectibles() {
  for (const c of collectibles) {
    if (c.taken) continue;
    const r = c.baseR + sin(frameCount * c.pulseSpeed) * 3;
    const halo = (scene === 2) ? color(255,230,120,120) : color(255,255,255,40);

    noStroke();
    for (let i = 4; i >= 1; i--) {
      fill(red(halo), green(halo), blue(halo), 25 + i * 15);
      circle(c.x, c.y, (r + 8 + i * 3) * 2);
    }
    fill(255);
    circle(c.x, c.y, r * 2);
  }
}

function pickCollectibles() {
  for (const c of collectibles) {
    if (c.taken) continue;
    if (dist(player.x, player.y, c.x, c.y) < player.r + c.baseR) {
      c.taken = true;
      collectedCount++;

      if (scene === 1 && collectedCount >= 2 && !startSeqActive) {
        startSeqActive = true;
        startSeqFrames = START_FRAMES;
      } else if (scene === 2 && collectedCount >= 2 && !flagSeqActive) {
        flagSeqActive = true;
        flagSeqFrames = FLAG_FRAMES;
      } else if (scene === 3 && collectedCount >= 2 && !exitingToEnding) {
        
        exitingToEnding = true;
        exitFadeFrames = EXIT_FADE_TOTAL;
      }
    }
  }
}

// scene 3 obstacle

function makeObstacle() {
  return { x:360, y:240, size:OB_SIZE, speed:OB_SPEED };
}

function updateObstacle() {
  let dx = player.x - obstacle.x;
  let dy = player.y - obstacle.y;
  let d = max(1, sqrt(dx*dx + dy*dy));
  obstacle.x += (dx / d) * obstacle.speed;
  obstacle.y += (dy / d) * obstacle.speed;
}

function checkObstacleHit() {
  const inset = 6;
  const rx = obstacle.x + inset;
  const ry = obstacle.y + inset;
  const rw = obstacle.size - inset * 2;
  const rh = obstacle.size - inset * 2;

  if (circleHitsRect(player.x, player.y, player.r, rx, ry, rw, rh)) {
    if (!isCaught) {
      isCaught = true;
      catchFrames = CATCH_FRAMES_TOTAL;
    }
  }
}

function drawCatchEffect() {
  const t = CATCH_FRAMES_TOTAL - catchFrames;
  const k = constrain(t / CATCH_FRAMES_TOTAL, 0, 1);

  fill(255, 0, 0, lerp(0, 120, easeOut(k)));
  rect(0, 0, W, H);

  const shrinkSize = lerp(player.r * 2, 8, easeIn(k));
  const flash = (sin(frameCount * 0.6) * 0.5 + 0.5);
  const c = lerpColor(player.color, color(255), flash);

  noStroke();
  fill(c);
  circle(player.x, player.y, shrinkSize);

  catchFrames--;
  if (catchFrames <= 0) {
    isCaught = false;
    goToScene(1);
  }
}

// scene

function goToScene(target) {
  scene = target;
  isCaught = false;
  catchFrames = 0;
  exitingToEnding = false;
  exitFadeFrames = 0;

  if (scene === 4) {
    endingFrames = 0;
    return;
  }

  player   = makePlayer();
  obstacle = makeObstacle();
  spawnCollectiblesForScene(scene);
}

function drawHintText() {
  if (scene === 4) return;
  if (scene === 0) return;           // no hint on title
  if (startSeqActive || flagSeqActive) return;
  if (messageAlpha <= 0) return;

  textAlign(CENTER, CENTER);
  textSize(14);
  fill(255, messageAlpha);
  text("move w/ arrows! collect 2 pieces to continue", W/2, H - 30);
  messageAlpha -= 2;
}

// Arcade frame
function drawArcadeFrame() {
  push();

  // scanlines
  stroke(255, 20);
  strokeWeight(1);
  for (let y = 0; y < H; y += 4) {
    line(0, y, W, y);
  }

  //  bar at top
  noStroke();
  fill(137,243,54);
  rect(18, 18, W - 37, 24, 86);

  // title
  textAlign(LEFT, CENTER);
  textSize(12);
  fill(0,180);
  text("COLOR BALL", 28, 31);

  // level label
  let label = "";  
  if (scene === 0)      label = "";
  else if (scene === 1) label = "LEVEL 1 · START";
  else if (scene === 2) label = "LEVEL 2 · I<3ARG";
  else if (scene === 3) label = "LEVEL 3 · AL to NYC";
  else if (scene === 4) label = "LEVEL 4 · END";

  textAlign(CENTER, CENTER);
  fill(0);
  text(label, W / 2, 31);

  // lives
  textAlign(RIGHT, CENTER);
  fill(0,180);
  text("LIVES: ∞", W - 28, 31);

  pop();
}

function keyPressed() {
  if (scene === 0 && key === ' ') {
    goToScene(1);  // start game from title
  } else if (scene === 4 && key === ' ') {
    goToScene(1);  // restart from ending
  }
}

//helpers

function circleHitsRect(cx, cy, cr, rx, ry, rw, rh) {
  let tx = cx;
  let ty = cy;

  if (cx < rx)       tx = rx;
  else if (cx > rx + rw) tx = rx + rw;
  if (cy < ry)       ty = ry;
  else if (cy > ry + rh) ty = ry + rh;

  const dx = cx - tx;
  const dy = cy - ty;
  return dx*dx + dy*dy <= cr*cr;
}

function easeIn(t){ return t*t; }
function easeOut(t){ return 1 - (1 - t)*(1 - t); }
function easeInOutCubic(u){
  return u < 0.5 ? 4*u*u*u : 1 - pow(-2*u + 2, 3) / 2;
}

function drawHill(x, baseY, w, h, c) {
  push();
  noStroke();
  fill(c);
  beginShape();
  vertex(x, baseY);
  bezierVertex(
    x + w*0.25, baseY - h,
    x + w*0.75, baseY - h,
    x + w, baseY
  );
  vertex(x + w, H);
  vertex(x, H);
  endShape(CLOSE);
  pop();
}

function drawSkyline(offsetX) {
  const cols = [
    { w: 44, h: 160 },
    { w: 32, h: 160 },
    { w: 56, h: 110 },
    { w: 28, h: 140 },
    { w: 36, h: 95 }
  ];
  let x = offsetX;
  for (const col of cols) {
    fill(SKYLINE());
    noStroke();
    rect(x, H - col.h, col.w, col.h, 6);
    x += col.w + 12;
  }
// city ground (right side)
fill(SKYLINE());   // 
noStroke();
rect(300, 400 - 85 + 20, 300, 85);
}

function drawPlane(x, y, s) {
  push();
  translate(x, y);
  scale(s);
  rotate(radians(-8));
  noStroke();
  fill(255);
  rectMode(CENTER);
  rect(0, 0, 60, 14, 7);
  triangle(30, 0, 45, -3, 45, 3);
  rect(-25, -10, 14, 14, 4);
  rect(0, 10, 40, 8, 4);
  rect(-10, -12, 30, 6, 4);
  fill(180, 210);
  rect(5, -4, 30, 4, 4);
  pop();
}

//  Argentina / US
function drawFlagBadge(x, y, r, isArgentina) {
  push();
  translate(x, y);
  noStroke();

  // outer ring
  fill(0, 200);
  circle(0, 0, r * 1.5);
  fill(255, 240);
  circle(0, 0, r * 1.5);

  if (isArgentina) {
    const bandH = r * 0.35;
    fill(52, 152, 255);
    rectMode(CENTER);
    rect(0, -bandH * 0.7, r, bandH, 6);
    rect(0,  bandH * 0.7, r, bandH, 6);
    fill(255);
    rect(0, 0, r, bandH, 6);
    fill(250, 210, 60);
    circle(0, 0, r * 0.25);
  } else {
    rectMode(CENTER);
    const stripeH = r * 0.22;
    fill(200, 0, 0);
    rect(0, -stripeH, r, stripeH, 4);
    fill(255);
    rect(0, 0,       r, stripeH, 4);
    fill(200, 0, 0);
    rect(0, stripeH, r, stripeH, 4);
    fill(10, 60, 140);
    rect(-r * 0.25, -stripeH * 0.5, r * 0.5, stripeH * 1.4, 3);
  }

  pop();
}

// emojis

function drawFarmEmojis(splitX) {
  push();
  textAlign(CENTER, CENTER);
  textSize(50);

  // cows n crops on the left side
  text("🐄", splitX * 0.15, H * 0.90);
  text("🐄", splitX * 0.45, H * 0.90);
  text("🌾", splitX * 0.30, H * 0.90);
  text("🌾", splitX * 0.70, H * 0.90);

  pop();
}

function drawCityEmojis(splitX) {
  push();
  textAlign(CENTER, CENTER);
  textSize(50);

  const cityCenter = splitX + (W - splitX) * 0.5;
  // taxis
  text("🚕", cityCenter - 60, H * 0.90);
  text("🚕", cityCenter + 10, H * 0.90);

  // balloon
  text("🎈", cityCenter + 60, H * 0.200);

  pop();
}

