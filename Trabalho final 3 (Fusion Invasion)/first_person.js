let line_width
let wall_size = 30
let height_offset = 0
let quality = 3 // Valor entre 1 e 5
let qualities = [80, 100, 200, 400, 800]
let shadows = true

let sky_color
let ground_color
let walls = []
let enemies = []
let doors = []
let obstacles = []
let pickables = []

let mouse_start_x = 0
let start_camera_angle = 0
let mouse_camera_offset = 0

// Draws the walls in first person
function draw_3d_walls() {
  // Background
  noStroke()
  fill(sky_color)
  rect(0, 0, 800, 300)
  fill(ground_color)
  rect(0, 300, 800, 300)
  
  noStroke()
  let i = 0
  for (let ray of rays) {
    if (ray.collision_point == null) {
      i++
      continue
    } else {
      let distance = dist(ray.x, ray.y, ray.collision_point.x, ray.collision_point.y)
      let z = distance * cos(ray.rel_angle)
      
      //Colors the wall piece according to the distance from the ray to its origin
      if (shadows) {
        fill(lerpColor(ray.collision_color, color(0), distance/(wall_size*ray.full_size)))
      } else {
        fill(ray.collision_color)
      }
      
      rectMode(CENTER)
      rect((i*line_width) + (line_width/2), 300 + height_offset, line_width, 6500/z)
      rectMode(CORNER)
      
      i++
    }
  }
}

// Draws the enemies in first person
function draw_3d_enemies() {
  imageMode(CENTER)
  for (let enemy of enemies) {
    if (!enemy.in_camera_bounds || !enemy.seen) {
      continue
    }
    
    // Checks if enemy is visible by the player
    let player_vector = createVector(cos(camera_angle), sin(camera_angle))
    let enemy_vector = createVector(cos(enemy.angle), sin(enemy.angle))
    let angle = p5.Vector.angleBetween(player_vector, enemy_vector)
    
    let sprite
    if (angle >= 90 || angle <= -90) {
      sprite = type_enemies[enemy.type].sprite
    } else {
      sprite = type_enemies[enemy.type].back_sprite
    }
    
    // Draws the shadow below the enemy
    if (shadows) {
      noStroke(); fill(0, 100)
      ellipse(width*enemy.camera_x, 300 + height_offset + (enemy.y_offset/enemy.distance_to_player) + type_enemies[enemy.type].shadow_offset*wall_size*sprite.height/(enemy.distance_to_player), (enemy.scale*6500)/enemy.distance_to_player, (enemy.scale*1000)/enemy.distance_to_player)
    }
    
    // Draws the enemy based on its hp
    tint(255, 255*(enemy.hp/enemy.max_hp), 255*(enemy.hp/enemy.max_hp))
    image(sprite, width*enemy.camera_x, 300 + height_offset + enemy.y_offset/enemy.distance_to_player, (enemy.scale*6500)/enemy.distance_to_player, (enemy.scale*6500*(sprite.height/sprite.width))/enemy.distance_to_player)
    noTint()
    
    //stroke(255, 0, 0); strokeWeight(5)
    //point(width*enemy.camera_x, 300 + height_offset + enemy.y_offset/enemy.distance_to_player)
    //noStroke()
  }
  imageMode(CORNER)
}

