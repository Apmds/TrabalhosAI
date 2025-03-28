let diferencas_mon
let n_diferencas_mon

function monica_setup() {
  resizeCanvas(600, 450);
  textAlign(CENTER)
  diferencas_mon = [false, false, false, false, false, false, false]
  n_diferencas_mon = 0
}

function monica_draw() {
  background(220);
  image(DIFERENCAS_MONICA, 0, 0, 244*1.33, 300*1.33)  
  fill(0)
  noStroke()
  textSize(20)
  text("Procura as 7 diferenças!", 460, 70)
  text("Diferenças encontradas: " + n_diferencas_mon, 460, 370)
  if (n_diferencas_mon == diferencas_mon.length) {
    textSize(18)
    text("Parabéns meu puto!\nMais fácil que isto é impossível.\nDevias estar a fazer diferenças\npara a tua idade!", 460, 200)
  }
  noFill()
  strokeWeight(3)
  stroke(77, 35, 3)
  
  if (diferencas_mon[0]) {circle(215,336,30); circle(215,136,30)} // Farol
  if (diferencas_mon[1]) {circle(250,333,30); circle(250,133,30)} // Água
  if (diferencas_mon[2]) {circle(280,300,30); circle(280,95,30)} // Nuvem pequena
  if (diferencas_mon[3]) {circle(50,233,40); circle(50,33,40)} // Nuvem grande
  if (diferencas_mon[4]) {circle(250,380,60); circle(250,180,60)} // Risco da estrada
  if (diferencas_mon[5]) {circle(25,355,25); circle(25,155,25)} // Fumo do carro
  if (diferencas_mon[6]) {circle(130,370,30); circle(130,170,30)} // Textura da roda
  
  if (rato_largado) {
    if (!diferencas_mon[0] && (dist(mouseX,mouseY, 215,336) < 15 || dist(mouseX,mouseY, 215,136) < 15)) { // Farol
      diferencas_mon[0] = true
      n_diferencas_mon++
    }
    if (!diferencas_mon[1] && (dist(mouseX,mouseY, 250,333) < 15 || dist(mouseX,mouseY, 250,133) < 15)) { // Água
      diferencas_mon[1] = true
      n_diferencas_mon++
    }
    if (!diferencas_mon[2] && (dist(mouseX,mouseY, 280,300) < 15 || dist(mouseX,mouseY, 280, 95) < 15)) { // Nuvem pequena
      diferencas_mon[2] = true
      n_diferencas_mon++
    }
    if (!diferencas_mon[3] && (dist(mouseX,mouseY, 50,233) < 20 || dist(mouseX,mouseY, 50,33) < 20)) { // Nuvem grande
      diferencas_mon[3] = true
      n_diferencas_mon++
    }
    if (!diferencas_mon[4] && (dist(mouseX,mouseY, 250,380) < 30 || dist(mouseX,mouseY, 250,180) < 30)) { // Risco da estrada
      diferencas_mon[4] = true
      n_diferencas_mon++
    }
    if (!diferencas_mon[5] && (dist(mouseX,mouseY, 25,355) < 15 || dist(mouseX,mouseY, 25,155) < 15)) { // Fumo do carro
      diferencas_mon[5] = true
      n_diferencas_mon++
    }
    if (!diferencas_mon[6] && (dist(mouseX,mouseY, 130,370) < 15 || dist(mouseX,mouseY, 130,170) < 15)) { // Textura da roda
      diferencas_mon[6] = true
      n_diferencas_mon++
    }
  }
}
