let top_time = 0 // Maximum time the simulation has reached
let shown_ball = 0 // If zero, all balls will be chosen

// Inputs
let g = 10 // Acceleration
let t = 0 // Current time
let start_pause_t = 0 // Moment the pause menu is clicked
let pause_t = 0 // Time in pause menu
let start_t = 0 // Time when the simulation starts
let frames_for_next_point = 3 // How many frames the balls have to wait to draw another point
let balls = []
let pixels_to_meter = 100 // Number of pixels that count as a meter
let plane_x_offset = 80
let plane_y_offset = 80
let plane_size = 800

let trails_on = true
let show_menus = true
let visible_trajectories = true
let hide_axis = false

function setup_simulation() {
  update_balls()
  start_t = millis()/1000
}

function draw_simulation() {
  //background(117, 195, 240)
  
  // Background
  imageMode(CENTER)
  image(SHOT_CORRIDA, 480, height/2, SHOT_CORRIDA.width*2.8, SHOT_CORRIDA.height*2.8)
  
  if (!hide_axis) {
    draw_axis()
  }
  
  update_time()
  update_balls()
  
  draw_balls()
  
  if (show_menus) {
    // Time menu
    fill(255, 216, 107); stroke(38, 23, 13); strokeWeight(4)
    rect(10, 10, 250, 100, 20)
    fill(0); noStroke()
    textSize(45)
    text("T: " + t.toFixed(3) + " s" + "\n", 35, 75)

    // Stats menu
    fill(255, 216, 107); stroke(38, 23, 13); strokeWeight(3)
    rect(640, 10, 350, 300, 20)

    let text_to_write = ""
    text_to_write += "X: " + balls[0].position.x.toFixed(3) + " m" + "\n"
    text_to_write += "Y: " + balls[0].position.y.toFixed(3) * -1 + " m" + "\n"
    text_to_write += "Vx: " + balls[0].vx.toFixed(3) + " m/s" + "\n"
    text_to_write += "Vy: " + balls[0].vy.toFixed(3) * -1 + " m/s" + "\n"
    text_to_write += "Altura máxima: " + balls[0].max_y.toFixed(3) + " m" + "\n"
    text_to_write += "Tempo de voo: "
    if (balls[0].flight_time != 0) {
      text_to_write += balls[0].flight_time.toFixed(3) + " s" + "\n"
    } else {
      text_to_write += "\n"
    }
    text_to_write += "Alcance: "
    if (balls[0].flight_time != 0) {
      print(balls[0].reach)
      text_to_write += balls[0].reach.toFixed(3) + " m" + "\n"
    } else {
      text_to_write += "\n"
    }

    textSize(30); fill(0); noStroke()
    text(text_to_write, 660, 55)
    
    // Back to menu text
    fill(255); stroke(0); strokeWeight(5); textAlign(CENTER); textSize(40)
    text("Esc para voltar para\no menu principal", 450, 50)
    textAlign(LEFT)
  }
  
  // Debug text
  if (debug_mode) {
    let text_to_write = ""
    
    text_to_write += "FPS: " + Math.round(frameRate()) + "\n"
    text_to_write += "T: " + t.toFixed(3) + "s" + "\n"
    
    if (shown_ball == 0) {
      text_to_write += "Primeira bola:" + "\n"
      text_to_write += " - X: " + balls[0].position.x + "\n"
      text_to_write += " - Y: " + balls[0].position.y * -1 + "\n"
      text_to_write += " - Vx: " + balls[0].vx + "\n"
      text_to_write += " - Vy: " + balls[0].vy * -1 + "\n"
      text_to_write += " - Angulo: " + balls[0].angle + "\n"
      text_to_write += " - Alcance: " + balls[0].reach + "\n"
      text_to_write += " - Altura máxima: " + balls[0].max_y + "\n"
    } else if (shown_ball <= balls.length) {
      text_to_write += "X: " + balls[shown_ball-1].position.x + "\n"
      text_to_write += "Y: " + balls[shown_ball-1].position.y * -1 + "\n"
      text_to_write += "Vx: " + balls[shown_ball-1].vx + "\n"
      text_to_write += "Vy: " + balls[shown_ball-1].vy * -1 + "\n"
      text_to_write += "Angulo: " + balls[shown_ball-1].angle + "\n"
      text_to_write += "Alcance: " + balls[shown_ball-1].reach + "\n"
      text_to_write += "Altura máxima: " + balls[shown_ball-1].max_y + "\n"
    }
    
    textSize(24)
    textAlign(LEFT)
    noStroke()
    fill(255)
    text(text_to_write, 0, 25)
  }
}

// Updates the time
function update_time() {
  t = (millis()/1000) - start_t
  
  if (top_time < t) {
    top_time = t
  }
}

// Updates the balls' position and speed
function update_balls() {
  for (let ball of balls) {
    ball.update(t, g)
  }
}

// Draws the balls
function draw_balls() {
  let i = 0
  for (let ball of balls) {
    if (i+1 == shown_ball || shown_ball == 0) {
      ball.draw()
    }
    i++
  }
}

// Draws the axis
function draw_axis() {
  stroke(0)
  
  // X axis
  strokeWeight(5)
  line(0 + plane_x_offset, height - plane_y_offset, plane_x_offset + plane_size, height - plane_y_offset)
  strokeWeight(6)
  line(plane_x_offset + plane_size, height - plane_y_offset, plane_x_offset + plane_size - 30, height - plane_y_offset + 20)
  line(plane_x_offset + plane_size, height - plane_y_offset, plane_x_offset + plane_size - 30, height - plane_y_offset - 20)

  // Y axis
  strokeWeight(5)
  line(0 + plane_x_offset, height - plane_y_offset, plane_x_offset, height - plane_y_offset - plane_size)
  strokeWeight(6)
  line(plane_x_offset, height - plane_y_offset - plane_size, plane_x_offset - 20, height - plane_y_offset - plane_size + 30)
  line(plane_x_offset, height - plane_y_offset - plane_size, plane_x_offset + 20, height - plane_y_offset - plane_size + 30)

  // Lines that mark every meter
  let i = 0
  strokeWeight(4)
  while (i < plane_size) {
    line(i + plane_x_offset, height - plane_y_offset - 10, i + plane_x_offset, height - plane_y_offset + 10)
    line(plane_x_offset - 10, height - plane_y_offset - i, plane_x_offset + 10, height - plane_y_offset - i)
    i+=pixels_to_meter
  }

  // Labels for the axis
  textAlign(LEFT)
  textSize(35)
  fill(255); stroke(0); strokeWeight(5)
  text("X/m", plane_x_offset + plane_size + 10, height - plane_y_offset + 40)
  text("Y/m", plane_x_offset - 70, height - plane_y_offset - plane_size + 20)
}
