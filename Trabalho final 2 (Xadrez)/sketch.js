// Bloquear a abertura do menu com o clique direito
document.oncontextmenu = function() {
  return false;
}

rato_largado = false
rato_pressionado = false
menu = 1

function preload() {
  BISPO_PRETO = loadImage("Peças/Bispo_preto.png")
  REI_PRETO = loadImage("Peças/Rei_preto.png")
  TORRE_PRETA = loadImage("Peças/Torre_preta.png")
  RAINHA_PRETA = loadImage("Peças/Rainha_preta.png")
  CAVALO_PRETO = loadImage("Peças/Cavalo_preto.png")
  PEAO_PRETO = loadImage("Peças/Peao_preto.png")
  
  BISPO_BRANCO = loadImage("Peças/Bispo_branco.png")
  REI_BRANCO = loadImage("Peças/Rei_branco.png")
  TORRE_BRANCA = loadImage("Peças/Torre_branca.png")
  RAINHA_BRANCA = loadImage("Peças/Rainha_branca.png")
  CAVALO_BRANCO = loadImage("Peças/Cavalo_branco.png")
  PEAO_BRANCO = loadImage("Peças/Peao_branco.png")
  
  ICONE_SPEAKER = loadImage("Outras Imagens/Icone_speaker.png")
  ICONE_SETA = loadImage("Outras Imagens/Icone_seta.png")
  DIFERENCAS_XADREZ = loadImage("Diferenças/Imagens/Diferenças_xadrez.png")
  DIFERENCAS_ESCOLA = loadImage("Diferenças/Imagens/Diferenças_escola.png")
  DIFERENCAS_MONICA = loadImage("Diferenças/Imagens/Diferenças_monica.jpg")
  FUNDO_PECAS = loadImage("Outras Imagens/Fundo_peças.png")
  fonte = loadFont("Boldena.ttf")
  
  PUBLICIDADE = loadSound("Publicidade.mp3")
  
  gif = createImg("Movimento_peças.gif", "")
  gif.hide()
}

function setup() {
  createCanvas(800, 800)
  angleMode(DEGREES)
  textAlign(CENTER)
  textFont(fonte)
  trocar_menu(menu)
}

function draw() {
  switch (menu) {
    case 1:
      menu_inicial()
      break
    case 2:
      labirinto_draw()
      break
    case 3:
      diferencas_draw()
      break
    case 4:
      xadrez_sim_draw()
      break
  }
  
  rato_largado = false
  rato_pressionado = false
}

function trocar_menu(novo_menu) {
  switch (novo_menu) {
    case 1:
      menu_inicial_setup()
      break
    case 2:
      labirinto_setup()
      break
    case 3:
      diferencas_setup()
      break
    case 4:
      xadrez_sim_setup()
      break
  }
  menu = novo_menu
}

function mouseReleased() {
  rato_largado = true
}

function mousePressed() {
  rato_pressionado = true
  print(mouseX, mouseY)
}