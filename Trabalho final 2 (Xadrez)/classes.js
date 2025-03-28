// Botão
class Botao {
  constructor(x = 0, y = 0, w = 10, h = 10, cor = color(255), outline = color(0), texto = "Botão", icone = null, func = function() {}) {
    this.x = x
    this.x_inicial = x
    this.y = y
    this.w = w
    this.h = h
    this.texto = texto
    this.func = func
    this.icone = icone
    this.pressionado = false // Valor torna-se verdadeiro quando o rato é largado em cima do botão
    this.cor = cor
    this.outline = outline
    
  }
  
  desenhar() {
    if (this.icone == null) {
      strokeWeight(5)
      stroke(this.outline)
      fill(this.cor)
      rect(this.x, this.y, this.w, this.h)
    } else {
      image(this.icone, this.x, this.y, this.w, this.h)
    }
    
    textSize((25*this.h)/70)
    fill(255)
    stroke(0)
    strokeWeight(3)
    text(this.texto, this.x + this.w/2, this.y + this.h/1.7)
  }
  
  verificar_press() {
    this.pressionado = (mouseButton == LEFT && rato_largado && mouseX > this.x && mouseX < this.x+this.w && mouseY > this.y && mouseY < this.y+this.h)
    if (this.pressionado) {
      this.func()
    }
  }
}

// Temporizador
class Temporizador {
  constructor(tempo = 1, func = function () {}) {
    this.tempo_total = tempo
    this.tempo_atual = this.tempo_total
    this.funcao = func
  }
  atualizar(reiniciar_ao_terminar = true) {
    this.tempo_atual -= deltaTime / 1000
    if (this.tempo_atual <= 0) {
      this.funcao()
      if (reiniciar_ao_terminar) {
        this.reiniciar()
      }
    }
  }
  reiniciar() {
    this.tempo_atual = this.tempo_total
  }
}
