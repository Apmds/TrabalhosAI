let first_person = true
let level_music
let scale_2d = 1 // Scale used on the "map"(f press)
let map_scale = 0.5 // Scale used on the map(m press)
let map_position
let lowest_fps = 100000
let highest_fps = -1

let pause_main_menu_button
let pause_restart_button
let pause_resume_button

function game_setup() {
  // Pause menu buttons
  pause_resume_button = new Button((width/2), 250, 250, 100, color(36, 180, 16), color(0), "Continuar", 1.1, null, function () {game_paused = false})
  pause_resume_button.text_color = color(47, 118, 212)
  
  pause_restart_button = new Button((width/2), 375, 250, 100, color(36, 180, 16), color(0), "Reiniciar", 1.1, null, function () {level_music.stop(); change_menu(4)})
  pause_restart_button.text_color = color(47, 118, 212)
  
  pause_main_menu_button = new Button((width/2), 500, 250, 100, color(36, 180, 16), color(0), "Menu principal", 1.1, null, function () {level_music.stop(); change_menu(1)})
  pause_main_menu_button.text_color = color(47, 118, 212)
  
  first_person = true
  show_map = false
  game_paused = false
  
  load_level(current_level)
  update_quality()
  map_position = createVector(walls[0].length*wall_size*map_scale*0.5, walls.length*wall_size*map_scale*0.5)
  level_music.setVolume(1)
  level_music.play()
}

function game_draw() {
  background(0)
  
  if (!game_paused && !show_map) {
    pl_update()
    camera_angle = abs(360 + camera_angle)%360
    
    enemies.sort((a, b) => (a.distance_to_player < b.distance_to_player) ? 1 : -1)
    for (let enemy of enemies) {
      enemy.update()
    }

    for (let door of doors) {
      door.update()
    }

    for (let obstacle of obstacles) {
      obstacle.update()
    }

    for (let pickable of pickables) {
      pickable.update()
    }
  }
  
  debug_text = ""
  
  if (show_map) {
    if (keyIsDown(87)) { // W
      map_position.y-=5*map_scale
    }
    if (keyIsDown(83)) { // S
      map_position.y+=5*map_scale
    }
    if (keyIsDown(65)) { // A
      map_position.x-=5*map_scale
    }
    if (keyIsDown(68)) { // D
      map_position.x+=5*map_scale
    }
    
    push()
      translate(map_position.x - walls[0].length*wall_size*map_scale*0.5, map_position.y - walls.length*wall_size*map_scale*0.5)
      // Draws a rectangle with the size of the level
      noFill(); stroke(255); strokeWeight(1)
      rect(0, 0, walls[0].length*wall_size*map_scale, walls.length*wall_size*map_scale)

      // Draws the walls
      noStroke()
      for (let y = 0; y < walls.length; y++) {
        for (let x = 0; x < walls[y].length; x++) {
          let wall_color = wall_colors[walls[y][x]]
          fill(wall_color[0], wall_color[1], wall_color[2])
          square(x*wall_size*map_scale, y*wall_size*map_scale, wall_size*map_scale)
        }
      }
    pop()
    
    push()
      translate(map_position.x - walls[0].length*wall_size*map_scale*0.5, map_position.y - walls.length*wall_size*map_scale*0.5)
      // Player
      fill(150, 0, 0); noStroke()
      circle(player_position.x*map_scale, player_position.y*map_scale, player_size*map_scale)
      
      // Player_direction
      stroke(255, 0, 0); strokeWeight(1)
      line(player_position.x*map_scale, player_position.y*map_scale, player_position.x*map_scale + cos(camera_angle) * 10*map_scale, player_position.y*map_scale + sin(camera_angle)*10*map_scale)
    pop()
    
  } else if (first_person) {
    
    draw_3d_walls()
    draw_3d_doors()
    draw_3d_props()
    draw_3d_enemies()
    if (!picture_mode) {
      draw_3d_hud()
    }
    
    mouse_camera_movement()
    
  } else {
    // Draws a rectangle with the size of the level
    noFill(); stroke(255); strokeWeight(1)
    rect(0, 0, walls[0].length*wall_size*scale_2d, walls.length*wall_size*scale_2d)
    
    // Draws the walls
    noStroke()
    for (let y = 0; y < walls.length; y++) {
      for (let x = 0; x < walls[y].length; x++) {
        let wall_color = wall_colors[walls[y][x]]
        fill(wall_color[0], wall_color[1], wall_color[2])
        square(x*wall_size*scale_2d, y*wall_size*scale_2d, wall_size*scale_2d)
      }
    }
    
    for (let door of doors) {
      door.draw()
    }
    
    // Draws the enemies
    for (let enemy of enemies) {
      enemy.draw_2d()
    }
    
    for (let obstacle of obstacles) {
      obstacle.draw_2d()
    }
    
    for (let pickable of pickables) {
      pickable.draw_2d()
    }
    
    pl_draw()
    attack_ray.draw(color(255, 0, 0))
    if (debug_mode) {
      debug_text += "Position: " + player_position.x + "; " + player_position.y + "\n"
      debug_text += "Velocity: " + player_velocity.x + "; " + player_velocity.y + "\n"
      debug_text += "Angle: " + camera_angle + "\n"
      debug_text += "FOV: " + FOV + "\n"
    }
  }
  
  
  
  if (floor(frameRate()) > highest_fps && frameCount > 1) {
    highest_fps = floor(frameRate())
  }
  if (floor(frameRate()) < lowest_fps && frameCount > 1) {
    lowest_fps = floor(frameRate())
  }
  
  // Pause menu
  if (game_paused) {
    fill(100, 100); noStroke()
    rect(0, 0, width, height)
    fill(47, 118, 212); stroke(0); strokeWeight(3); textAlign(CENTER); textSize(80); textFont(TITLE_FONT)
    text("PAUSA", width/2, 125)
    
    pause_resume_button.check_press()
    pause_restart_button.check_press()
    pause_main_menu_button.check_press()
    
    pause_resume_button.draw()
    pause_restart_button.draw()
    pause_main_menu_button.draw()
  }
  
  if (debug_mode) {
    for (let i = 0; i < enemies.length; i++) {
      if (!enemies[i].seen) {
        continue
      }
      debug_text += "Enemy " + i + ": " + enemies[i].hp + " HP" + "\n"
    }
    
    debug_text += "Shoot time: " + gun_timer.current_time + "\n"
    debug_text += "Fire sprite: " + fire_sprite + "\n"
    debug_text += "Number of rays: " + number_of_rays + "\n"
    debug_text += "FPS: " + floor(frameRate()) + "; L: " + lowest_fps + "; H: " + highest_fps + "\n"
    
    fill(255); noStroke(); textSize(20); textAlign(LEFT); textFont("Arial")
    text(debug_text, 0, 20)
    
    // Changes the rayCast number
    if (keyIsDown(89)) { // Y
      number_of_rays++
      ray_setup()
    } else if (keyIsDown(84) && number_of_rays>1) { // T
      number_of_rays--
      ray_setup()
    }
  }
}

