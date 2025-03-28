let botao_voltar_simulador
let botao_salvar
let botao_audio
let botao_posicao_xadrez

let peca_segurada
let criadores_de_pecas = []
let pecas = []
let salvar_estado = false

function xadrez_sim_setup() {
  resizeCanvas(800, 800)
  
  botao_voltar_simulador = new Botao(0, 750, 50, 50, color(30), color(30, 130, 30), texto = "", ICONE_SETA, function () {PUBLICIDADE.stop(); trocar_menu(1)})
  
  botao_salvar = new Botao(700, 730, 90, 60, color(255, 0, 0), color(0), texto = "Salvar", null, function () {salvar_estado = !salvar_estado; if (salvar_estado) {botao_salvar.cor = color(0, 255, 0)} else {botao_salvar.cor = color(255, 0, 0)}})
  
  botao_audio = new Botao(490, 730, 60, 60, color(0), color(0), "", ICONE_SPEAKER, function () {PUBLICIDADE.stop(); PUBLICIDADE.play()})
  
  botao_posicao_xadrez = new Botao(580, 730, 90, 60, color(30), color(30, 130, 30), "Jogo", null, posicao_xadrez)
  
  if (salvar_estado) {
    botao_salvar.cor = color(0, 255, 0)
  } else {
    botao_salvar.cor = color(255, 0, 0)
  }
  
  if (!salvar_estado) {
    pecas = []
  }
  
  criadores_de_pecas = [
    new Peca_generator(640, 100, 75, 75, REI_BRANCO),
    new Peca_generator(720, 100, 75, 75, REI_PRETO),
  
    new Peca_generator(640, 200, 75, 75, RAINHA_BRANCA),
    new Peca_generator(720, 200, 75, 75, RAINHA_PRETA),

    new Peca_generator(640, 300, 75, 75, TORRE_BRANCA),
    new Peca_generator(720, 300, 75, 75, TORRE_PRETA),

    new Peca_generator(640, 400, 75, 75, BISPO_BRANCO),
    new Peca_generator(720, 400, 75, 75, BISPO_PRETO),

    new Peca_generator(640, 500, 75, 75, CAVALO_BRANCO),
    new Peca_generator(720, 500, 75, 75, CAVALO_PRETO),

    new Peca_generator(650, 600, 60, 75, PEAO_BRANCO),
    new Peca_generator(730, 600, 60, 75, PEAO_PRETO),
  ]
}

function xadrez_sim_draw() {
  background(202, 242, 160)
  
  textSize(70)
  fill(129, 237, 102)
  text("Simulador de xadrez", 400, 70)
  
  stroke(0)
  strokeWeight(8)
  square(30, 100, 600)
  noStroke()
  for (let i=0; i<8; i++) {
    for (let j=0; j<8; j++) {
      if ((i+j) % 2 == 0) {
        fill(235, 236, 208)
      } else {
        fill(119, 149, 86)
      }
      square(i*75 + 30, j*75 + 100, 75)
    }
  }
  
  for (let criador of criadores_de_pecas) {
    criador.desenhar()
    criador.nova_peca()
  }
  
  for (let peca of pecas) {
    peca.desenhar()
    peca.verificar_segurada()
    if (peca.segurada) {
      pecas.splice(pecas.indexOf(peca), 1)
      peca_segurada = peca
      continue
    }
    if (peca.x>630 || peca.x < 30 || peca.y>700 || peca.y < 100) {
      pecas.splice(pecas.indexOf(peca), 1)
    }
  }
  
  if (peca_segurada != null) {
    peca_segurada.desenhar()
    peca_segurada.mover()
    peca_segurada.verificar_segurada()
    if (!peca_segurada.segurada) {
      pecas.push(peca_segurada)
      peca_segurada = null
    }
  }
  
  botao_salvar.desenhar()
  botao_salvar.verificar_press()
  
  botao_posicao_xadrez.desenhar()
  botao_posicao_xadrez.verificar_press()
  
  botao_audio.desenhar()
  botao_audio.verificar_press()
    
  botao_voltar_simulador.desenhar()
  botao_voltar_simulador.verificar_press()
}

