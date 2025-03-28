let diferencas_xadrez
let dif_obtidas
let x_offset = 450 // Valor que é adicionado ao x para verificar o lado direito das diferenças
let fundo_valor = -50
let ampliacao

let mov = false

function xadrez_dif_setup() {
  resizeCanvas(900, 700)
  
  dif_obtidas = 0
  ampliacao = 1
  diferencas_xadrez = []
  diferencas_xadrez.push(new Diferenca(43, 33, 15)) // Carro
  diferencas_xadrez.push(new Diferenca(315, 175, 15)) // Peão preto
  diferencas_xadrez.push(new Diferenca(270, 125, 20)) // Números dos livros
  diferencas_xadrez.push(new Diferenca(372, 61, 23)) // Letreiro
  diferencas_xadrez.push(new Diferenca(211, 220, 20)) // Peão branco
  diferencas_xadrez.push(new Diferenca(286, 168, 14)) // Torre 
}

function xadrez_dif_draw() {
  background(202, 242, 160)
  
  tint(255, 255, 255, 100)
  image(FUNDO_PECAS, fundo_valor, fundo_valor)
  tint(255)
  
  fundo_valor -= 1
  if (fundo_valor == -1181) {
    fundo_valor = -50
  }
  
  image(DIFERENCAS_XADREZ, 0, 0, 903, 344)
  
  noFill()
  strokeWeight(3)
  square(mouseX-ampliacao*100/2, mouseY-ampliacao*100/2, ampliacao*100)
  square(680, 480, 200)
  image(DIFERENCAS_XADREZ, 680, 480, 200, 200, (mouseX-ampliacao*100/2)*2.32, (mouseY-ampliacao*100/2)*2.32, ampliacao*100*2.32, ampliacao*100*2.32)
  
  for (let dif of diferencas_xadrez) {
    if (dif.descoberta) {
      dif.desenhar()
    }
    dif.verificar_press()
  }
  
  // Controlo da ampliação
  if (rato_largado && mouseButton == CENTER) {
    ampliacao -= 0.25
    if (ampliacao < 0.5) {
      ampliacao = 1
    }
  }
  
  // Texto
  noStroke()
  fill(0)
  textSize(20)
  text("Usa o botão central do rato\npara aumentar o zoom.", 770, 450)
  
  stroke(0)
  strokeWeight(4)
  fill(255)
  textSize(30)
  text("Diferenças:", 150, 390)
  
  textAlign(LEFT)
  let t = ""
  if (diferencas_xadrez[0].descoberta) {
    t = "Carro"
  }
  text("1: " + t, 75, 450)
  t = ""
  
  if (diferencas_xadrez[1].descoberta) {
    t = "Peão preto"
  }
  text("2: " + t, 75, 550)
  t = ""
  
  if (diferencas_xadrez[2].descoberta) {
    t = "Números dos livros"
  }
  text("3: " + t, 75, 650)
  t = ""
  
  if (diferencas_xadrez[3].descoberta) {
    t = "Letreiro"
  }
  text("4: " + t, 285, 450)
  t = ""
  
  if (diferencas_xadrez[4].descoberta) {
    t = "Peão branco"
  }
  text("5: " + t, 285, 550)
  t = ""
  
  if (diferencas_xadrez[5].descoberta) {
    t = "Torre"
  }
  text("6: " + t, 475, 450)
  
  textAlign(CENTER)
  if (diferencas_xadrez.length == dif_obtidas) {
    textSize(40)
    stroke(255, 30, 30)
    fill(255, 0, 0)
    text("PARABÉNS", 530, 670)
  }
}

class Diferenca {
  constructor(x = 0, y = 0, r = 10) {
    this.x = x
    this.y = y
    this.raio = r
    this.descoberta = false
  }
  
  desenhar() {
    stroke(220, 0, 0)
    strokeWeight(this.raio/5)
    noFill()
    
    circle(this.x, this.y, this.raio*2)
    circle(this.x + x_offset, this.y, this.raio*2)
  }
  
  verificar_press() {
    if (mouseButton == LEFT && rato_largado && !this.descoberta && (dist(mouseX, mouseY, this.x, this.y) <= this.raio || dist(mouseX, mouseY, this.x+ x_offset, this.y) <= this.raio)) {
      this.descoberta = true
      dif_obtidas++
    }
  }
}
