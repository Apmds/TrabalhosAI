let type_enemies

function type_enemies_setup() {
  type_enemies = [
    {
      name: "Invasor vermelho",
      sprite: ENEMY_AMONGUS_3,
      back_sprite: ENEMY_AMONGUS_3,
      y_offset: 3000,
      max_hp: 10,
      damage: 1,
      attack_time: 1,
      velocity: 0.5,
      size: 10,
      scale: 0.8,
      shadow_offset: 2.8,
      color: [200, 30, 30],
      death_sound: ENEMY_AMONGUS_DEATH,
    },
    {
      name: "Rinogoleão",
      sprite: ENEMY_1,
      back_sprite: ENEMY_1_BACK,
      y_offset: 0,
      max_hp: 20,
      damage: 4,
      attack_time: 1,
      velocity: 1.5,
      size: 10,
      scale: 1,
      shadow_offset: 0.16,
      color: [200, 30, 30],
      death_sound: ENEMY_1_DEATH,
    },
    {
      name: "Surivonte",
      sprite: ENEMY_2,
      back_sprite: ENEMY_2_BACK,
      y_offset: 0,
      max_hp: 30,
      damage: 10,
      attack_time: 2,
      velocity: 1,
      size: 10,
      scale: 1,
      shadow_offset: 0.7,
      color: [200, 30, 30],
      death_sound: ENEMY_2_DEATH,
    },
    {
      name: "Cavaguiante",
      sprite: ENEMY_3,
      back_sprite: ENEMY_3_BACK,
      y_offset: 0,
      max_hp: 20,
      damage: 2,
      attack_time: 0.5,
      velocity: 3,
      size: 10,
      scale: 1.5,
      shadow_offset: 0.4,
      color: [200, 30, 30],
      death_sound: ENEMY_3_DEATH,
    },
    {
      name: "Invasor verde",
      sprite: ENEMY_AMONGUS_1,
      back_sprite: ENEMY_AMONGUS_1,
      y_offset: 3000,
      max_hp: 10,
      damage: 1,
      attack_time: 1,
      velocity: 0.5,
      size: 10,
      scale: 0.8,
      shadow_offset: 2.8,
      color: [200, 30, 30],
      death_sound: ENEMY_AMONGUS_DEATH,
    },
    {
      name: "Invasor azul",
      sprite: ENEMY_AMONGUS_2,
      back_sprite: ENEMY_AMONGUS_2,
      y_offset: 3000,
      max_hp: 10,
      damage: 1,
      attack_time: 1,
      velocity: 0.5,
      size: 10,
      scale: 0.8,
      shadow_offset: 2.8,
      color: [200, 30, 30],
      death_sound: ENEMY_AMONGUS_DEATH,
    },
  ]
}

class Enemy {
  constructor(x, y, angle, type) {
    this.x = x
    this.y = y
    this.y_offset = type_enemies[type].y_offset
    this.angle = angle
    this.type = type
    
    this.velocity = createVector(0, 0)
    this.velocity.x = cos(angle) * type_enemies[this.type].velocity
    this.velocity.y = sin(angle) * type_enemies[this.type].velocity
    
    this.camera_x = 0
    
    this.size = type_enemies[this.type].size
    this.scale = type_enemies[this.type].scale
    this.seen = false
    this.in_camera_bounds = false // The same as this.seen, but it doesn't consider walls
    
    let clr = type_enemies[this.type].color
    this.color_2d = color(clr[0], clr[1], clr[2])
    
    this.player_ray = new RayCast(0, 0, 0, 0, 1)
    this.distance_to_player = 1000000
    
    this.moving = false
    this.aware_of_player = false
    this.in_attack_range = false
    this.attack_timer = new Timer(type_enemies[this.type].attack_time)
    this.movement_timer = new Timer(random(2, 5))
    this.angle_direction = 1 // Direction the angle turns
    
    this.max_hp = type_enemies[this.type].max_hp
    this.hp = this.max_hp
    
    this.damage = type_enemies[this.type].damage
  }
  
  draw_2d() {
    noStroke(); fill(this.color_2d)
    
    circle(this.x, this.y, this.size*this.scale)
    
    if (debug_mode) {
      noFill(); stroke(255, 0, 0); strokeWeight(3)
      circle(this.x, this.y, 300)
      circle(this.x, this.y, 30)
      strokeWeight(5)
      line(this.x, this.y, this.x + cos(this.angle) * 20, this.y + sin(this.angle)*20)
    }
  }
  
  colliding_with_wall(x1, y1, x2, y2) {
    return x1+(this.size*this.scale) > x2 && y1+(this.size*this.scale) > y2 && x2+wall_size > x1 && y2+wall_size > y1
  }
  
  colliding_with_player(x1, y1) {
    return x1+(this.size*this.scale) > player_position.x && y1+(this.size*this.scale) > player_position.y && player_position.x-(player_size/2) > x1 && player_position.y-(player_size/2) > y1
  }
  
  reset_movement() {
    this.moving = !this.moving
    this.angle_direction = random([-1, 1])
  }
  
  update() {
    
    // Checks if enemy is visible by the player
    this.player_ray.collision_point = null
    this.distance_to_player = dist(this.x, this.y, player_position.x, player_position.y)
    
    // Calculate the angle between the player and the enemy
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
    
    // Number from 0 to 1 that represents the x position of the enemy in 3D space
    this.camera_x = 0.5 - (map(angle_diff, 0, (FOV/2), 0, 1, false)) / 2
    
    let inside_view = (angle_diff <= (FOV/2) && angle_diff >= -(FOV/2))
    
    this.in_camera_bounds = inside_view && this.distance_to_player < wall_size * ray_size
    
    // Shoot a ray from the player to this enemy if the ray doesn't hit a wall, the enemy can be seen
    this.player_ray = new RayCast(player_position.x, player_position.y, this.distance_to_player/wall_size, angle, 1)
    this.player_ray.cast()
    
    this.seen = this.player_ray.collision_point == null && this.in_camera_bounds
    
    this.attack_timer.update(false)
    this.aware_of_player = this.player_ray.collision_point == null && this.distance_to_player < 150
    this.in_attack_range = this.player_ray.collision_point == null && this.distance_to_player < 15
    
    // Movement
    if (this.aware_of_player) {
      this.angle = 180+angle
      this.velocity.x = cos(this.angle)*type_enemies[this.type].velocity
      this.velocity.y = sin(this.angle)*type_enemies[this.type].velocity
      if (this.distance_to_player < (player_size/2) + (this.size/2)) {
        this.velocity.x = 0
        this.velocity.y = 0
      }
    } else {
      this.velocity.x = 0
      this.velocity.y = 0
    }
    
    // Collision with walls
    for (let y = 0; y < walls.length; y++) {
      for (let x = 0; x < walls[y].length; x++) {
        if (walls[y][x] == 0) {
          continue
        }
        
        if (this.colliding_with_wall(this.x + this.velocity.x - (this.size/2), this.y - (this.size/2), x*wall_size, y*wall_size)) {
          this.velocity.x = 0
        }
        if (this.colliding_with_wall(this.x - (this.size/2), this.y + this.velocity.y - (this.size/2), x*wall_size, y*wall_size)) {
          this.velocity.y = 0
        }
      }
    }
    
    // Updates the position
    if (!won_level) {
      this.x += this.velocity.x
      this.y += this.velocity.y
    }
    
    // Attack
    if (this.in_attack_range && this.attack_timer.current_time <= 0 && hp != 0 && !won_level) {
      take_damage(this.damage)      
      this.attack_timer.restart()
    }
  }
}
