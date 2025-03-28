class Door {
  constructor(x, y, size) {
    this.x = x
    this.y = y
    this.size = size // Size of the key
    this.can_be_opened = false
    this.opened = false
    this.visible_faces = [false, false, false, false] // Up, down, left, right
    
    this.visible_faces[0] = walls[this.y-1][this.x] == 0 // Up
    this.visible_faces[1] = walls[this.y+1][this.x] == 0 // Down
    this.visible_faces[2] = walls[this.y][this.x-1] == 0 // Left
    this.visible_faces[3] = walls[this.y][this.x+1] == 0 // Right
    
    this.player_ray = new RayCast(0, 0, 0, 0, 1)
    
    this.in_camera_bounds = false
    this.seen = false
    
    this.camera_x = 0
    
  }
  
  draw() {
    noFill()
    if (this.opened) {
      stroke(0, 255, 0)
    } else {
      stroke(255, 0, 0)
    }
    
    square(this.x*wall_size*scale_2d, this.y*wall_size*scale_2d, wall_size*scale_2d)
  }
  
  update() {
    this.can_be_opened = dist(player_position.x, player_position.y, this.x*wall_size+(wall_size/2), this.y*wall_size+(wall_size/2)) <= wall_size
    
    // Tries to open the door if the conditions are met
    switch (this.size) {
      case 1:
        if (key_small && this.can_be_opened && !this.opened) {
          this.opened = true
          OPEN_DOOR_SOUND.play()
          walls[this.y][this.x] = 0
          key_small = false
        }
        break
      case 2:
        if (key_normal && this.can_be_opened && !this.opened) {
          this.opened = true
          OPEN_DOOR_SOUND.play()
          walls[this.y][this.x] = 0
          key_normal = false
        }
        break
      case 3:
        if (key_big && this.can_be_opened && !this.opened) {
          this.opened = true
          OPEN_DOOR_SOUND.play()
          walls[this.y][this.x] = 0
          key_big = false
        }
        break
      case 4:
        if (key_giant && this.can_be_opened && !this.opened) {
          this.opened = true
          OPEN_DOOR_SOUND.play()
          walls[this.y][this.x] = 0
          key_giant = false
        }
        break
    }
    
    // Checks if door is visible by the player
    this.player_ray.collision_point = null
    let distance = dist(this.x*wall_size+(wall_size/2), this.y*wall_size+(wall_size/2), player_position.x, player_position.y)
    
    // Calculate the angle between the player and the door
    let vec1 = createVector((this.x*wall_size+(wall_size/2)) - player_position.x, (this.y*wall_size+(wall_size/2)) - player_position.y)
    vec1.normalize()
    let vec2 = createVector(1, 0)
    let norms = sqrt(vec1.x*vec1.x + vec1.y*vec1.y) * sqrt(vec2.x*vec2.x + vec2.y*vec2.y)
    let prod = p5.Vector.dot(vec1, vec2)
    
    let angle = acos(prod/norms)
    if ((this.y*wall_size+(wall_size/2)) < player_position.y) {
      angle = 360-angle
    }
    
    let angle_diff = (camera_angle - angle + 180 + 360) % 360 - 180
    
    // Number from 0 to 1 that represents the x position of the door in 3D space
    this.camera_x = 0.5 - (map(angle_diff, 0, (FOV/2), 0, 1, false)) / 2
    
    let inside_view = (angle_diff <= (FOV/2) && angle_diff >= -(FOV/2))
    
    this.in_camera_bounds = inside_view && distance < wall_size * ray_size
    
    if (this.in_camera_bounds) {
      // Shoot a ray from the player to this door if the ray doesn't hit a wall, the door can be seen
      this.player_ray = new RayCast(player_position.x, player_position.y, distance/wall_size, angle, 1)
      this.player_ray.ignore_doors = true
      this.player_ray.cast()
    }
    
    this.seen = (this.player_ray.collision_point == null) && this.in_camera_bounds && distance < wall_size*1.5
  }
}
