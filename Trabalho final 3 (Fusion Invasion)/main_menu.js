let level_select_button
let settings_button
let credits_button
let intructions_button

function main_menu_setup() {
  level_select_button = new Button(250, 310, 200, 100, color(36, 180, 16), color(0), "Jogar", 1.1, null, function () {change_menu(2)})
  level_select_button.text_color = color(47, 118, 212)
  
  settings_button = new Button(550, 310, 200, 100, color(36, 180, 16), color(0), "Definições", 1.1, null, function () {change_menu(5)})
  settings_button.text_color = color(47, 118, 212)
  
  credits_button = new Button(250, 480, 200, 100, color(36, 180, 16), color(0), "Créditos", 1.1, null, function () {change_menu(3)})
  credits_button.text_color = color(47, 118, 212)
  
  instructions_button = new Button(550, 480, 200, 100, color(36, 180, 16), color(0), "Instruções", 1.1, null, function () {change_menu(9)})
  instructions_button.text_color = color(47, 118, 212)
}

function main_menu_draw() {
  imageMode(CORNER)
  image(COVER, 0, 0)
  
  level_select_button.draw()
  level_select_button.check_press()
  
  settings_button.draw()
  settings_button.check_press()
  
  credits_button.draw()
  credits_button.check_press()
  
  instructions_button.draw()
  instructions_button.check_press()
  
  fill(47, 118, 212); stroke(0); strokeWeight(2); textSize(80); textAlign(CENTER); textFont(TITLE_FONT)
  text("FUSION INVASION", width/2, 160)
}

function key_pressed_main_menu() {
  switch (keyCode) {
    case 32: // Space
      SELECT_SOUND.play()
      change_menu(2)
      break
  }
}

let level_one_button
let level_two_button
let level_three_button
let back_button

function level_select_setup() {
  back_button = new Button(70, 540, 70, 70, color(255), color(0), "", 1.1, BACK_ARROW, function () {change_menu(1)})
  level_one_button = new Button(133, 300, 267, 500, color(255), color(0), "", 1, LEVEL_1_COVER, function () {current_level = 1; change_menu(4)})
  level_two_button = new Button(400, 300, 267, 500, color(255), color(0), "", 1, LEVEL_2_COVER, function () {current_level = 2; change_menu(4)})
  level_three_button = new Button(666, 300, 267, 500, color(255), color(0), "", 1, LEVEL_3_COVER, function () {current_level = 3; change_menu(4)})
}

function level_select_draw() {
  tint(200)
  image(COVER, 0, 0)
  noTint()
  
  level_one_button.draw()
  level_one_button.check_press()
  
  level_two_button.draw()
  level_two_button.check_press()
  
  level_three_button.draw()
  level_three_button.check_press()
  
  back_button.draw()
  back_button.check_press()
}

function key_pressed_level_select() {
  if (keyCode >= 49 && keyCode <= 51) {
    SELECT_SOUND.play()
    current_level = 1+(keyCode%49)
    change_menu(4)
    return
  }
  
  switch (keyCode) {
    case 27:
      SELECT_SOUND.play()
      change_menu(1)
      break
  }
}

function credits_setup() {
  back_button = new Button(70, 540, 70, 70, color(255), color(0), "", 1.1, BACK_ARROW, function () {change_menu(1)})
}

function credits_draw() {
  tint(190)
  image(COVER, 0, 0)
  noTint()
  
  fill(47, 118, 212); textSize(50); textAlign(CENTER); textFont(TITLE_FONT)
  text("Créditos", width/2, 100)
  
  let txt = ""
  txt += "Trabalho realizado para a disciplina de A.I. por:" + "\n"
  txt += "  - António Santos nº3 12ºA" + "\n"
  txt += "  - Lucas Dias nº12 12ºA" + "\n"
  
  fill(255); textSize(35); textAlign(LEFT); textFont(TEXT_FONT)
  text(txt, 60, 190)
  
  txt = ""
  txt += "Programação: António Santos" + "\n"
  txt += "Design: Lucas Dias" + "\n"
  txt += "Áudio: António Santos e Lucas Dias" + "\n"
  
  textSize(30)
  text(txt, 60, 350)
  
  txt = ""
  txt += "Professores:" + "\n"
  txt += " - Nuno Conde" + "\n"
  txt += " - Rosa Cruz" + "\n"
  txt += " - Catarina Simões" + "\n"
  
  textSize(25)
  text(txt, 140, 480)
  
  back_button.draw()
  back_button.check_press()
  
  image(AEANADIA_LOGO, 580, 440, 0.2*AEANADIA_LOGO.width, 0.2*AEANADIA_LOGO.height)
}

