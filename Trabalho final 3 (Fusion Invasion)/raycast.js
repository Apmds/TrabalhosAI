class RayCast {
  constructor(x, y, size, rel_angle, type) {
    this.x = x
    this.y = y
    this.full_size = size
    this.size = 0
    
    // Angle of the ray and angle offset
    this.rel_angle = rel_angle
    this.angle = 0
    
    // Size of the ray in the x and y axis
    this.sx = wall_size*this.size*cos(this.angle + this.rel_angle)
    this.sy = wall_size*this.size*sin(this.angle + this.rel_angle)
    
    this.type = type // 1 for wall, 2 for enemy
    
    this.collision_point = null
    this.collision_color = null
    
    this.collision_enemy_index = -1
    
    this.ignore_doors = false
  }
  
  draw(ray_color) {
    stroke(ray_color); strokeWeight(1)
    
    // Draws the ray
    if (this.collision_point == null) {
      line(this.x, this.y, this.x + this.sx, this.y + this.sy)
    } else {
      line(this.x, this.y, this.collision_point.x, this.collision_point.y)
    }
    
    // Draws the point that the ray collides with
    if (debug_mode && this.collision_point != null) {
      stroke(255, 0, 0)
      strokeWeight(5)
      point(this.collision_point.x, this.collision_point.y)
    }
  }
  
  // Updates the ray size
  update() {
    if (this.size > this.full_size) {
      this.size = this.full_size
    }
    this.sx = wall_size*this.size*cos(this.angle + this.rel_angle)
    this.sy = wall_size*this.size*sin(this.angle + this.rel_angle)
  }
  
  cast() {
    this.size = 0
    this.collision_point = null
    while (this.collision_point == null && this.size < this.full_size) {
      
      /*
      // Coordinates of the wall the "tip" of the ray is in
      let current_wall = createVector(int((this.x/wall_size) + (this.sx/wall_size)), int((this.y/wall_size) + (this.sy/wall_size)))
      
      if (current_wall.x >= walls[0].length) {
        current_wall.x = walls[0].length-1
      }

      if (current_wall.y >= walls.length) {
        current_wall.y = walls.length-1
      }
      
      let up = constrain(current_wall.y-1, 0, walls.length-1)
      let down = constrain(current_wall.y+1, 0, walls.length-1)
      let left = constrain(current_wall.x-1, 0, walls[0].length-1)
      let right = constrain(current_wall.x+1, 0, walls[0].length-1)
      
      let col1 = walls[up][left] > 0 || walls[current_wall.y][left] > 0 || walls[down][left] > 0
      let col2 = walls[up][current_wall.x] > 0 || walls[current_wall.y][current_wall.x] > 0 || walls[down][current_wall.x] > 0
      let col3 = walls[up][right] > 0 || walls[current_wall.y][right] > 0 || walls[down][right] > 0

      if (col1 || col2 || col3) {
        this.size += 0.1
      } else {
        this.size++
      }
      */
      this.size+=0.1
      this.update()
      this.check_collision()
    }
  }
  
  check_collision() {
    // Coordinates of the wall the "tip" of the ray is in
    let current_wall = createVector(int((this.x/wall_size) + (this.sx/wall_size)), int((this.y/wall_size) + (this.sy/wall_size)))
    
    if (current_wall.x >= walls[0].length) {
      current_wall.x = walls[0].length-1
    }

    if (current_wall.y >= walls.length) {
      current_wall.y = walls.length-1
    }
    
    // Stops the collision check if ray hits door
    if (this.ignore_doors) {
      for (let door of doors) {
        if (current_wall.x == door.x && current_wall.y == door.y) {
          return
        }
      }
    }
    
    // Wall collision
    if (this.type == 1) {
      
      // Checks if there is a collision with a wall
      if (walls[current_wall.y][current_wall.x] > 0) {

        // Contains the collisions of current_wall, and some adjacent walls to it
        let collisions = []

        // Angle of the ray transformed into a value from 0 to 360
        let ang = (abs(360 + this.angle + this.rel_angle)%360)

        // Determines which walls should be checked, based on the ray's angle
        if (ang > 0 && ang < 90) { // Down left

          if (walls[current_wall.y-1][current_wall.x] > 0) { // Up
            collisions.push(line_rect_collision(this.x, this.y, this.x+this.sx, this.y+this.sy, current_wall.x*wall_size, (current_wall.y-1)*wall_size, wall_size, wall_size)[1]) // Up
          }
          if (walls[current_wall.y][current_wall.x-1] > 0) { // Left
            collisions.push(line_rect_collision(this.x, this.y, this.x+this.sx, this.y+this.sy, (current_wall.x-1)*wall_size, current_wall.y*wall_size, wall_size, wall_size)[1]) // Left
          }

        }
        if (ang > 90 && ang < 180) { // Down right

          if (walls[current_wall.y-1][current_wall.x] > 0) { // Up
            collisions.push(line_rect_collision(this.x, this.y, this.x+this.sx, this.y+this.sy, current_wall.x*wall_size, (current_wall.y-1)*wall_size, wall_size, wall_size)[1]) // Up
          }
          if (walls[current_wall.y][current_wall.x+1] > 0) { // Right
            collisions.push(line_rect_collision(this.x, this.y, this.x+this.sx, this.y+this.sy, (current_wall.x+1)*wall_size, current_wall.y*wall_size, wall_size, wall_size)[1]) // Right
          }

        }
        if (ang > 180 && ang < 270) { // Up left

          if (walls[current_wall.y+1][current_wall.x] > 0) { // Down
            collisions.push(line_rect_collision(this.x, this.y, this.x+this.sx, this.y+this.sy, current_wall.x*wall_size, (current_wall.y+1)*wall_size, wall_size, wall_size)[1]) // Down
          }
          if (walls[current_wall.y][current_wall.x+1] > 0) { // Right
            collisions.push(line_rect_collision(this.x, this.y, this.x+this.sx, this.y+this.sy, (current_wall.x+1)*wall_size, current_wall.y*wall_size, wall_size, wall_size)[1]) // Right
          }

        }
        if (ang > 270 && ang < 360) { // Up Right

          if (walls[current_wall.y+1][current_wall.x] > 0) { // Down
            collisions.push(line_rect_collision(this.x, this.y, this.x+this.sx, this.y+this.sy, current_wall.x*wall_size, (current_wall.y+1)*wall_size, wall_size, wall_size)[1]) // Down
          }
          if (walls[current_wall.y][current_wall.x-1] > 0) { // Left
            collisions.push(line_rect_collision(this.x, this.y, this.x+this.sx, this.y+this.sy, (current_wall.x-1)*wall_size, current_wall.y*wall_size, wall_size, wall_size)[1]) // Left
          }
        }

        // Adds the main wall
        collisions.push(line_rect_collision(this.x, this.y, this.x+this.sx, this.y+this.sy, current_wall.x*wall_size, current_wall.y*wall_size, wall_size, wall_size)[1])

        // Finds the closest point of all the collisions
        let closest_point = createVector(-5000000, -5000000)
        for (let col of collisions) {
          for (let pnt of col) {
            if (dist(this.x, this.y, pnt.x, pnt.y) < dist(this.x, this.y, closest_point.x, closest_point.y)){
              closest_point = pnt
            }
          }
        }

        // Sets the collision point of the ray and its color
        this.collision_point = createVector(closest_point.x, closest_point.y)

        let wall_color = wall_colors[walls[current_wall.y][current_wall.x]]
        this.collision_color = color(wall_color[0], wall_color[1], wall_color[2])
      }
    }
    
    // Enemy collision
    if (this.type == 2) {
      
      // Checks if there is a collision with one of the visible enemies
      for (let i = 0; i < enemies.length; i++) {
        if (!enemies[i].seen) {
          continue
        }
        
        let collision = point_rect_collision(this.x+this.sx, this.y+this.sy, enemies[i].x-(enemies[i].size/2), enemies[i].y-(enemies[i].size/2), enemies[i].size, enemies[i].size)
        
        if (collision) {
          this.collision_point = createVector(this.x+this.sx, this.y+this.sy)
          this.collision_enemy_index = i
          break
        }
      }
    }
    
    
    /*
    let dir_x = cos(this.angle + this.rel_angle)
    let dir_y = sin(this.angle + this.rel_angle)
    
    let start_dist_x
    let start_dist_y
    
    let dist_x = sqrt(1 + (dir_y * dir_y) / (dir_x * dir_x))
    let dist_y = sqrt(1 + (dir_x * dir_x) / (dir_y * dir_y))
    
    let step_x
    let step_y
    
    let map_x = int(this.x/50)
    let map_y = int(this.y/50)
    
    if (dir_x < 0) {
      step_x = -1;
      start_dist_x = ((this.x/50) - map_x) * dist_x;
    } else {
      step_x = 1;
      start_dist_x = (map_x + 1 - (this.x/50)) * dist_x;
    }
    
    if (dir_y < 0) {
      step_y = -1;
      start_dist_y = ((this.y/50) - map_y) * dist_y;
    } else {
      step_y = 1;
      start_dist_y = (map_y + 1 - (this.y/50)) * dist_y;
    }
    
    let hit_wall = false
    while (!hit_wall) {
      
      if (start_dist_x < start_dist_y) {
        start_dist_x += dist_x
        map_x += step_x
      } else {
        start_dist_y += dist_y
        map_y += step_y
      }
      
      if (walls[map_y][map_x] > 0) {
        //print(start_dist_x)
        //print(start_dist_y)
        this.size = dist(this.x/wall_size, this.y/wall_size, start_dist_x+(this.x/wall_size), start_dist_y+(this.y/wall_size))
        this.update()
        //print(this.size)
        //this.sx = dist(this.x, this.y, start_dist_x, this.y)
        //this.sy = dist(this.x, this.y, this.x, start_dist_y)
        //this.collision_color = color(0)
        
        
        
        hit_wall = true
      }
    }
    */
  }
}