function key_pressed_game() {
  let gun
  if (keyCode >= 49 && keyCode <= 51) {
    gun = 1+(keyCode%49)
    if (!changing_gun && !game_paused && hp != 0 && !won_level) {
      change_gun(gun)
    }
    return
  }
  
  switch (keyCode) {
    case 32: // Space
      if (current_gun != 2 && gun_shootable && !game_paused && hp != 0 && !won_level) {
        shoot_gun()
      }
      break
    case 66: // B
      if (dev_mode) {
        picture_mode = !picture_mode
      }
      break
    
    case 69: // E
      if (!changing_gun && !game_paused && hp != 0 && !won_level) {
        gun = current_gun
        gun++
        if (gun > 3) {
          gun = 1
        }
        change_gun(gun)
      }
      break
    case 70: // F
      if (dev_mode) {
        first_person = !first_person
      }
      break
      
    case 71: // G
      if (dev_mode) {
        shadows = !shadows
      }
      break
      
    case 75: // K
      if (dev_mode) {
        debug_mode = !debug_mode
      }
      break
    
    case 76: // L
      if (dev_mode) {
        key_small = true
        key_normal =  true
        key_big = true
        key_giant = true
      }
      break
    
    case 77: // M
      if (!game_paused && !won_level && hp != 0) {
        show_map = !show_map
      }
      break
    
    case 80: // P
      if (!game_paused && !won_level && hp != 0) {
        SELECT_SOUND.play()
        game_paused = !game_paused
      }
      break
    
    case 81: // Q
      if (!changing_gun && !game_paused && hp != 0 && !won_level) {
        gun = current_gun
        gun--
        if (gun < 1) {
          gun = 3
        }
        change_gun(gun)
      }
      break
      
    case 82: // R
      if (dev_mode) {
        change_menu(menu)
      }
      break
      
    case 85: // U
      if (dev_mode) {
        quality++
        if (quality == qualities.length + 1) {
          quality = 1
        }
        update_quality()
      }
      break
    
    case 187: // +
      if (!first_person) {
        scale_2d += 0.1
      }
      map_scale += 0.1 
      break
    
    case 189: // -
      if (!first_person) {
        scale_2d -= 0.1
      }
      map_scale -= 0.1
      break
  }
}

let end_screen_back_button
let end_screen_restart_button
let amongus_end_img
let enemy_end_img
let t

