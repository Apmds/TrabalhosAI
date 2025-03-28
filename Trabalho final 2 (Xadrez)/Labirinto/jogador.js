jogador_x = 0
jogador_y = 0

// Desenha o jogador
function desenhar_jogador() {
  fill(0, 255, 0)
  image(BISPO_PRETO, jogador_x*tamanho_casa, jogador_y*tamanho_casa, tamanho_casa, tamanho_casa)
}

// Trata do movimento do jogador
function jogador_inputs() {
  // "W" e seta para cima
  if ((keyIsDown(87) || keyIsDown(38)) && jogador_y > 0) {
    if (labirinto[jogador_y-1][jogador_x] != 1) { // Apenas executar se o jogador se existir chão em cima
      jogador_y--
    }
  }
  
  // "S" e seta para baixo
  if ((keyIsDown(83) || keyIsDown(40)) && jogador_y < n_cells-1) { 
    if (labirinto[jogador_y+1][jogador_x] != 1) { // Apenas executar se o jogador se existir chão em baixo
      jogador_y++
    }
  }
  
  // "A" e seta para a esquerda
  if ((keyIsDown(65) || keyIsDown(37)) && jogador_x > 0) { 
    if (labirinto[jogador_y][jogador_x-1] != 1) { // Apenas executar se o jogador se existir chão na esquerda
      jogador_x--
    }
  }
  
  // "D" e seta para a direita
  if ((keyIsDown(68) || keyIsDown(39)) && jogador_x < n_cells-1) { 
    if (labirinto[jogador_y][jogador_x+1] != 1) { // Apenas executar se o jogador se existir chão na direita
      jogador_x++
    }
  }
}