let edited_ball

let pixels_to_meter_slider

let seleting_ball = false

function start_screen_setup() {
  t = 0
  top_time = 0
  seleting_ball = false
  balls = []
  balls.push(new Ball(0, 0, 0, 0, 300)) // Main ball that will have its stats shown on the debug menu when all the balls are being shown
  //balls.push(new Ball(7, 0, 8, 120, 500))
  //balls.push(new Ball(19, 0, 13, 100, 30))
  //balls.push(new Ball(9, 11, 3, 70, 60))
  //balls.push(new Ball(1.5, 9, 10, 0, 10))
  //balls.push(new Ball(19, 11, 4, 110, 60))
  //balls.push(new Ball(0, 0, 0, 0, 20))
  //balls.push(new Ball(0, 0, 0, 0, 20))
  //balls.push(new Ball(0, 0, 0, 0, 20))
  
  // Initial update
  update_balls()
  
  pixels_to_meter_slider = createSlider(1, 300, pixels_to_meter, 1)
  pixels_to_meter_slider.position(640, 720)
  pixels_to_meter_slider.style('width', '200px')
}

function start_screen_draw() {
  // Background
  imageMode(CENTER)
  image(SHOT_CORRIDA, 480, height/2, SHOT_CORRIDA.width*2.8, SHOT_CORRIDA.height*2.8)
  
  if (!hide_axis) {
    draw_axis()
  }
  update_balls()
  draw_balls()
  
  if (seleting_ball && mouseButton == LEFT) {
    // Update angle
    let x_vector = createVector(1, 0)
    let mouse_vector = createVector(mouseX-balls[0].x_i-plane_x_offset, mouseY-balls[0].y_i-height+plane_x_offset)
    balls[0].start_angle = int(-x_vector.angleBetween(mouse_vector))
    balls[0].angle = int(-x_vector.angleBetween(mouse_vector))

    // Update speed
    let distance = sqrt(mouse_vector.x*mouse_vector.x + mouse_vector.y*mouse_vector.y)
    balls[0].v_i = (distance / 30).toFixed(2)
    balls[0].vx_i = balls[0].v_i*cos(balls[0].start_angle)
    balls[0].vy_i = balls[0].v_i*sin(balls[0].start_angle)
  }
  
  if (balls[0].start_angle > 0 && balls[0].start_angle <= 180) {
    let reach = (pow(balls[0].v_i, 2)*sin(2*balls[0].start_angle)/g)
    let flight_time = 2*balls[0].vy_i/g
     
    // Reach point
    stroke(0, 255, 0); strokeWeight(15)
    point(pixels_to_meter*reach + plane_x_offset, height - plane_y_offset)
    
    // Max height point
    point(pixels_to_meter*reach/2 + plane_x_offset, height - plane_y_offset - pixels_to_meter*balls[0].max_y)
    
    // Angle arc
    noFill(); strokeWeight(5)
    arc(plane_x_offset,height - plane_y_offset, 100, 100, 360-balls[0].start_angle, 0)

    // Line from the ball to the mouse
    //line(balls[0].x_i + plane_x_offset, balls[0].y_i + height - plane_y_offset, balls[0].x_i + plane_x_offset + 30*balls[0].v_i*cos(balls[0].start_angle), balls[0].y_i + height - plane_y_offset - 30*balls[0].v_i*sin(balls[0].start_angle))
    
    // Trajectory curve
    stroke(0, 255, 0)
    push()
      translate(0 + plane_x_offset, height - plane_y_offset) 
      beginShape()
        for (let i = 0; i<=25;i++) {
          let x = balls[0].x_i + balls[0].vx_i*i*flight_time/25
          let y = (balls[0].y_i + balls[0].vy_i*i*flight_time/25 - (g/2)*pow(i*flight_time/25, 2)) * -1
          vertex(x*pixels_to_meter, y*pixels_to_meter)
        }
      endShape()
    pop()
  }
  
  // Velocity and angle box
  fill(255, 216, 107); stroke(38, 23, 13); strokeWeight(4)
  rect(610, 550, 360, 220, 20)
  
  let text_to_write = ""
  text_to_write += "Velocidade: " + balls[0].v_i + " m/s" + "\n"
  text_to_write += "Ângulo: " + balls[0].start_angle + " graus" + "\n"
  text_to_write += "Pixeis por metro: " + "\n"
  fill(0); noStroke()
  text(text_to_write, 625, 605)
  
  text(pixels_to_meter_slider.value(), 850, 740)
  pixels_to_meter = pixels_to_meter_slider.value()
  
  
  // Title text
  textAlign(CENTER); textSize(100); fill(240, 144, 144); stroke(255, 0, 0); strokeWeight(10)
  text("Lançamento oblíquo", width/2, 100)
  textSize(50); fill(255); stroke(0); strokeWeight(5)
  text("Clica no espaço para começar", width/2, 180)
  
  
  
  if (keyIsDown(32)) { // Space
    change_menu(2)
    pixels_to_meter_slider.hide()
  }
}
