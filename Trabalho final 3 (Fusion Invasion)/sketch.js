/*
Menus:
1: menu inicial
2: seleção de níveis
3: créditos
4: jogo
5: definições
6: extras(cheats)
7: derrota
8: vitória
9: instruções
*/

let dev_mode = false
let debug_mode = false
let picture_mode = false
let game_paused = false
let debug_text = ""

let mouse_released = false
let mouse_pressed = false

let menu = 1
let current_level = 2

// Grabs focus when the game starts
window.onload = function() {
  this.focus();
}

// Block the right-click menu
document.oncontextmenu = function() {
  return false;
}

function preload() {
  
  // Guns
  PISTOL_SIDE = loadImage("Guns/pistol_side.png")
  PISTOL_SPRITE = loadImage("Guns/pistol_front.png")
  
  SHOTGUN_SIDE = loadImage("Guns/shotgun_side.png")
  SHOTGUN_SPRITE = loadImage("Guns/shotgun_front.png")
  
  UZI_SIDE = loadImage("Guns/uzi_side.png")
  UZI_SPRITE = loadImage("Guns/uzi_front.png")
  
  // Enemies
  ENEMY_AMONGUS_1 = loadImage("Enemies/amongus_green.png")
  ENEMY_AMONGUS_2 = loadImage("Enemies/amongus_blue.png")
  ENEMY_AMONGUS_3 = loadImage("Enemies/amongus_red.png")
  
  ENEMY_1 = loadImage("Enemies/Animal_1_Frente.png")
  ENEMY_1_BACK = loadImage("Enemies/Animal_1_Tras.png")
  
  ENEMY_2 = loadImage("Enemies/Animal_2_Frente.png")
  ENEMY_2_BACK = loadImage("Enemies/Animal_2_Tras.png")
  
  ENEMY_3 = loadImage("Enemies/Animal_3_Frente.png")
  ENEMY_3_BACK = loadImage("Enemies/Animal_3_Tras.png")
  
  // Keys
  KEY_SMALL = loadImage("Keys and locks/Chave 1.png")
  KEY_NORMAL = loadImage("Keys and locks/Chave 2.png")
  KEY_LARGE = loadImage("Keys and locks/Chave 3.png")
  KEY_GIANT = loadImage("Keys and locks/Chave 4.png")
  
  // Locks
  LOCK_SMALL = loadImage("Keys and locks/Fechadura 1.png")
  LOCK_NORMAL = loadImage("Keys and locks/Fechadura 2.png")
  LOCK_LARGE = loadImage("Keys and locks/Fechadura 3.png")
  LOCK_GIANT = loadImage("Keys and locks/Fechadura 4.png")
  
  // Pickables
  UZI_BULLET_BOX = loadImage("Items/Pistol_bullets_box.png")
  SHOTGUN_BULLET_BOX = loadImage("Items/Shotgun_bullets_box.png")
  BANDAGE = loadImage("Items/Bandage.png")
  
  // Other images
  AEANADIA_LOGO = loadImage("Other images/Aeanadia_logo.png")
  INFINITY_SYMBOL = loadImage("Other images/infinity_symbol.png")
  BACK_ARROW = loadImage("Other images/Back arrow.png")
  
  FIRE_SPRITE_1 = loadImage("Other images/Fire_1.png")
  FIRE_SPRITE_2 = loadImage("Other images/Fire_2.png")
  
  COVER = loadImage("Other images/Cover.png")
  LEVEL_1_COVER = loadImage("Other images/level_1_cover.png")
  LEVEL_2_COVER = loadImage("Other images/level_2_cover.png")
  LEVEL_3_COVER = loadImage("Other images/level_3_cover.png")
  
  // Sound effects
  PISTOL_SOUND = loadSound("Sound effects/Som pistola.mp3")
  SHOTGUN_SOUND = loadSound("Sound effects/Som shotgun.mp3")
  SELECT_SOUND = loadSound("Sound effects/select_sound.mp3")
  GRAB_ITEM_SOUND = loadSound("Sound effects/Apanhar item.mp3")
  OPEN_DOOR_SOUND = loadSound("Sound effects/abrir porta.mp3")
  DAMAGE_SOUND = loadSound("Sound effects/Dano Jogador.mp3")
  
  ENEMY_AMONGUS_DEATH = loadSound("Sound effects/Invasor.mp3")
  ENEMY_1_DEATH = loadSound("Sound effects/Monstro 1.mp3")
  ENEMY_2_DEATH = loadSound("Sound effects/Monstro 2.mp3")
  ENEMY_3_DEATH = loadSound("Sound effects/Monstro 3.mp3")
  
  // Music
  LEVEL_1_MUSIC = loadSound("Music/At Dooms Gate.mp3")
  LEVEL_1_MUSIC.setLoop(true)
  LEVEL_2_MUSIC = loadSound("Music/Kitchen Ace And Taking Names.mp3")
  LEVEL_2_MUSIC.setLoop(true)
  LEVEL_3_MUSIC = loadSound("Music/On the Hunt.mp3")
  LEVEL_3_MUSIC.setLoop(true)
  
  // Fonts
  TITLE_FONT = loadFont("Fonts/zero-cool.regular.ttf")
  TEXT_FONT = loadFont("Fonts/kurland.regular.ttf")
}

function setup() {
  createCanvas(800, 600)
  angleMode(DEGREES)
  noSmooth()
  
  type_enemies_setup()
  obstacle_types_setup()
  pickable_types_setup()
  levels_music_setup()
  
  //background(158, 59, 55)
  change_menu(menu)
}

function draw() {
  
  switch (menu) {
    case 1:
      main_menu_draw()
      break
    case 2:
      level_select_draw()
      break
    case 3:
      credits_draw()
      break
    case 4:
      game_draw()
      break
    case 5:
      settings_draw()
      break
    case 6:
      cheats_draw()
      break
    case 7:
      defeat_draw()
      break
    case 8:
      victory_draw()
      break
    case 9:
      instructions_draw()
      break
  }
  
  mouse_released = false
  mouse_pressed = false
}

function change_menu(new_menu) {
  menu = new_menu
  switch (menu) {
    case 1:
      main_menu_setup()
      break
    case 2:
      level_select_setup()
      break
    case 3:
      credits_setup()
      break
    case 4:
      game_setup()
      break
    case 5:
      settings_setup()
      break
    case 6:
      cheats_setup()
      break
    case 7:
      defeat_setup()
      break
    case 8:
      victory_setup()
      break
    case 9:
      instructions_setup()
      break
  }
}

function mousePressed() {
  mouse_pressed = true
  print(mouseX, mouseY)
}

function mouseReleased() {
  mouse_released = true
}

function keyPressed() {
  switch (menu) {
    case 1:
      key_pressed_main_menu()
      break
    case 2:
      key_pressed_level_select()
      break
    case 3:
      key_pressed_credits()
      break
    case 4:
      key_pressed_game()
      break
    case 5:
      key_pressed_settings()
      break
    case 6:
      key_pressed_cheats()
      break
    case 7:
      key_pressed_defeat()
      break
    case 8:
      key_pressed_victory()
      break
    case 9:
      key_pressed_instructions()
      break
  }
}