// Draws the HUD in first person
function draw_3d_hud() {
  // Gun
  imageMode(CENTER)
  switch (current_gun) {
    case 1:
      if (shooting_gun) {
        if (fire_sprite == 1) {
          image(FIRE_SPRITE_1, 400+gun_offset.x, 395+gun_offset.y, 0.05*FIRE_SPRITE_1.width, 0.05*FIRE_SPRITE_1.height)
        } else {
          image(FIRE_SPRITE_2, 400+gun_offset.x, 395+gun_offset.y, 0.05*FIRE_SPRITE_2.width, 0.05*FIRE_SPRITE_2.height)
        }
      }
      image(PISTOL_SPRITE, gun_offset.x + width/2 + 5, gun_offset.y + 500, 0.15*PISTOL_SPRITE.width, 0.15*PISTOL_SPRITE.height)
      break
        
    case 2:
      if (shooting_gun) {
        if (fire_sprite == 1) {
          image(FIRE_SPRITE_1, 403+gun_offset.x, 395+gun_offset.y, 0.05*FIRE_SPRITE_1.width, 0.05*FIRE_SPRITE_1.height)
        } else {
          image(FIRE_SPRITE_2, 403+gun_offset.x, 395+gun_offset.y, 0.05*FIRE_SPRITE_2.width, 0.05*FIRE_SPRITE_2.height)
        }
      }
      image(UZI_SPRITE, gun_offset.x + width/2 - 5, gun_offset.y + 480, 0.2*UZI_SPRITE.width, 0.2*UZI_SPRITE.height)
      break
    
    case 3:
      if (shooting_gun) {
        if (fire_sprite == 1) {
          image(FIRE_SPRITE_1, 400+gun_offset.x, 350+gun_offset.y, 0.07*FIRE_SPRITE_1.width, 0.07*FIRE_SPRITE_1.height)
        } else {
          image(FIRE_SPRITE_2, 400+gun_offset.x, 350+gun_offset.y, 0.07*FIRE_SPRITE_2.width, 0.07*FIRE_SPRITE_2.height)
        }
      }
      image(SHOTGUN_SPRITE, gun_offset.x + width/2 - 15, gun_offset.y + 480, 0.1*SHOTGUN_SPRITE.width, 0.1*SHOTGUN_SPRITE.height)
      break
  }
  imageMode(CORNER)
  
  // Crossair
  stroke(255, 0, 0); strokeWeight(2)
  line(width/2, (height/2)-5, width/2, (height/2)+5)
  line((width/2)-5, height/2, (width/2)+5, height/2)
  noStroke()
   
  if (taking_damage) {
    fill(200, 0, 0, 100); noStroke()
    rect(0, 0, width, height)
  }
  
  // Information bar
  fill(100)
  rect(0, 515, 140, 85)
  fill(110)
  rect(140, 515, 140, 85)
  fill(90)
  rect(280, 515, 140, 85)
  fill(120)
  rect(420, 515, 230, 85)
  fill(70)
  rect(650, 515, 150, 85)
  
  textFont(TEXT_FONT); fill(0); textSize(45); textAlign(CENTER)
  if (!infinite_hp) {
    text(hp + "%", 70, 588)
  } else {
    image(INFINITY_SYMBOL, 33, 550, 0.6*INFINITY_SYMBOL.width, 0.6*INFINITY_SYMBOL.height)
  }
  
  switch (current_gun) {
    case 1:
      image(PISTOL_SIDE, 160, 480, 0.04*PISTOL_SIDE.width, 0.04*PISTOL_SIDE.height)
      image(INFINITY_SYMBOL, 313, 550, 0.6*INFINITY_SYMBOL.width, 0.6*INFINITY_SYMBOL.height)
      break
    case 2:
      image(UZI_SIDE, 155, 510, 0.03*UZI_SIDE.width, 0.03*UZI_SIDE.height)
      if (!infinite_bullets) {
        text(chaingun_bullets, 350, 588)
      } else {
        image(INFINITY_SYMBOL, 313, 550, 0.6*INFINITY_SYMBOL.width, 0.6*INFINITY_SYMBOL.height)
      }
      break
    case 3:
      image(SHOTGUN_SIDE, 145, 510, 0.04*SHOTGUN_SIDE.width, 0.04*SHOTGUN_SIDE.height)
      if (!infinite_bullets) {
        text(shotgun_bullets, 350, 588)
      } else {
        image(INFINITY_SYMBOL, 313, 550, 0.6*INFINITY_SYMBOL.width, 0.6*INFINITY_SYMBOL.height)
      }
      break
  }
  
  push()
    if (key_small) {
      translate(510, 525)
      rotate(90)
      image(KEY_SMALL, 0, 0, 0.08*KEY_SMALL.width, 0.08*KEY_SMALL.height)
    }
  pop()
  
  push()
    if (key_normal) {
      translate(530, 560)
      rotate(90)
      image(KEY_NORMAL, 0, 0, 0.1*KEY_NORMAL.width, 0.1*KEY_NORMAL.height)
    }
  pop()
  
  push()
    if (key_big) {
      translate(640, 517)
      rotate(90)
      image(KEY_LARGE, 0, 0, 0.1*KEY_LARGE.width, 0.1*KEY_LARGE.height)
    }
  pop()
  
  push()
    if (key_giant) {
      translate(640, 545)
      rotate(90)
      image(KEY_GIANT, 0, 0, 0.1*KEY_GIANT.width, 0.1*KEY_GIANT.height)
    }
  pop()
  
  textSize(25); fill(0); textAlign(CENTER)
  text("VIDA", 70, 545)
  text("BALAS", 350, 545)
  textAlign(LEFT)
  
  if (hp == 0) {
    fill(196, 51, 51, 3*death_frames)
    level_music.setVolume(1-(3*death_frames/450))
    rect(0, 0, width, height)
  }
      
  if (won_level) {
    fill(247, 224, 74, 3*winning_frames)
    level_music.setVolume(1-(3*winning_frames/450))
    rect(0, 0, width, height)
  }
}

