let t

function menu_inicial_setup() {  
  resizeCanvas(800, 800)
  t = 0
  tabuleiros_menu = [
    new Tabuleiro(x = 0, y = random(50, 750), tamanho = random(0.6, 1.3), alfa = random(20, 70), spd_x = random(0.1, 1), spd_y = random(0.1, 0.3), ang_spd = random(0.1, 0.5) * random([-1, 1])),

    new Tabuleiro(x = 800, y = random(50, 750), tamanho = random(0.6, 1.3), alfa = random(20, 70), spd_x = -random(0.1, 1), spd_y = -random(0.1, 0.3), ang_spd = random(0.1, 0.5) * random([-1, 1])),

    new Tabuleiro(x = random(50, 750), y = 0, tamanho = random(0.6, 1.3), alfa = random(20, 70), spd_x = random(0.1, 0.3) * random([-1, 1]), spd_y = random(0.5, 1), ang_spd = random(0.1, 0.5) * random([-1, 1])),

    new Tabuleiro(x = random(50, 750), y = 800, tamanho = random(0.6, 1.3), alfa = random(20, 70), spd_x = random(0.1, 0.3) * random([-1, 1]), spd_y = -random(0.5, 1), ang_spd = random(0.1, 0.5) * random([-1, 1])),
  ]
  sub_menus = [
    new SubMenu(-650, 50, 700, 700, "JOGOS", -650, 50),
    new SubMenu(750, 50, 700, 700, "APRENDER", 750, 50)
  ]
  let botoes1 = [
    new Botao(130, 250, 200, 85, color(70, 69, 64), color(119, 149, 86), "Labirinto", null, function() {trocar_menu(2)}),
    new Botao(475, 250, 200, 85, color(70, 69, 64), color(119, 149, 86), "Diferenças", null, function() {trocar_menu(3)}),
    new Botao(295, 490, 200, 85, color(70, 69, 64), color(119, 149, 86), '"Xadrez"', null, function() {trocar_menu(4)}),
  ]
  let botoes2 = [
    new Botao(275, 250, 250, 90, color(70, 69, 64), color(119, 149, 86), "VIDEO", null, function() {window.open("https://drive.google.com/file/d/1fDlMK7Ktux5vwlfVu1UNa7yEzRt7S3Ww/view?usp=share_link")}),
  ]
  sub_menus[0].botoes = botoes1
  sub_menus[1].botoes = botoes2
  
  a = lerp(0, 49, 0.1)
}

// Desenha o menu inicial
function menu_inicial() {
  background(40, 39, 34)
  
  // Desenha os tabuleiros de fundo
  for (let tab of tabuleiros_menu) {
    tab.desenhar()
    tab.mover()
  }
  
  // Desenha o título
  fill(255)
  stroke(79, 109, 46)
  strokeWeight(10)
  textSize(50)
  let height = 0
  if (t != 450) {
    height = (t-450)*sin(t-450)*sin(t-450)
    height /= 3
    t += 1
  }
  
  text("Trabalho final 2", width/2,150 + height)
  
  gif.position(sub_menus[1].x+sub_menus[1].w/2 - 100, sub_menus[1].y+sub_menus[1].h/1.4 - 100)
  gif.size(200, 200)
  
  if (sub_menus[1].x+sub_menus[1].w/2 < width) {
    gif.show()
  } else {
    gif.hide()
  }
  
  for (let menu of sub_menus) {
    menu.mover()
    menu.desenhar()
    menu.botoes_press()
  }
}

// Retorna true se o ponto de coordenadas (x, y) está dentro do retângulo (x1, y1) de comprimento w e largura h
function ponto_dentro(x, y, x1, y1, w, h) {
  return (x > x1 && x < x1+w && y > y1 && y < y1+h)
}

class Tabuleiro {
  constructor(x = 0, y = 0, tamanho = 1, alfa = 255, spd_x = 1, spd_y = 1, ang_spd = 1) {
    this.x = x
    this.y = y
    this.tamanho = tamanho
    this.alfa = alfa
    this.velocidade_x = spd_x
    this.velocidade_y = spd_y
    this.angulo = 0
    this.velocidade_angular = ang_spd
  }
  
  desenhar() {
    push()
    translate(this.x, this.y)
    scale(this.tamanho)
    rotate(this.angulo)
    noStroke()
    for (let i = 0; i<8;i++) {
      for (let j = 0; j<8;j++) {
        if ((j+i)%2==0){
          fill(235, 236, 208, this.alfa)
        } else {
          fill(119, 149, 86, this.alfa)
        }
        square((i*50)-50*8/2, (j*50)-50*8/2, 50)
      }
    }
  pop()
  }
  
  mover() {
    this.x += this.velocidade_x
    this.y += this.velocidade_y
    this.angulo += this.velocidade_angular
    
    if (this.x > 1100) {
      this.x = -300
    }
    if (this.x < -300) {
      this.x = 1100
    }
    if (this.y > 1100) {
      this.y = -300
    }
    if (this.y < -300) {
      this.y = 1100
    }
  }
}

class SubMenu {
  constructor(x = 0, y = 0, w = 50, h = 50, titulo = "MENU", xi = 0, xf = 0) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.titulo = titulo
    this.x_inicial = xi
    this.x_final = xf
    this.botoes = []
  }
  desenhar() {
    fill(40, 39, 34)
    stroke(59, 89, 26, 100)
    strokeWeight(4)
    rect(this.x, this.y, this.w, this.h, 30)
    
    fill(255)
    stroke(79, 109, 46)
    strokeWeight(7)
    textSize(50)
    text(this.titulo, this.x + this.w/2, this.y + this.h/6)
    
    for (let botao of this.botoes) {
      botao.desenhar()
    }
  }
  
  mover() {
    if (ponto_dentro(mouseX, mouseY, this.x, this.y, this.w, this.h)) {
      if (this.x != this.x_final) {
        this.x = lerp(this.x, this.x_final, 0.1)
      }
    } else {
      if (this.x != this.x_inicial) {
        this.x = lerp(this.x, this.x_inicial, 0.1)
      }
    }
    for (let botao of this.botoes) {
      botao.x = botao.x_inicial + this.x-this.x_final
    }
  }
  
  botoes_press() {
    for (let botao of this.botoes) {
      botao.verificar_press()
    }
  }
}
