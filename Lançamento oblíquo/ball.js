class Ball {
  constructor(x_i = 0, y_i = 0, v_i = 0, angle = 0, size = 50) {
    this.position = createVector(0,0)
    this.x_i = x_i
    this.y_i = y_i
    this.reach = 0
    this.max_y = (pow(this.vy_i, 2)/(2*g))
    this.flight_time = 0
    
    this.vx = 0
    this.vy = 0
    this.v_i = v_i
    this.vx_i = v_i*cos(angle)
    this.vy_i = v_i*sin(angle)
    
    this.start_angle = angle // Angle between ball and start velocity
    this.angle = angle // Angle between ball and current velocity
    
    this.size = size
    this.frames_to_point = frames_for_next_point // Frames needed to get another point drawn
    this.points = [] // Stores the coordinates for points in the trajetory
    this.on_ground = false
    
    
  }
  
  // Draws the ball and its trail of points
  draw() {
    push()
      // Translate to account for the inverted y axis and the ball's drawing center
      translate(0 + plane_x_offset, height - plane_y_offset) 
    
      // Draw the trail
      if (visible_trajectories) {
        stroke(0, 255, 0)
        strokeWeight(5)
        noFill()
        if (trails_on) {
          beginShape()
          for (let pt of this.points) {
            vertex(pt.x*pixels_to_meter,pt.y*pixels_to_meter)
          }
          endShape()

        } else {
          for (let pt of this.points) {
            point(pt.x*pixels_to_meter,pt.y*pixels_to_meter)
          }
        }
        noStroke()
      }
      
      /*
      strokeWeight(2)
      stroke(0)
      fill(220, 0, 0)
      circle(this.position.x*pixels_to_meter, this.position.y*pixels_to_meter, this.size)

      noStroke()
      fill(220, 100, 100)
      circle((this.position.x * pixels_to_meter + this.size/8), (this.position.y * pixels_to_meter- this.size/8) , this.size/1.5)

      fill(220, 180, 180)
      circle((this.position.x * pixels_to_meter + this.size/5), (this.position.y  * pixels_to_meter- this.size/5), this.size/3)
      */
    pop()
    
    // Draw the ball
    push()
      imageMode(CENTER)
      translate(this.position.x*pixels_to_meter + 0 + plane_x_offset, this.position.y*pixels_to_meter + height - plane_y_offset)
      
      if (this.vx < 0) {
        scale(-1, 1)
        rotate(180 - this.angle)
      } else {
        rotate(this.angle)
      }
      
      image(MCQUEEN, 0, 0, this.size, this.size*MCQUEEN.height/MCQUEEN.width)
    pop()
  }
  
  update(t, g) {
    this.max_y = (pow(this.vy_i, 2)/(2*g))
    
    // Floor collision
    if (this.position.y > 0 && !this.on_ground) {
      this.on_ground = true
      if (this.flight_time == 0) {
        this.flight_time = t
        this.reach = this.position.x
      }
      this.position.y = 0
    }
    if (!this.on_ground) {
      this.position.x = this.x_i + this.vx_i*t
      this.position.y = (this.y_i + this.vy_i*t - (g/2)*(t*t)) * -1
      this.vx = this.vx_i
      this.vy = (this.vy_i - (g*t)) * -1
    } else {
      // Checks if the ball can leave the ground
      if ((this.y_i + this.vy_i*t - (g/2)*(t*t)) * -1 < 0) {
        this.on_ground = false
        this.position.x = this.x_i + this.vx_i*t
        this.position.y = (this.y_i + this.vy_i*t - (g/2)*(t*t)) * -1
        this.vx = this.vx_i
        this.vy = (this.vy_i - (g*t)) * -1
      }
    }
    
    // Update angle
    if (!this.on_ground) {
      let x_vector = createVector(1, 0)
      let v_angle = createVector(this.vx, this.vy)
      this.angle = x_vector.angleBetween(v_angle)
    } else {
      if (this.vx < 0) {
        this.angle = lerp(this.angle, 180, 0.1)
        if (abs(180-this.angle) < 0.05) {
          this.angle = 180
        }
      } else {
        this.angle = lerp(this.angle, 0, 0.1)
        if (abs(this.angle) < 0.05) {
          this.angle = 0
        }
      }
    }
    
    
    // Trail updating
    if (this.frames_to_point == 0) {
      let point_on_position = true
      
      // Create a point if point array is empty
      if (this.points.length == 0) {
        this.points.push(createVector(this.position.x, this.position.y))
      }
      
      // Only try to add another point to the array if ball is in the screen's bounds
      if (this.position.x >= 0 && this.position.x <= width && this.position.y * -1 >= 0 && this.position.y * -1 <= height && t >= top_time) {
        
        for (let i = 0; i < this.points.length; i++) {
          // If there's a point with the same coords as the current position, don't add a point
          if (this.position.equals(this.points[i])) {
            point_on_position = true
            break
          } else {
            point_on_position = false
          }
        }
        // Adds a point if the position doesn't contain a point
        if (!point_on_position) {
          this.points.push(createVector(this.position.x, this.position.y))
        }
      }
      
      // Restarts the frame point counter
      this.frames_to_point = frames_for_next_point
        this.frames_to_point -= 1
    // Wait another frame
    } else {
      this.frames_to_point -= 1
    }
  }
}