// Returns true if a line is colliding with a rect and an array containing the points where they collide
function line_rect_collision(x1, y1, x2, y2, rectx, recty, rectw, recth) {
  let up = line_line_collision(x1, y1, x2, y2, rectx, recty, rectx+rectw, recty)
  let left = line_line_collision(x1, y1, x2, y2, rectx, recty, rectx, recty+recth)
  let down = line_line_collision(x1, y1, x2, y2, rectx, recty+recth, rectx+rectw, recty+recth)
  let right = line_line_collision(x1, y1, x2, y2, rectx+rectw, recty, rectx+rectw, recty+recth)
  
  let intersections = []
  
  if (up[0]) {intersections.push(up[1])}
  if (down[0]) {intersections.push(down[1])}
  if (left[0]) {intersections.push(left[1])}
  if (right[0]) {intersections.push(right[1])}
  
  return [
    (up[0] || down[0] || left[0] || right[0]),
    intersections,
  ]
}

// Returns true if 2 lines are colliding, as well as a vector containing the position where they collide
function line_line_collision(x1, y1, x2, y2, x3, y3, x4, y4) {
  let uA = ((x4-x3)*(y1-y3) - (y4-y3)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1))
  let uB = ((x2-x1)*(y1-y3) - (y2-y1)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1))
  let intersectionX
  let intersectionY
  if ((uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1)) {
    intersectionX = x1 + (uA * (x2-x1))
    intersectionY = y1 + (uA * (y2-y1))
  }
  
  return [
    (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1),
    createVector(intersectionX, intersectionY),
  ]
}

// Returns true if the point is colliding with the rect
function point_rect_collision(x1, y1, x2, y2, w, h) {
  return (x1 > x2 && x1 < x2+w && y1 > y2 && y1 < y2+h)
}
