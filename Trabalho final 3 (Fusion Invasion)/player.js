let player_position
let player_velocity
let top_speed = 3
let turning_speed = 3
let player_size = 10
let max_hp = 100
let hp = max_hp
let damage_frames = 0
let taking_damage = false
let death_frames = 0
let winning_frames = 0
let won_level = false

let camera_angle = 0
let rays = []
let ray_size = 11
let number_of_rays = 2 // If this number isn't divisible by the width, the walls will be transparent
let FOV = 60

let current_gun = 1
let next_gun = 1
let gun_timer
let changing_gun = false
let shooting_gun = false
let changing_gun_frames = 0
let gun_shootable = true
let gun_timers = [0, 0.1, 1]
let chaingun_bullets = 100
let shotgun_bullets = 10
let gun_offset
let movement_frames = 0 // Counts the number of frames the player is pressing a key to move
let attack_ray
let fire_sprite = 1

let infinite_hp = false
let infinite_bullets = false

let key_small = false
let key_normal = false
let key_big = false
let key_giant = false

// Sets the player's atributes to their starting values
function pl_setup() {
  current_gun = 1
  change_gun()
  player_velocity = createVector(0, 0)
  gun_shootable = true
  key_small = false
  key_normal = false
  key_big = false
  key_giant = false
  damage_frames = 0
  death_frames = 0
  movement_frames = 0
  taking_damage = false
  shooting_gun = false
  won_level = false
  winning_frames = 0
  chaingun_bullets = 100
  shotgun_bullets = 10
  gun_offset = createVector(0, 0)
  gun_timer = new Timer(gun_timers[current_gun-1], function () {})
  attack_ray = new RayCast(player_position.x, player_position.y, ray_size, camera_angle, 2)
  hp = max_hp
  
  ray_setup()
}

// Makes/remakes the RayCast array
function ray_setup() {
  rays = []
  
  if (number_of_rays == 1) {
    rays.push(new RayCast(player_position.x, player_position.y, ray_size, 0, 1))
  } else {
    for (let i = 0; i < number_of_rays; i++) {
      rays.push(new RayCast(player_position.x, player_position.y, ray_size, -(FOV/2) + (i*(FOV/(number_of_rays-1))), 1))
    }
  }
  
  line_width = 800/number_of_rays
}

// Draws the player and the rays
function pl_draw() {
  fill(150, 0, 0); noStroke()
  circle(player_position.x, player_position.y, player_size)
  
  for (let ray of rays) {
    ray.draw(color(255))
  }
  
  // Draws a line with the direction of the player
  if (debug_mode) {
    stroke(255, 0, 0); strokeWeight(5)
    line(player_position.x, player_position.y, player_position.x + cos(camera_angle) * 20, player_position.y + sin(camera_angle)*20)
  }
}

