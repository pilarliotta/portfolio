// CC Lecture/Lab | Assignment 1 — Lost & Found
// Pilar Liotta — 400 x 400
// Partner: Jia
// Based on description of St. Felix St. Brooklyn townhouses


function setup() {
  createCanvas(400, 400);
  noStroke();
  textAlign(CENTER, CENTER);
}

function draw() {
  background(135, 206, 235); //  sky

  // Sun Emoji 
  push();
  translate(mouseX, mouseY);
  textSize(64);           
  text("☀️", 0, 0);        // sun emoji
  pop();

  

  // Sidewalk and street
  fill(210); rect(0, 300, width, 100); // sidewalk
  fill(185); rect(0, 330, width, 70);  // street

  

  // Four houses (0, 100, 200, 300)
  for (let i = 0; i < 4; i++) {
    let x = i * 100;
    let c;
    if (i === 0) c = color(228, 189, 82);
    if (i === 1) c = color(201, 136, 111);
    if (i === 2) c = color(150, 121, 105);
    if (i === 3) c = color(204, 200, 111);

    push();
    translate(x, 110);

    // 
    fill(c); rect(0, 0, 100, 150, 2);
push();
blendMode(MULTIPLY);
// a warm orange shadow —
fill(255, 170, 60, 120);      
rect(0, 0, 80, 150);
blendMode(BLEND);
pop();


      fill(20); rect(0, 150, 290, 40); // back of stair steps

    // steps in front
    push();
    translate(0, 140);
    fill(70); // dark gray steps
    for (let s = -2; s < 9; s++) {
      rect(10 - s*3, s*6, 80 + s*6, 6);
    }
    pop();
    
    
    
    
    // windows 
    // top left window
    fill(235); rect(11, 14, 28, 46, 2); // trim
    fill(210); rect(15, 20, 20, 34, 1); // pane

    // top right window
    fill(235); rect(52, 14, 28, 46, 2);
    fill(210); rect(56, 20, 20, 34, 1);

    // bottom window
    fill(235); rect(11, 64, 28, 46, 2);
    fill(210); rect(15, 70, 20, 34, 1);

    // door aligned to stoop
    fill(45); rect(50, 70, 30, 52, 1);
    fill(220); ellipse(73, 96, 3, 3); // knob

   

    pop();
  }
// 🌳 
  push();
  textSize(90);           //  tree emoji
  text("🌳", 80, 275);    
  pop();
  
  //🌳 
  push();
  textSize(90);           //  tree emoji
  text("🌳", 300, 275);    
  pop();
         //🍂 
  push();
  textSize(20);           //  leaf emoji
  text("🍂", 60, 315);    
  pop(); //🍂 
  push();
  textSize(20);           //  leaf emoji
  text("🍂", 100, 315);    
  pop();
    //🍂 
  push();
  textSize(20);           //  leaf emoji
  text("🍂", 320, 315);    
  pop();
     //🍂 
  push();
  textSize(20);           //  leaf emoji
  text("🍂", 280, 315);    
  pop();
  
  //  blue car going right-to-left
  let blueCarX = width - (frameCount * 1 % (width + 100)); // speed 0.5

  textSize(60);
  text("🚙", blueCarX, 350); // blue car, y=350
  
  
   // right-to-left motion:
  let x = width - (frameCount * 2 % (width + 100));

  textSize(80);
  text("🚗", x, 350); // car emoji, y=350, moving right to left

  
  
      //  ☁️ 
  push();
  textSize(85);           // ☁️ emoji
  text("☁️", 170, 50);    
  pop();
   
         //  ☁️ 
  push();
  textSize(80);           // ☁️ emoji
  text("☁️", 300, 40);    
  pop();
   
  
  
  // roof 
  push();
  translate(0, 120);
  fill(35); rect(0, -18, 400, 14, 2);
  pop();
}