function key_pressed_credits() {
  switch (keyCode) {
    case 27:
      SELECT_SOUND.play()
      change_menu(1)
      break
  }
}

let quality_slider
let sensitivity_slider
let sound_slider
let render_distance_slider
let shadows_button
let cheats_button

function settings_setup() {
  back_button = new Button(70, 540, 70, 70, color(255), color(0), "", 1.1, BACK_ARROW, function () {change_menu(1); quality_slider.hide(); sensitivity_slider.hide(); sound_slider.hide(); render_distance_slider.hide()})
  
  shadows_button = new Button(400, 200, 120, 70, color(255, 0), color(0, 0), "Sombras", 1.1, null, function () {shadows = !shadows; if (shadows) {shadows_button.text_color = color(0, 255, 0)} else {shadows_button.text_color = color(255, 0, 0)}})
  shadows = !shadows
  shadows_button.text_size_offset = 7
  shadows_button.func()
  
  cheats_button = new Button(765, 565, 75, 75, color(255, 0), color(0, 0), "", 1, null, function () {change_menu(6); quality_slider.hide(); sensitivity_slider.hide(); sound_slider.hide(); render_distance_slider.hide()})
  
  quality_slider = createSlider(1, 5, quality, 1)
  quality_slider.position(300, 250)
  quality_slider.style('width', '200px')
  
  sound_slider = createSlider(0, 1, getOutputVolume(), 0.05)
  sound_slider.position(300, 300)
  sound_slider.style("width", "200px")
  
  sensitivity_slider = createSlider(1, 10, turning_speed, 1)
  sensitivity_slider.position(300, 350)
  sensitivity_slider.style('width', '200px')
  
  render_distance_slider = createSlider(3, 25, ray_size, 1)
  render_distance_slider.position(300, 400)
  render_distance_slider.style("width", "200px")
}

function settings_draw() {
  tint(180)
  image(COVER, 0, 0)
  noTint()
  
  fill(47, 118, 212); textSize(50); textAlign(CENTER); textFont(TITLE_FONT)
  text("Definições", width/2, 100)
  
  fill(255); textSize(23); textAlign(RIGHT); textFont(TEXT_FONT)
  text("Qualidade", 295, 265)
  text("Volume", 295, 315)
  text("Sensibilidade", 295, 365)
  text("Distância de visão", 295, 415)
  
  textAlign(LEFT)
  text(quality, 520, 265)
  quality = quality_slider.value()
  
  text(int(getOutputVolume().toFixed(2)*100) + "%", 520, 315)
  outputVolume(sound_slider.value())
  
  text(turning_speed*10, 520, 365)
  turning_speed = sensitivity_slider.value()
  
  text(ray_size, 520, 415)
  ray_size = render_distance_slider.value()
  
  shadows_button.draw()
  shadows_button.check_press()
  
  cheats_button.draw()
  cheats_button.check_press()
  
  back_button.draw()
  back_button.check_press()
}

function key_pressed_settings() {
  switch (keyCode) {
    case 27:
      SELECT_SOUND.play()
      change_menu(1)
      quality_slider.hide()
      sensitivity_slider.hide()
      sound_slider.hide()
      render_distance_slider.hide()
      break
  }
}

let infinite_hp_button
let infinite_bullets_button
let dev_mode_button
let speed_slider

function cheats_setup() {
  back_button = new Button(70, 540, 70, 70, color(255), color(0), "", 1.1, BACK_ARROW, function () {change_menu(5); speed_slider.hide()})
  
  infinite_hp_button = new Button(400, 190, 130, 50, color(255, 0), color(0, 0), "HP infinito", 1.1, null, function () {infinite_hp = !infinite_hp; if (infinite_hp) {infinite_hp_button.text_color = color(0, 255, 0)} else {infinite_hp_button.text_color = color(255, 0, 0)}})
  infinite_hp = !infinite_hp
  infinite_hp_button.func()
  infinite_hp_button.text_size_offset = 7
  
  infinite_bullets_button = new Button(400, 250, 160, 50, color(255, 0), color(0, 0), "Balas infinitas", 1.1, null, function () {infinite_bullets = !infinite_bullets; if (infinite_bullets) {infinite_bullets_button.text_color = color(0, 255, 0)} else {infinite_bullets_button.text_color = color(255, 0, 0)}})
  infinite_bullets = !infinite_bullets
  infinite_bullets_button.func()
  infinite_bullets_button.text_size_offset = 7
  
  dev_mode_button = new Button(400, 310, 160, 50, color(255, 0), color(0, 0), "Modo de desenvolvedor", 1.1, null, function () {dev_mode = !dev_mode; if (dev_mode) {dev_mode_button.text_color = color(0, 255, 0)} else {dev_mode_button.text_color = color(255, 0, 0)}})
  dev_mode = !dev_mode
  dev_mode_button.func()
  dev_mode_button.text_size_offset = 7
  
  speed_slider = createSlider(1, 10, top_speed, 1)
  speed_slider.position(300, 360)
  speed_slider.style('width', '200px')
}