function pl_update() {
  // Movement inputs
  if (hp != 0 && !won_level) {
    if (keyIsDown(87)) { // W
      player_velocity.x = lerp(player_velocity.x, cos(camera_angle)*top_speed, 0.1)
      player_velocity.y = lerp(player_velocity.y, sin(camera_angle)*top_speed, 0.1)
    }
    else if (keyIsDown(83)) { // S
      player_velocity.x = lerp(player_velocity.x, -cos(camera_angle)*top_speed, 0.1)
      player_velocity.y = lerp(player_velocity.y, -sin(camera_angle)*top_speed, 0.1)
    }
    if (keyIsDown(65)) { // A
      player_velocity.x = lerp(player_velocity.x, cos(camera_angle-90)*top_speed, 0.1)
      player_velocity.y = lerp(player_velocity.y, sin(camera_angle-90)*top_speed, 0.1)
    }
    else if (keyIsDown(68)) { // D
      player_velocity.x = lerp(player_velocity.x, cos(camera_angle+90)*top_speed, 0.1)
      player_velocity.y = lerp(player_velocity.y, sin(camera_angle+90)*top_speed, 0.1)
    }

    if (!keyIsDown(87) && !keyIsDown(83) && !keyIsDown(65) && !keyIsDown(68)){
      player_velocity.x = lerp(player_velocity.x, 0, 0.1)
      player_velocity.y = lerp(player_velocity.y, 0, 0.1)
      if (player_velocity.x<0.01 && player_velocity.x>-0.01) {player_velocity.x = 0}
      if (player_velocity.y<0.01 && player_velocity.y>-0.01) {player_velocity.y = 0}
      movement_frames = 0
    } else {
      movement_frames++
    }
  }
  
  // Turning inputs
  if (hp != 0 && !won_level) {
    if (keyIsDown(37)) { // Seta para a esquerda
      camera_angle -= turning_speed
    }
    else if (keyIsDown(39)) { // Seta para a direita
      camera_angle += turning_speed
    }
  }
  
  // Collision with walls
  for (let y = 0; y < walls.length; y++) {
    for (let x = 0; x < walls[y].length; x++) {
      if (walls[y][x] == 0) {
        continue
      }
      if (colliding_with_wall(player_position.x + player_velocity.x - (player_size/2), player_position.y - (player_size/2), x*wall_size, y*wall_size)) {
        player_velocity.x = 0
      }
      if (colliding_with_wall(player_position.x - (player_size/2), player_position.y + player_velocity.y - (player_size/2), x*wall_size, y*wall_size)) {
        player_velocity.y = 0
      }
    }
  }
  
  // Collision with pickables
  for (let i = 0; i<pickables.length; i++) {
    if (dist(player_position.x, player_position.y, pickables[i].x, pickables[i].y) < (player_size/2)+(pickables[i].size/2)) {
      pickable_types[pickables[i].type].func()
      pickables.splice(i, 1)
      GRAB_ITEM_SOUND.play()
    }
  }
  
  // Updates the position and gun offset
  player_position.x += player_velocity.x
  player_position.y += player_velocity.y
  
  if (movement_frames == 0 || changing_gun) {
    gun_offset.x = lerp(gun_offset.x, 0, 0.2)
    if (changing_gun) {
      gun_offset.y = 180*sin(3*changing_gun_frames)
    } else {
      gun_offset.y = lerp(gun_offset.y, 0, 0.2)
    }
    
  } else {
    gun_offset.x = 50*sin(movement_frames*2)
    gun_offset.y = 30*sin(movement_frames*4)
  }
  
  // Updates the rays position and checks for collision with walls
  for (let ray of rays) {
    ray.x = player_position.x
    ray.y = player_position.y
    ray.angle = camera_angle
    ray.cast()
  }
  
  if (!changing_gun) {
    gun_timer.update(false)
  } else {
    changing_gun_frames++
    if (changing_gun_frames > 30) {
      current_gun = next_gun
    }
    if (changing_gun_frames > 60) {
      changing_gun = false
      changing_gun_frames = 0
    }
  }
  
  if (current_gun == 2) {
    gun_shootable = gun_timer.current_time <= 0 && !changing_gun && chaingun_bullets > 0
  } else if (current_gun == 3) {
    gun_shootable = gun_timer.current_time <= 0 && !changing_gun && shotgun_bullets > 0
  } else {
    gun_shootable = gun_timer.current_time <= 0 && !changing_gun
  }
  
  if (gun_timer.current_time <= 0) {
    gun_timer.current_time = 0
  }
  
  if (shooting_gun) {
    if (current_gun != 2 && fire_sprite > 2) {
      shooting_gun = !keyIsDown(32)
    } else {
      shooting_gun = keyIsDown(32) && chaingun_bullets > 0
    }
  }
  
  // Shooting the uzi
  if (keyIsDown(32) && current_gun == 2 && gun_shootable && hp != 0 && !won_level) {
    shoot_gun()
  }
    
  if (taking_damage) {
    damage_frames++
    
    if (damage_frames > 5) {
      taking_damage = false
      damage_frames = 0
    }
  }
  
  // If there is an amongus, the level is not won
  won_level = true
  for (let enemy of enemies) {
    won_level = enemy.type != 0 && enemy.type != 4 && enemy.type != 5
    if (!won_level) {break}
  }
  
  if (won_level) {
    winning_frames++
    player_velocity.x = 0
    player_velocity.y = 0
    movement_frames = 0
    if (winning_frames > 150) {
      change_menu(8)
    }
  }
  
  if (hp == 0) {
    death_frames++
    player_velocity.x = 0
    player_velocity.y = 0
    gun_offset.x = 0
    gun_offset.y = 2*death_frames
    if (death_frames > 150) {
      change_menu(7)
    }
  }
  
  // Updates the offset of the walls height
  height_offset = 7*sin(movement_frames*10)
}

// Shoots the gun
function shoot_gun() {
  shooting_gun = true
  fire_sprite++
  if (fire_sprite > 2) {
    fire_sprite = 1
  }
  switch (current_gun) {
    case 1:
      PISTOL_SOUND.play()
      break
    case 2:
      PISTOL_SOUND.play()
      if (!infinite_bullets) {
        chaingun_bullets--
        if (chaingun_bullets < 0) {
          chaingun_bullets = 0
        }
      }
      break
    case 3:
      SHOTGUN_SOUND.play()
      if (!infinite_bullets) {
        shotgun_bullets--
        if (shotgun_bullets < 0) {
          shotgun_bullets = 0
        }
      }
      break
  }
  attack_ray = new RayCast(player_position.x, player_position.y, ray_size, camera_angle, 2)
  attack_ray.cast()
  if (attack_ray.collision_point != null) {
    let enemy = enemies[attack_ray.collision_enemy_index]
    if (enemy.seen) {
      let damage = 1
      if (current_gun == 2) {
        damage = 2
      }
      if (current_gun == 3) { // Calculate the shotgun damage based on the distance from the player to the enemy
        damage = round(10*(1-(dist(player_position.x , player_position.y, enemy.x, enemy.y)/(ray_size*wall_size))))
      }
      enemy.hp -= damage
      if (enemy.hp <= 0) {
        type_enemies[enemy.type].death_sound.play()
        enemies.splice(attack_ray.collision_enemy_index, 1)
      }
    }
  }
  gun_timer.restart()
}

// Changes the gun
function change_gun(new_gun = current_gun, reset_timer = true) {
  if (new_gun != current_gun) {
    gun_timer = new Timer(gun_timers[new_gun-1], function () {})
    gun_timer.current_time = 0
    changing_gun = true
    next_gun = new_gun
    changing_gun_frames = 0
  }
}

// Takes damage
function take_damage(dmg) {
  if (!infinite_hp) {
    DAMAGE_SOUND.play()
    hp -= dmg
    damage_frames = 0
    taking_damage = true
    if (hp <= 0) {
      hp = 0
      death_frames = 0
    }
  }
}

// Returns true if the player (in the coordinates x and y) is colliding with a wall (in the coordinates x2 and y2)
function colliding_with_wall(x1, y1, x2, y2) {
  return x1+player_size > x2 && y1+player_size > y2 && x2+wall_size > x1 && y2+wall_size > y1
}

// Returns true if the player (in the coordinates x and y) is colliding with a pickable
function colliding_with_pickable(x1, y1, pickable) {
  return x1+player_size > pickable.x && y1+player_size > pickable.y && pickable.x+pickable.size > x1 && pickable.y+pickable.size > y1
}
