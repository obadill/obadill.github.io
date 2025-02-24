/*
Octavio Badillo
2/18/2025
This program reads RGB data from an Arduino and visualizes it as bar graphs.
Pressing ENTER sends updated RGB values while SPACEBAR clears the LEDs on
the Arduino.
*/

// Constants
const BAUD_RATE = 9600;

// Global Variables
let port, connectBtn;

// Initializes serial communication and sets up the canvas
function setup() {
  setupSerial();
  createCanvas(windowWidth, windowHeight);
  textFont("system-ui", 50);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
}

// Updates and displays RGB bar based on the Arduino's serial input
function draw() {
  // Ensure the port is open and read incoming data, else exit draw loop
  const portIsOpen = checkPort();
  if (!portIsOpen) return;
  let str = port.readUntil("\n");
  if (str.length == 0) return;

  // Retrieve and convert each value to a number type
  let rgbArray = str.trim().split(",");
  red = Number(rgbArray[0]);
  green = Number(rgbArray[1]);
  blue = Number(rgbArray[2]);

  // Draws the bars for the current state of the inputs
  clear();
  drawBars();
}

// Draws three bars representing the RGB values
function drawBars() {
  // Bar Position Variables
  let barWidth = width / 10;
  let maxHeight = height * 0.6;
  let xOffset = width / 4;
  let yBase = height * 0.8;

  //  Draw each RGB bar with its corresponding parameters
  drawBar(xOffset, yBase, barWidth, maxHeight, red, color(255, 0, 0), "R: " + red);
  drawBar(xOffset * 2, yBase, barWidth, maxHeight, green, color(0, 255, 0), "G: " + green);
  drawBar(xOffset * 3, yBase, barWidth, maxHeight, blue, color(0, 0, 255), "B: " + blue);
}

// Base function for creating a bar
function drawBar(x, yBase, barWidth, maxHeight, RGBvalue, barColor, label) {
  // Map RGB-Value to max bar height
  let barHeight = map(RGBvalue, 0, 255, 0, maxHeight);

  // Constructs a bar with its respective parameters
  fill(barColor);
  rect(x - barWidth / 2, yBase - barHeight, barWidth, barHeight);

  // Display RGB label
  text(label, x, yBase - maxHeight - 40);
  textSize(40);
}

// Detect key press and sends corresponding data to the Arduino
function keyPressed() {
  if (!port.opened()) return; // Exits if serial port is not open

  if (keyCode === ENTER) {
    port.write(`${red},${green},${blue}\n`); // Sends current RGB values
  } else if (keyCode === 32) { // KeyCode 32 represents spacebar
    port.write("clear\n"); // Resets RGB values for LED on Arduino
  }
}

/* Helper Functions */

// Sets up the serial connection and creates a connect button
function setupSerial() {
  port = createSerial();
  let usedPorts = usedSerialPorts();
  if (usedPorts.length > 0) {
    port.open(usedPorts[0], BAUD_RATE);
  }
  connectBtn = createButton("Connect to Arduino").addClass("button");
  connectBtn.position(20,20);
  connectBtn.mouseClicked(onConnectButtonClicked);
}

// Checks if the serial port is open and updates the button text
function checkPort() {
  if (!port.opened()) {
    connectBtn.html("Connect to Arduino");
    return false;
  } else {
    connectBtn.html("Disconnect");
    return true;
  }
}

// Toggles the serial connection when the button is clicked
function onConnectButtonClicked() {
  if (!port.opened()) {
    port.open(BAUD_RATE);
  } else {
    port.close();
    clear();
  }
}