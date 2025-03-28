/*
NOT USED IN THE FINAL GAME
*/

obstacle_types = []

function obstacle_types_setup() {
  obstacle_types = [
    {
      sprite: ENEMY_AMONGUS_1,
      w: 10,
      h: 10,
    },
  ]
}

class Obstacle {
  constructor(x, y, type) {
    this.x = x
    this.y = y
    this.type = type
    this.w = obstacle_types[this.type].w
    this.h = obstacle_types[this.type].h
    
    this.player_ray = new RayCast(0, 0, 0, 0, 1)
    
    this.in_camera_bounds = false
    this.seen = false
    
    this.camera_x = 0
  }
  
  draw_2d() {
    fill(100, 200, 100)
    rect(this.x, this.y, this.w, this.h)
  }
  
  update() {
    
    // Checks if obstacle is visible by the player
    this.player_ray.collision_point = null
    let distance = dist(this.x, this.y, player_position.x, player_position.y)
    
    // Calculate the angle between the player and the obstacle
    let vec1 = createVector(this.x - player_position.x, this.y - player_position.y)
    vec1.normalize()
    let vec2 = createVector(1, 0)
    let norms = sqrt(vec1.x*vec1.x + vec1.y*vec1.y) * sqrt(vec2.x*vec2.x + vec2.y*vec2.y)
    let prod = p5.Vector.dot(vec1, vec2)

    let angle = acos(prod/norms)
    if (this.y < player_position.y) {
      angle = 360-angle
    }
    
    let angle_diff = (camera_angle - angle + 180 + 360) % 360 - 180
    
    // Number from 0 to 1 that represents the x position of the obstacle in 3D space
    this.camera_x = 0.5 - (map(angle_diff, 0, (FOV/2), 0, 1, false)) / 2
    
    let inside_view = (angle_diff <= (FOV/2) && angle_diff >= -(FOV/2))
    
    this.in_camera_bounds = inside_view && distance < wall_size * ray_size
    
    if (this.in_camera_bounds) {
      // Shoot a ray from the player to this obstacle if the ray doesn't hit a wall, the obstacle can be seen
      this.player_ray = new RayCast(player_position.x, player_position.y, distance/wall_size, angle, 1)
      this.player_ray.cast()
      
    }
    
    this.seen = this.player_ray.collision_point == null && this.in_camera_bounds
  }
}
