/*
Extra features implemented:
1. Random image is displayed on the left when program is run, and random image changes when any key is pressed
2. Image on the right transitions from random image to average image based on mouseX
*/

var imgs = [];
var avgImg;
var numOfImages = 30;
var filename;
var img;

//////////////////////////////////////////////////////////
function preload() { // preload() runs once
    // load images into array
    for (i = 0; i < numOfImages; i++) {
        filename = "assets/" + i + ".jpg";
        imgs.push(loadImage(filename));
    }
    
    // generate first random image
    img = random(imgs);
}
//////////////////////////////////////////////////////////
function setup() {
    createCanvas(img.width * 2, img.height);
    pixelDensity(1);
    background(125);
    
    // display random image on the left
    image(img, 0, 0);
    
    // create buffer for average image
    avgImg = createGraphics(img.width, img.height);
}
//////////////////////////////////////////////////////////
function draw() {
    // load pixels for all images
    for (i = 0; i < numOfImages; i++) {
        imgs[i].loadPixels();
    }
    
    // load pixels for average image
    avgImg.loadPixels();
    
    // nested for loop to loop through pixels
    for (x = 0; x < img.width; x++) {
        for (y = 0; y < img.height; y++) {
            // convert x and y coordinates to pixel index
            var index = (img.width * y + x) * 4;
            
            var sumR = 0;
            var sumG = 0;
            var sumB = 0;
            
            // calculate sum of all values for that pixel
            for (i = 0; i < numOfImages; i++) {
                sumR += imgs[i].pixels[index + 0];
                sumG += imgs[i].pixels[index + 1];
                sumB += imgs[i].pixels[index + 2];
            }
            
            // calculate average value for that pixel
            var avgR = sumR / numOfImages;
            var avgG = sumG / numOfImages;
            var avgB = sumB / numOfImages;
            
            // get corresponding pixel value of random image
            var currentR = img.pixels[index + 0];
            var currentG = img.pixels[index + 1];
            var currentB = img.pixels[index + 2];
            
            // map mouseX to lerp value
            var lerpValue = map(mouseX, 0, width, 0, 1);
            
            // display average image with lerp value
            avgImg.pixels[index + 0] = lerp(currentR, avgR, lerpValue);
            avgImg.pixels[index + 1] = lerp(currentG, avgG, lerpValue);
            avgImg.pixels[index + 2] = lerp(currentB, avgB, lerpValue);
            avgImg.pixels[index + 3] = 255;
        }
    }
    
    // update pixels for average image
    avgImg.updatePixels();
    
    // display average image on the right
    image(avgImg, img.width, 0);
    
    // add no loop as calculations only need to be done once
    noLoop();
}

function mouseMoved() {
    // run draw() function when mouse is moved
    loop();
}

function keyPressed() {
    // generate new random image when any key is pressed
    while (true) {
        randomImg = random(imgs);
        
        // check that new random image is different from current random image
        if (randomImg != img) {
            image(randomImg, 0, 0);
            img = randomImg;
            return false;
        }
    }
}