function cheats_draw() {
  tint(140)
  image(COVER, 0, 0)
  noTint()
  
  fill(158, 59, 55); textSize(50); textAlign(CENTER); textFont(TITLE_FONT)
  text("CHEETOS", width/2, 100)
  
  fill(255); textSize(23); textAlign(RIGHT); textFont(TEXT_FONT)
  text("Velocidade", 295, 375)
  
  textAlign(LEFT)
  text(top_speed, 520, 375)
  top_speed = speed_slider.value()
  
  infinite_hp_button.draw()
  infinite_hp_button.check_press()
  
  infinite_bullets_button.draw()
  infinite_bullets_button.check_press()
  
  dev_mode_button.draw()
  dev_mode_button.check_press()
  
  back_button.draw()
  back_button.check_press()
}

function key_pressed_cheats() {
  switch (keyCode) {
    case 27:
      SELECT_SOUND.play()
      change_menu(5)
      speed_slider.hide()
      break
  }
}

let lore = false
let lore_button

function instructions_setup() {
  back_button = new Button(730, 540, 70, 70, color(255), color(0), "", 1.1, BACK_ARROW, function () {change_menu(1)})
  
  lore_button = new Button(700, 100, 50, 65, color(255, 0), color(0, 0), "?", 1.7, null, function () {lore = !lore})
  lore_button.text_size_offset = 50
}

function instructions_draw() {
  tint(200)
  image(COVER, 0, 0)
  noTint()
  
  if (lore) {
    fill(47, 118, 212); textSize(50); textAlign(CENTER); textFont(TITLE_FONT)
    text("História", width/2, 100)
    
    textFont(TEXT_FONT)
    fill(47, 118, 212); textSize(40); textAlign(LEFT)
    text("A terra foi invadida por alienígenas! Na sua busca por um exército perfeito, os invasores criaram monstruosidades feitas do DNA dos mais fortes animais do maior Zoo do mundo. É o teu dever derrotar os 3 invasores, impedindo que a terra seja conquistada.", 60, 170, 650)
    
  } else {
    fill(47, 118, 212); textSize(50); textAlign(CENTER); textFont(TITLE_FONT)
    text("Instruções", width/2, 100)

    textFont(TEXT_FONT)
    draw_key("W", 40, 155, 50)
    draw_key("A", 110, 155, 50)
    draw_key("S", 180, 155, 50)
    draw_key("D", 250, 155, 50)

    draw_key("space", 40, 235, 50)

    draw_key("left", 40, 315, 50)
    draw_key("right", 110, 315, 50)

    draw_mouse("right", 245, 315, 35)

    draw_key("Q", 40, 395, 50)
    draw_key("E", 110, 395, 50)
    draw_key("1", 245, 395, 50)
    draw_key("3", 350, 395, 50)

    draw_key("P", 40, 475, 50)

    draw_key("M", 245, 475, 50)

    fill(255); textSize(40); textAlign(LEFT, CENTER); textFont(TEXT_FONT)
    text(": Mover", 315, 175)

    text(": Disparar arma", 370, 255)

    text("OU", 175, 335)
    text(": Girar câmara", 295, 335)

    text("OU", 175, 415)
    text("A", 310, 415)
    text(": Trocar arma", 415, 415)

    text(": Pausa", 105, 495)

    text(": Abrir e fechar mapa", 310, 495)
    textAlign(LEFT, BASELINE)
  }
    
  
  lore_button.draw()
  lore_button.check_press()
  
  back_button.draw()
  back_button.check_press()
}

function key_pressed_instructions() {
  switch (keyCode) {
    case 27:
      SELECT_SOUND.play()
      change_menu(1)
      break
  }
}

