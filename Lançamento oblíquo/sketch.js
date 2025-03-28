/*
R -> Reinicia a simulação
T -> Liga e desliga a trajetória pontilhada das bolas
Y -> Mostra e esconde a trajetória das bolas
*/

let mouse_pressed = false
let mouse_released = false
let debug_mode = false
let menu = 1

// Focuses the program window when it is opened
window.onload = function() {
  this.focus();
}

function preload() {
  FONTE = loadFont("Brazilian Clay.ttf")
  
  MCQUEEN = loadImage("McQueen.png")
  SHOT_CORRIDA = loadImage("Shot Corrida.png")
}

function setup() {
  createCanvas(1000, 1000)
  angleMode(DEGREES)
  textFont(FONTE)
  
  change_menu(1)
}

function draw() {
  switch (menu) {
    case 1:
      start_screen_draw()
      break
    case 2:
      draw_simulation()
      break
  }
  
  mouse_pressed = false  
  mouse_released = false
}

function change_menu(new_menu) {
  menu = new_menu
  switch (menu) {
    case 1:
      start_screen_setup()
      break
    case 2:
      setup_simulation()
      break
  } 
}

function keyPressed() {
  if (keyCode>=48 && keyCode<=57) {
    shown_ball = keyCode-48
  }
  
  switch (keyCode) {
    case 27: // Esc
      if (menu == 2) {
        change_menu(1)
      }
      break
    case 72: // H
      hide_axis = !hide_axis
      break
    case 75: // K
      debug_mode = !debug_mode
      break
    case 77:
      show_menus = !show_menus
      break
    case 82: // R
      if (menu == 2) {
        start_t = millis()/1000
        update_balls()
      }
      break
    case 84: // T
      if (menu == 2) {
        trails_on = !trails_on
      }
      break
    case 89: // Y
      if (menu == 2) {
        visible_trajectories = !visible_trajectories
      }
      break
  }
}

function mousePressed() {
  print("X: " + mouseX + " Y: " + mouseY)
  print("X: " + mouseX/pixels_to_meter + " Y: " + mouseY/pixels_to_meter)
  
  mouse_pressed = true
  
  // The ball can be selected only if the mouse is outside the velocity and angle text box
  seleting_ball = mouse_pressed && !(mouseX > 610 && mouseX < 610+360 && mouseY > 550 && mouseY < 550+220)
}

function mouseReleased() {
  mouse_released = true
  
  seleting_ball = false
}