function defeat_setup() {
  end_screen_back_button = new Button((width/2), 475, 250, 150, color(190, 7, 7), color(0), "Menu\nprincipal", 1.1, null, function () {change_menu(1); SELECT_SOUND.play()})
  end_screen_back_button.text_color = color(47, 118, 212)
  end_screen_back_button.text_size_offset = -5
  
  end_screen_restart_button = new Button((width/2), 275, 250, 150, color(190, 7, 7), color(0), "Reiniciar", 1.1, null, function () {change_menu(4); SELECT_SOUND.play()})
  end_screen_restart_button.text_color = color(47, 118, 212)
  
  amongus_end_img = random([ENEMY_AMONGUS_1, ENEMY_AMONGUS_2, ENEMY_AMONGUS_3])
  enemy_end_img = random([ENEMY_1, ENEMY_2, ENEMY_3])
  
  level_music.stop()
  t = 0
}

function defeat_draw() {
  background(196, 51, 51)
  
  if (t<12) {
    t++
  }
  
  fill(235, 20, 20, map(10*t, 0, 120, 0, 255)); stroke(0, map(10*t, 0, 120, 0, 255)); strokeWeight(3); textSize(90); textAlign(CENTER); textFont(TITLE_FONT)
  text("Derrota", width/2, 140)
  
  imageMode(CENTER)
  image(amongus_end_img, 10*t, 370, 200, 200)
  if (enemy_end_img == ENEMY_3) {
    image(enemy_end_img, 800-(10*t), 370, 350*(enemy_end_img.width/enemy_end_img.height), 350)
  } else {
    image(enemy_end_img, 800-(10*t), 370, 200, 200*(enemy_end_img.height/enemy_end_img.width))
  }
  
  end_screen_back_button.fill_color.levels[3] = map(10*t, 0, 120, 0, 255)
  end_screen_back_button.draw()
  end_screen_back_button.check_press()
  
  end_screen_restart_button.fill_color.levels[3] = map(10*t, 0, 120, 0, 255)
  end_screen_restart_button.draw()
  end_screen_restart_button.check_press()
}

function defeat_key_pressed() {
  switch (keyCode) {
    case 32:
      change_menu(4)
      SELECT_SOUND.play()
      break
  }
}

let end_screen_next_level_button
let key_end_img

function victory_setup() {
  end_screen_back_button = new Button((width/2), 500, 250, 100, color(43, 243, 18), color(0), "Menu principal", 1.1, null, function () {change_menu(1); SELECT_SOUND.play()})
  end_screen_back_button.text_color = color(47, 118, 212)
  
  end_screen_next_level_button = new Button((width/2), 375, 250, 100, color(43, 243, 18), color(0), "Próximo nível", 1.1, null, function () {current_level++; if(current_level > 3) {change_menu(1)} else {change_menu(4); change_level(current_level)} SELECT_SOUND.play()})
  end_screen_next_level_button.text_color = color(47, 118, 212)
  
  level_music.stop()
  key_end_img = random([KEY_SMALL, KEY_NORMAL, KEY_LARGE, KEY_GIANT])
  t = 0
}

function victory_draw() {
  background(247, 224, 74)
  
  if (t<14) {
    t++
  }
  
  fill(47, 118, 212, map(10*t, 0, 140, 0, 255)); stroke(0, map(10*t, 0, 140, 0, 255)); strokeWeight(2); textSize(70); textFont(TITLE_FONT); textAlign(CENTER)
  text("Vitória!", width/2, 80)
  
  rectMode(CENTER)
  fill(47, 118, 212, map(10*t, 0, 140, 0, 255)); stroke(0, map(10*t, 0, 140, 0, 255)); strokeWeight(2)
  textSize(LEVELS[current_level].final_text_size); textFont(TEXT_FONT); textAlign(CENTER); textWrap(WORD)
  text(LEVELS[current_level].final_text, width/2, 140, 650)
  
  imageMode(CENTER)
  if (current_level == 1) {
    image(ENEMY_AMONGUS_1, 800-(10*t), 435, 200, 200)
  } else if (current_level == 2) {
    image(ENEMY_AMONGUS_2, 800-(10*t), 435, 200, 200)
  } else {
    image(ENEMY_AMONGUS_3, 800-(10*t), 435, 200, 200)
  }
  image(key_end_img, 10*t, 435, 200*(key_end_img.width/key_end_img.height), 200)
  
  end_screen_next_level_button.draw()
  end_screen_next_level_button.check_press()
  
  end_screen_back_button.draw()
  end_screen_back_button.check_press()
}

function victory_key_pressed() {
  switch (keyCode) {
    case 32:
      current_level++
      if(current_level > 3) {
        change_menu(1)
      } else {
        change_menu(4)
        change_level(current_level)
      }
      SELECT_SOUND.play()
      break
  }
}