// Draws a key
function draw_key(key_name, x, y, size) {
  let border_size = 0.2
  
  if (key_name.toLowerCase() == "space") {
    // Key
    noStroke()
    fill(130)
    rect(x, y, size*6.25, size)
    fill(120)
    quad(x+size*6.25, y, x+size*6.25, y+size, x+size*(6.25-border_size), y+size*(1-border_size), x+size*(6.25-border_size), y+size*border_size)
    fill(110)
    quad(x, y+size, x+size*6.25, y+size, x+size*(6.25-border_size), y+size*(1-border_size), x+size*border_size, y+size*(1-border_size))
    fill(140)
    quad(x, y, x+size*border_size, y+size*border_size, x+size*border_size, y+size*(1-border_size), x, y+size)
    fill(150)
    quad(x, y, x+size*6.25, y, x+size*(6.25-border_size), y+size*border_size, x+size*border_size, y+size*border_size)
    
    // Text
    textSize(size/2.1); textAlign(CENTER, CENTER); textFont(TEXT_FONT); fill(255)
    text("Espaço", x + (size*6.25*0.5), y + (size*0.45))
    textAlign(CENTER, BASELINE)
  } else {
    // Key
    noStroke()
    fill(130)
    square(x, y, size)
    fill(120)
    quad(x+size, y, x+size, y+size, x+size*(1-border_size), y+size*(1-border_size), x+size*(1-border_size), y+size*border_size)
    fill(110)
    quad(x, y+size, x+size, y+size, x+size*(1-border_size), y+size*(1-border_size), x+size*border_size, y+size*(1-border_size))
    fill(140)
    quad(x, y, x+size*border_size, y+size*border_size, x+size*border_size, y+size*(1-border_size), x, y+size)
    fill(150)
    quad(x, y, x+size, y, x+size*(1-border_size), y+size*border_size, x+size*border_size, y+size*border_size)
    
    // Arrows
    fill(255); stroke(255); strokeWeight(size/17)
    if (key_name.toLowerCase() == "up") {
      line(x+size*0.5, y+size*0.3, x+size*0.5, y+size*0.7)
      
      line(x+size*0.5, y+size*0.3, x+size*0.4, y+size*0.4)
      line(x+size*0.5, y+size*0.3, x+size*0.6, y+size*0.4)
    } else if (key_name.toLowerCase() == "down") {
      line(x+size*0.5, y+size*0.3, x+size*0.5, y+size*0.7)
      
      line(x+size*0.5, y+size*0.7, x+size*0.4, y+size*0.6)
      line(x+size*0.5, y+size*0.7, x+size*0.6, y+size*0.6)
    } else if (key_name.toLowerCase() == "left") {
      line(x+size*0.3, y+size*0.5, x+size*0.7, y+size*0.5)
      
      line(x+size*0.3, y+size*0.5, x+size*0.4, y+size*0.4)
      line(x+size*0.3, y+size*0.5, x+size*0.4, y+size*0.6)
    } else if (key_name.toLowerCase() == "right") {
      line(x+size*0.3, y+size*0.5, x+size*0.7, y+size*0.5)
      
      line(x+size*0.7, y+size*0.5, x+size*0.6, y+size*0.4)
      line(x+size*0.7, y+size*0.5, x+size*0.6, y+size*0.6)
    } else {
      // Text
      textSize(size/2.1); textAlign(CENTER, CENTER); textFont(TEXT_FONT); noStroke()
      text(key_name, x + (size*0.5), y + (size*0.45))
      textAlign(CENTER, BASELINE)
    }
  }
}

// Draws a mouse
function draw_mouse(pressed_key, x, y, size) {
  // Base
  fill(255); stroke(0); strokeWeight(size/13)
  rect(x, y, size, size*1.5, 50)
  
  // Left button
  fill(255)
  if (pressed_key.toLowerCase() == "left") {
    fill(100)
  }
  beginShape()
    vertex(x+size*0.5, y)
    vertex(x+size*0.5, y+size*0.75)
    vertex(x, y+size*0.75)
    bezierVertex(x, y+size*0.3, x, y, x+size*0.5, y)
  endShape()
  
  // Right button
  fill(255)
  if (pressed_key.toLowerCase() == "right") {
    fill(100)
  }
  beginShape()
    vertex(x+size*0.5, y)
    vertex(x+size*0.5, y+size*0.75)
    vertex(x+size, y+size*0.75)
    bezierVertex(x+size, y+size*0.3, x+size, y, x+size*0.5, y)
  endShape()
  
  // Center button/wheel
  fill(255)
  if (pressed_key.toLowerCase() == "center") {
    fill(100)
  }
  rect(x+size*0.4, y+size*0.15, size*0.2, size*0.4, 50)
}
