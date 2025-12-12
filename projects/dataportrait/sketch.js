// Pilar Liotta
// CC Lecture / Lab | Assignment 6
// Data Portrait

// layout
let time = 0, speed = 0.015;
let paused = false, mode = 0, gate = true; // intro page
const ROWS = 76;
const PAD  = 40;            // outer padding
const BAR  = 45;            // header bar height

// color / labels 
const COLORS = ["#FF7A00", "#18D07A", "#8A2BE2"];
const TITLES = ["Champagne Coast", "Simulation Swarm", "What You Like"];
const GENRES  = [
  ["art pop","r&b/soul","indie pop"],
  ["indie","folk","alternative"],
  ["electronic","house","dance"]
];

// audio partss
let coast, swarm, wyl;       // files
let snd = null;              // current file
let amp, fft;                // analyzers

function preload(){
  soundFormats('mp3');
  coast = loadSound('coast.mp3', ()=>{}, ()=> coast = null);
  swarm = loadSound('swarm.mp3', ()=>{}, ()=> swarm = null);
  wyl   = loadSound('whatyoulike.mp3', ()=>{}, ()=> wyl   = null);
}

function setup(){
  createCanvas(600, 600);
  noFill(); strokeWeight(2);
  textAlign(CENTER, CENTER); textFont('sans-serif');

  amp = new p5.Amplitude(0.9);
  fft = new p5.FFT(0.9, 64);
  snd = coast || null; // visuals still run if null
}

function draw(){
  background(0);
  if (!paused && !gate) time += speed;

  // framed area
  const L = PAD, R = width - PAD;
  const T = BAR + PAD, B = height - PAD;
  const W = R - L;

  // gate screen
  if (gate){
    drawSoftFrame(L, T, W, B - T);
    drawHeader();
    fill(255); noStroke(); textSize(13);
    text("Top Spotify Tracks — Click to Start", width/2, T + (B - T)/2);
    return;
  }

  // audio bands 
  const bands = getBands(); 

  // motion mapping 
  const swell = map(bands.bass, 0, 1,   4, 26, true);  // row spacing
  const curl  = map(bands.mid , 0, 1,   2,  5, true);  // sideways wobble
  const rip   = map(bands.tre , 0, 1,   0,  5, true);  // fine ripples
  const deep  = map(bands.lvl , 0, 0.5, 0, 30, true);  // bump depth

  // bumps
  const bump1x = L + W * (0.5 + 0.5 * sin(time*0.22));
  const bump2x = L + W * (0.5 + 0.5 * sin(-time*0.58 + 1.2));

  // rows
  stroke(COLORS[mode]);
  for (let i = 0; i < ROWS; i++){
    const k  = i / (ROWS - 1);
    const y0 = lerp(T, B, k) + (k - 0.1) * swell;
    const ph = i * 0.09 + time;

    beginShape();
    for (let x = L; x <= R; x += 3){
      vertex(x, yAt(x, y0, ph, i, {
        curl, rip, deep, bump1x, bump2x, T, B, bass: bands.bass
      }));
    }
    endShape();
  }

  // header
  drawHeader();
}

// y for a point on a row with border
function yAt(x, y0, ph, rowIndex, p){
  const n  = (noise(x*0.004, rowIndex*0.10 + time*0.75) - 0.5) * (24 + 9*p.bass);
  const sw = p.curl * sin(x*0.015 + ph);
  const rp = p.rip  * sin(x*0.09  - ph*0.7);

  const d1 = x - p.bump1x, d2 = x - p.bump2x;
  const m1 = -(5 + p.deep)     * exp(-0.5 * (d1*d1) / (70*70));
  const m2 = -(9 + p.deep*0.8) * exp(-0.5 * (d2*d2) / (55*55));

  let y = y0 + n + sw + rp + m1 + m2;

  // fixing to return to constrain
  if (!isFinite(y)) y = y0;

  return constrain(y, p.T, p.B);
}

// bands with hard guards 
function getBands(){
  let lvl = 0, bass = 0, mid = 0, tre = 0;

  if (snd && snd.isLoaded()){
    // amplitude
    lvl = amp.getLevel();
    if (!isFinite(lvl)) lvl = 0;

    // spectrum
    fft.analyze();

    bass = fft.getEnergy(20,150);
    mid  = fft.getEnergy(400,2000);
    tre  = fft.getEnergy(4000,12000);

    // guard each
    if (!isFinite(bass)) bass = 0;
    if (!isFinite(mid )) mid  = 0;
    if (!isFinite(tre )) tre  = 0;

    // scale 0..1
    bass /= 255; mid /= 255; tre /= 255;

    // clamp
    bass = constrain(bass, 0, 1);
    mid  = constrain(mid , 0, 1);
    tre  = constrain(tre , 0, 1);
  }

  return { lvl, bass, mid, tre };
}

//  frame
function drawSoftFrame(x, y, w, h){
  fill(255,20); noStroke();
  rect(x, y, w, h, 6);
}

// header / genre 
function drawHeader(){
  noStroke(); fill(0,220);
  rect(0, 0, width, BAR);

  fill(255); textSize(12);
  const status = snd?.isPlaying() ? "Playing" : "Paused";
  text(`${TITLES[mode]} • ${status} — // SPACE: next song // P: pause`, width/2, 32);

  const tags = GENRES[mode];
  const col  = color(COLORS[mode]);
  textSize(11);

  const PILL_PAD = 30, GAP = 8, H = 25, R = 9;
  let widths = [], total = 0;
  for (const s of tags){
    const w = textWidth(s) + PILL_PAD*2;
    widths.push(w); total += w;
  }
  total += GAP * (tags.length - 1);

  let x = (width - total)/2, y = BAR - 2;
  for (let i=0; i<tags.length; i++){
    fill(0,200); stroke(col); strokeWeight(1.2);
    rect(x, y, widths[i], H, R);
    noStroke(); fill(255);
    text(tags[i], x + widths[i]/2, y + H/2);
    x += widths[i] + GAP;
  }
}

// controls / audio
function mousePressed(){
  if (gate){
    getAudioContext().resume();
    gate = false;
    pick(mode, true);
    return;
  }
  paused = !paused;
  if (snd && snd.isLoaded()){
    if (paused && snd.isPlaying()) snd.pause();
    else if (!paused && !snd.isPlaying()) snd.play();
  }
}

function keyPressed(){
  if (gate){ mousePressed(); return; }
  if (key === ' ') pick((mode + 1) % 3, true);
  if (key === 'p' || key === 'P') mousePressed();
}

function pick(m, autoplay=false){
  mode = m;
  [coast, swarm, wyl].forEach(s => { if (s && s.isPlaying()) s.stop(); });
  snd = [coast, swarm, wyl][mode] || null;

  if (autoplay && snd && snd.isLoaded()){
    snd.setVolume(0.65);
    snd.loop();
    fft.setInput(snd);
    amp.setInput(snd);
  }
}