// Draws the obstacles and pickables in first person
function draw_3d_props() {
  imageMode(CENTER)
  for (let obstacle of obstacles) {
    if (!obstacle.in_camera_bounds || !obstacle.seen) {
      continue
    }
    
    let distance = dist(player_position.x, player_position.y, obstacle.x, obstacle.y)
    
    let sprite = obstacle_types[obstacle.type].sprite
    
    image(sprite, width*obstacle.camera_x, 300 + height_offset, (6500)/distance, (6500*(sprite.height/sprite.width))/distance)
      
    //stroke(255, 0, 0); strokeWeight(5)
    //point(width*obstacle.camera_x, 300 + height_offset)
    //noStroke()
  }
  imageMode(CORNER)
  
  imageMode(CENTER)
  for (let pickable of pickables) {
    if (!pickable.in_camera_bounds || !pickable.seen) {
      continue
    }
    
    let distance = dist(player_position.x, player_position.y, pickable.x, pickable.y)
    
    let sprite = pickable_types[pickable.type].sprite
    
    push()
      translate(width*pickable.camera_x, 300 + height_offset + pickable.y_offset/distance)
      rotate(pickable.angle)
      image(sprite, 0, 0, (pickable.scale*6500)/distance, (pickable.scale*6500*(sprite.height/sprite.width))/distance)
    pop()
    
    //stroke(255, 0, 0); strokeWeight(5)
    //point(width*pickable.camera_x, 300 + height_offset + pickable.y_offset/distance)
    //noStroke()
  }
  imageMode(CORNER)
}

// Draws the doors in first person
function draw_3d_doors() {
  imageMode(CENTER)
  for (let door of doors) {
    if (door.opened || !door.seen) {
      continue
    }
    
    let distance = dist(player_position.x, player_position.y, door.x*wall_size + (wall_size/2), door.y*wall_size + (wall_size/2))
    
    let sprite
    switch (door.size) {
      case 1:
        sprite = LOCK_SMALL
        break
      case 2:
        sprite = LOCK_NORMAL
        break
      case 3:
        sprite = LOCK_LARGE
        break
      case 4:
        sprite = LOCK_GIANT
        break
    }
    
    let size = 0.4
    image(sprite, width*door.camera_x, 300 + height_offset, (size*6500)/distance, (size*6500*(sprite.height/sprite.width))/distance)
    
    //stroke(255, 0, 0); strokeWeight(5)
    //point(width*door.camera_x, 300 + height_offset + door.y_offset/distance)
    //noStroke()
  }
  imageMode(CORNER)
}

// Takes care of the movement with the mouse
function mouse_camera_movement() {
  if (hp != 0 && !won_level) {
    if (mouse_pressed && mouseButton == RIGHT) {
      mouse_start_x = mouseX
      start_camera_angle = camera_angle
    }
    if (mouseIsPressed && mouseButton == RIGHT) {
      camera_angle = mouse_camera_offset + start_camera_angle
      mouse_camera_offset = int(turning_speed*(mouseX-mouse_start_x)/10)
    }
    if (mouse_released) {
      mouse_camera_offset = 0
      start_camera_angle = 0
    }
  }
}

// Changes the level
function change_level(level) {
  current_level = level
  load_level(current_level)
}

// Loads a level
function load_level(level) {
  player_position = createVector(LEVELS[level].player_position[0], LEVELS[level].player_position[1])
  camera_angle = LEVELS[level].player_angle
  
  sky_color = color(LEVELS[level].sky_color)
  ground_color = color(LEVELS[level].ground_color)
  
  level_music = levels_music[level]
  
  walls = []
  for (let y = 0; y<LEVELS[level].walls.length;y++) {
    walls[y] = []
    for (let x = 0; x<LEVELS[level].walls[y].length; x++) {
      walls[y][x] = LEVELS[level].walls[y][x]
    }
  }
  
  enemies = []
  for (let enemy of LEVELS[level].enemies) {
    enemies.push(new Enemy(enemy.x, enemy.y, enemy.angle, enemy.type))
  }
  
  doors = []
  for (let door of LEVELS[level].doors) {
    doors.push(new Door(door.x, door.y, door.size))
  }
  
  obstacles = []
  for (let obstacle of LEVELS[level].obstacles) {
    obstacles.push(new Obstacle(obstacle.x, obstacle.y, obstacle.type))
  }
  
  pickables = []
  for (let pickable of LEVELS[level].pickables) {
    pickables.push(new Pickable(pickable.x, pickable.y, pickable.type))
  }
  
  pl_setup()
}

// Updates the rays based on the quality
function update_quality() {
  number_of_rays = qualities[quality-1]
  ray_setup()
}
