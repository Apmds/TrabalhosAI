let diferencas_esc
let n_diferencas_esc

function escola_setup() {
  resizeCanvas(800, 600);
  textAlign(CENTER)
  diferencas_esc = [false, false, false, false, false, false, false]
  n_diferencas_esc = 0
}

function escola_draw() {
  background(255);
  image(DIFERENCAS_ESCOLA, 0, 0, 800, 400)  
  fill(245, 240, 150)
  stroke(40, 40, 40)
  strokeWeight(3)
  textSize(30)
  text("Procura as 7 diferenças!", 185, 530)
  text("Diferenças encontradas: " + n_diferencas_esc, 200, 460)
  if (n_diferencas_esc == diferencas_esc.length) {
    textSize(30)
    text("Muitos parabéns!\nEste desafio deve ter sido\nbem difícil(especialmente\nencontrar o Lucas).", 590, 460)
  }
  noFill()
  strokeWeight(3)
  stroke(77, 35, 3)
  
  if (diferencas_esc[0]) {circle(186,202,36); circle(592,202,36)} // Poste
  if (diferencas_esc[1]) {circle(60,193,30); circle(466,193,30)} // Pássaro
  if (diferencas_esc[2]) {circle(82,376,30); circle(488,376,30)} // Madeira 1
  if (diferencas_esc[3]) {circle(96,324,30); circle(502,324,30)} // Madeira 2
  if (diferencas_esc[4]) {circle(120,303,30); circle(526,303,30)} // Lagarta
  if (diferencas_esc[5]) {circle(295,273,25); circle(697,273,25)} // Planta do pneu
  if (diferencas_esc[6]) {circle(327,240,30); circle(733,240,30)} // Lucas Dias
  
  if (rato_largado) {
    if (!diferencas_esc[0] && (dist(mouseX,mouseY, 186,202) < 18 || dist(mouseX,mouseY, 592, 202) < 18)) { // Poste
      diferencas_esc[0] = true
      n_diferencas_esc++
    }
    if (!diferencas_esc[1] && (dist(mouseX,mouseY, 60,193) < 15 || dist(mouseX,mouseY, 466,193) < 15)) { // Pássaro
      diferencas_esc[1] = true
      n_diferencas_esc++
    }
    if (!diferencas_esc[2] && (dist(mouseX,mouseY, 82,376) < 15 || dist(mouseX,mouseY, 488, 376) < 15)) { // Madeira 1
      diferencas_esc[2] = true
      n_diferencas_esc++
    }
    if (!diferencas_esc[3] && (dist(mouseX,mouseY, 96,324) < 15 || dist(mouseX,mouseY, 502,324) < 15)) { // Madeira 2
      diferencas_esc[3] = true
      n_diferencas_esc++
    }
    if (!diferencas_esc[4] && (dist(mouseX,mouseY, 120,303) < 15 || dist(mouseX,mouseY, 526,303) < 15)) { // Lagarta
      diferencas_esc[4] = true
      n_diferencas_esc++
    }
    if (!diferencas_esc[5] && (dist(mouseX,mouseY, 295,273) < 15 || dist(mouseX,mouseY, 697,273) < 15)) { // Planta no pneu
      diferencas_esc[5] = true
      n_diferencas_esc++
    }
    if (!diferencas_esc[6] && (dist(mouseX,mouseY, 327,240) < 15 || dist(mouseX,mouseY, 733,240) < 15)) { // Lucas Dias
      diferencas_esc[6] = true
      n_diferencas_esc++
    }
  }
}
