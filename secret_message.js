let agents = [];
let count = 400; // num agents
let repelStrength = 150;
let mouseRadius = 55;
let img, imgOverlay;
let eraseRadius = 20; // erasing image overlay

function preload() {
  // Background image
  img = loadImage('img_bgd.jpg');
  // Overlay image
  imgOverlay = loadImage('tv_static.jpg'); 
}

function setup() {
  createCanvas(640, 360);
  stroke(255);
  noFill();
  strokeWeight(2);
  
  // Create agents at random positions
  for (let i = 0; i < count; i++) {
    agents.push(new Agent(random(width), random(height)));
  }
}

function draw() {
  image(img, 0, 0, width, height); // Background image
  
  // Overlay image on top of the background
  image(imgOverlay, 0, 0, width, height);

  // Update and display all agents
  for (let agent of agents) {
    agent.update();
    agent.display();
  }

  // Erase overlay image at mouse coordinates
  eraseImageAtMouse();
}

// Function to erase part of the image where the mouse is
function eraseImageAtMouse() {
  // Make sure the image has loaded its pixels
  imgOverlay.loadPixels();

  // Get the mouse position relative to the image
  let imgX = mouseX;
  let imgY = mouseY;

  // Check if mouse is within the image
  if (imgX >= 0 && imgX < imgOverlay.width && imgY >= 0 && imgY < imgOverlay.height) {
    // Iterate over the area defined by the eraseRadius
    for (let x = -eraseRadius; x <= eraseRadius; x++) {
      for (let y = -eraseRadius; y <= eraseRadius; y++) {
        // Calculate distance from the center mouse position
        let distSq = x * x + y * y;

        // If the distance is within the radius
        if (distSq <= eraseRadius * eraseRadius) {
          let px = imgX + x;
          let py = imgY + y;

          // Check if the pixel is within image
          if (px >= 0 && px < imgOverlay.width && py >= 0 && py < imgOverlay.height) {
            let index = (px + py * imgOverlay.width) * 4;

            // Set the pixel color to transparent
            imgOverlay.pixels[index + 3] = 0;
          }
        }
      }
    }

    // Update the image pixels after modification
    imgOverlay.updatePixels();
  }
}

// Agent class
class Agent {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = random(0.8, 2); 
    this.noiseOffsetX = random(1000);
    this.noiseOffsetY = random(1000);
    this.pulseSpeed = random(0.02, 0.05); 

    // Randomly assign the agent a 0 or 1
    this.value = random() > 0.5 ? 1 : 0;
  }

  update() {
    // Agent movement driven by noise
    let noiseX = noise(this.noiseOffsetX) * 2 - 1; 
    let noiseY = noise(this.noiseOffsetY) * 2 - 1; 
    
    this.x += noiseX * this.speed;
    this.y += noiseY * this.speed;
    
    // Mouse interaction (repel near mouse)
    let mouseDist = dist(this.x, this.y, mouseX, mouseY);
    if (mouseDist < mouseRadius) {
      let angle = atan2(this.y - mouseY, this.x - mouseX);
      let force = map(mouseDist, 0, mouseRadius, repelStrength, 0);
      this.x += cos(angle) * force;
      this.y += sin(angle) * force;
    }
    
    // Keep agents within the canvas
    this.x = constrain(this.x, 0, width);
    this.y = constrain(this.y, 0, height);

    // Update the noise offsets
    this.noiseOffsetX += 0.01;
    this.noiseOffsetY += 0.01;
  }

  display() {
    // Movement based on noise
    let pulse = sin(frameCount * this.pulseSpeed) * 5;
    fill(0,255,0,200); 
    noStroke();
    
    // Display 0 or 1 
    textSize(65); 
    textAlign(CENTER, CENTER);
    text(this.value, this.x, this.y); 
  }
}