function posicao_xadrez() {
  pecas = []
  pecas.push(new Peca(60, 130, 60, 60, TORRE_PRETA))
  pecas.push(new Peca(600, 130, 60, 60, TORRE_PRETA))
  pecas.push(new Peca(60, 660, 60, 60, TORRE_BRANCA))
  pecas.push(new Peca(600, 660, 60, 60, TORRE_BRANCA))
  
  pecas.push(new Peca(140, 130, 60, 60, CAVALO_PRETO))
  pecas.push(new Peca(510, 130, 60, 60, CAVALO_PRETO))
  pecas.push(new Peca(140, 660, 60, 60, CAVALO_BRANCO))
  pecas.push(new Peca(510, 660, 60, 60, CAVALO_BRANCO))
  
  pecas.push(new Peca(220, 130, 60, 60, BISPO_PRETO))
  pecas.push(new Peca(440, 130, 60, 60, BISPO_PRETO))
  pecas.push(new Peca(220, 660, 60, 60, BISPO_BRANCO))
  pecas.push(new Peca(440, 660, 60, 60, BISPO_BRANCO))
  
  pecas.push(new Peca(290, 130, 60, 60, RAINHA_PRETA))
  pecas.push(new Peca(370, 130, 60, 60, REI_PRETO))
  
  pecas.push(new Peca(290, 660, 60, 60, RAINHA_BRANCA))
  pecas.push(new Peca(370, 660, 60, 60, REI_BRANCO))
  
  for (let i = 0; i < 8; i++) {
    pecas.push(new Peca(80*i + 60, 215, 45, 60, PEAO_PRETO))
    pecas.push(new Peca(80*i + 60, 580, 45, 60, PEAO_BRANCO))
  }
  
  // Corrige as posições das peças (porque dá muito trabalho manualmente)
  for (let peca of pecas) {
    peca.x = 2 + ((70-peca.w)/2) + 30 + (Math.round((peca.x-50-(peca.w/2))/75) * 75)
    peca.y = 2 + ((70-peca.h)/2) + 100 + (Math.round((peca.y-100-(peca.h/2))/75) * 75)
  }
  
}

class Peca_generator {
  constructor(x, y, w, h, img) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.img = img
    
  }
  desenhar() {
    image(this.img, this.x, this.y, this.w, this.h)
  }
  nova_peca() {
    if (rato_pressionado && this.x<mouseX && this.x+this.w>mouseX && this.y<mouseY && this.y+this.h>mouseY) {
      if (this.img == PEAO_PRETO || this.img == PEAO_BRANCO) {
        peca_segurada = new Peca(mouseX, mouseY, 45, 60, this.img)
      } else {
        peca_segurada = new Peca(mouseX, mouseY, 60, 60, this.img)
      }
      peca_segurada.segurada = true
    }
  }
}

class Peca {
  constructor(x, y, w, h, img) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.img = img
    this.segurada = false
  }
  desenhar() {
    image(this.img, this.x, this.y, this.w, this.h)
  }
  mover() {
    if (this.segurada) {
      this.x = mouseX - this.w/2
      this.y = mouseY - this.h/2
    }
  }
  verificar_segurada() {
    if (rato_pressionado && !this.segurada && this.x<mouseX && this.x+this.w>mouseX && this.y<mouseY && this.y+this.h>mouseY) {
      this.segurada = true
      this.x = mouseX - this.w/2
      this.y = mouseY - this.h/2
      rato_pressionado = false
      return
    }
    
    if (rato_largado && this.segurada) {
      this.segurada = false
      this.x = 2 + ((70-this.w)/2) + 30 + (Math.round((mouseX-50-(this.w/2))/75) * 75)
      this.y = 2 + ((70-this.h)/2) + 100 + (Math.round((mouseY-100-(this.h/2))/75) * 75)
    }
  }
}