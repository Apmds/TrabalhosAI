pickable_types = []

function pickable_types_setup() {
  pickable_types = [
    {
      sprite: KEY_SMALL,
      scale: 0.3,
      size: 10,
      angle: 90,
      y_offset: 4000,
      func: function () {key_small = true},
    },
    {
      sprite: KEY_NORMAL,
      scale: 0.3,
      size: 10,
      angle: 90,
      y_offset: 4000,
      func: function () {key_normal = true},
    },
    {
      sprite: KEY_LARGE,
      scale: 0.3,
      size: 10,
      angle: 90,
      y_offset: 4000,
      func: function () {key_big = true},
    },
    {
      sprite: KEY_GIANT,
      scale: 0.3,
      size: 10,
      angle: 90,
      y_offset: 4000,
      func: function () {key_giant = true},
    },
    {
      sprite: UZI_BULLET_BOX,
      scale: 1,
      size: 15,
      angle: 0,
      y_offset: 4000,
      func: function () {chaingun_bullets += 20},
    },
    {
      sprite: SHOTGUN_BULLET_BOX,
      scale: 1,
      size: 15,
      angle: 0,
      y_offset: 4000,
      func: function () {shotgun_bullets += 5},
    },
    {
      sprite: BANDAGE,
      scale: 1,
      size: 15,
      angle: 0,
      y_offset: 4000,
      func: function () {hp+=10;if(hp>max_hp) {hp=max_hp}},
    },
  ]
}

class Pickable {
  constructor(x, y, type) {
    this.x = x
    this.y = y
    this.y_offset = pickable_types[type].y_offset
    this.size = pickable_types[type].size
    this.scale = pickable_types[type].scale
    this.angle = pickable_types[type].angle
    
    this.type = type
    
    this.player_ray = new RayCast(0, 0, 0, 0, 1)
    
    this.in_camera_bounds = false
    this.seen = false
    
    this.camera_x = 0
  }
  
  draw_2d() {
    fill(200, 100, 40); noStroke()
    circle(this.x, this.y, this.size)
  }
  
  update() {
    // Checks if pickable is visible by the player
    this.player_ray.collision_point = null
    let distance = dist(this.x, this.y, player_position.x, player_position.y)
    
    // Calculate the angle between the player and the pickable
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
    
    // Number from 0 to 1 that represents the x position of the pickable in 3D space
    this.camera_x = 0.5 - (map(angle_diff, 0, (FOV/2), 0, 1, false)) / 2
    
    let inside_view = (angle_diff <= (FOV/2) && angle_diff >= -(FOV/2))
    
    this.in_camera_bounds = inside_view && distance < wall_size * ray_size
    
    if (this.in_camera_bounds) {
      // Shoot a ray from the player to this pickable if the ray doesn't hit a wall, the pickable can be seen
      this.player_ray = new RayCast(player_position.x, player_position.y, distance/wall_size, angle, 1)
      this.player_ray.cast()
      
    }
    
    this.seen = this.player_ray.collision_point == null && this.in_camera_bounds
  }
}
