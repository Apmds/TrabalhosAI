tamanho_tela = 800
tamanho_casa = 40
n_cells = tamanho_tela/tamanho_casa
let labirinto_menu
let mov_timer
let botao_reiniciar

function labirinto_setup() {
  resizeCanvas(tamanho_tela, tamanho_tela);
  noStroke()
  textAlign(CENTER)
  
  labirinto_menu = 1
  criar_labirinto()
  mov_timer = new Temporizador(0.07, jogador_inputs) // Temporizador que controla o movimento
  botao_reiniciar = new Botao(0, 750, 50, 50, color(30), color(30, 130, 30), texto = "", ICONE_SETA, function () {trocar_menu(1)})
}

function labirinto_draw() {
  switch (labirinto_menu) {
    case 1: // Menu inicial
      background(202, 242, 160)
      fill(129, 237, 102)
      stroke(0)
      strokeWeight(5)
      textSize(55)
      text("O bispo precisa da tua ajuda\npara atacar o rei! Mas ele\nsó se pode movimentar\nnas casas brancas...", 400, 267)
      
      textSize(40)
      strokeWeight(4)
      fill(255, 0, 0)
      text("Clica no espaço para começar", 400, 560)
      
      textSize(23)
      strokeWeight(3)
      fill(255)
      text("(Ignoremos que o bispo só consegue andar na diagonal)", 400, 630)
      if (keyIsDown(32) /*Espaço*/ || keyIsDown(13) /*Enter*/) {
        labirinto_menu = 2
      }
      break
    case 2: // Labirinto
      desenhar_labirinto()
      desenhar_meta()
      desenhar_jogador()

      mov_timer.atualizar()

      if (verificar_vitoria()) {
        labirinto_menu = 3
      }
      break
    case 3: // Menu de vitória
      background(202, 242, 160)
      
      noStroke()
      textSize(100)
      fill(255, 0, 0)
      text("Ganhaste!", width/2, height/2)
      
      fill(0)
      textSize(50)
      text("Clica no R para reiniciar", width/2, height/1.5)
      
      if (keyIsDown(82)) { // R
        jogador_x = 0
        jogador_y = 0
        labirinto_setup()
        labirinto_menu = 1
      }
      break
  }
  
  botao_reiniciar.desenhar()
  botao_reiniciar.verificar_press()
}

// Verifica se o jogador está nas mesmas coordenadas da meta
function verificar_vitoria() {
  return jogador_x == meta_x && jogador_y == meta_y
}
