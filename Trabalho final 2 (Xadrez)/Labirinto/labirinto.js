labirinto = [] // Casas pretas representam-se por 1 e casas brancas representam-se por 0
meta_x = 0
meta_y = 0

function criar_labirinto() {
  // Criação inicial do labirinto
  for (let i = 0; i < n_cells; i++) {
    labirinto[i] = []
    for (let j = 0; j < n_cells; j++) {
      if (i%2 == 0 && j%2==0) {
        labirinto[i][j] = 0
      } else {
        labirinto[i][j] = 1
      }
    }
  }
  
  // Criação dos caminhos para o labirinto
  for (let i = 0; i < n_cells-1; i+=2) {
    for (let j = 0; j < n_cells-1; j+=2) {
      if (int(random(2)) == 1) {
        labirinto[i+1][j] = 0
      } else {
        labirinto[i][j+1] = 0
      }
    }
  }
  
  // Criação da meta
  criar_meta()
}

// Desenha o labirinto
function desenhar_labirinto() {
  noStroke()
  for (let i = 0; i < labirinto.length; i++) {
    for (let j = 0; j < labirinto.length; j++) {
      if (labirinto[i][j] == 1) {
        fill(119, 149, 86)
      } else {
        fill(235, 236, 208)
      }
      square(j*tamanho_casa, i*tamanho_casa, tamanho_casa)
    }
  }
}

// Cria a meta, colocando-a numa posição aleatória
function criar_meta() {
  meta_x = (int(random(n_cells/2)) * 2)
  meta_y = (int(random(n_cells/2)) * 2)
  if (meta_x == jogador_x && meta_y == jogador_y) { // Impede a meta de ser criada em cima do jogador
    criar_meta()
  }
  verificar_meta()
}

// Verifica se o labirinto é resolvível
function verificar_meta() {
  let casas_para_verificar = [createVector(meta_x, meta_y)]
  let casas_verificadas = []
  
  //print("\nNova verficação")
  
  while (casas_para_verificar.length > 0) {
    for (let casa of casas_para_verificar) {
      //print("Casas a verificar: " + casas_para_verificar.length)
      //print(casas_para_verificar)
      //print("X: " + (casa.x) + ", Y: " + (casa.y) + " está a ser verificada")

      if (casa.y != 0) {
        //print("Pode ser verificada em cima.")
        let vetor = createVector(casa.x, casa.y-1)
        if (labirinto[casa.y-1][casa.x] == 0 && !(contemVetor(vetor, casas_verificadas))) {
          //print("X: " + (casa.x) + ", Y: " + (casa.y-1) + " vai para verificação")
          casas_para_verificar[casas_para_verificar.length] = createVector(casa.x, casa.y-1)
        }
      }
      if (casa.y != n_cells-1) {
        //print("Pode ser verificada em baixo.")
        let vetor = createVector(casa.x, casa.y+1)
        if (labirinto[casa.y+1][casa.x] == 0 && !(contemVetor(vetor, casas_verificadas))) {
          //print("X: " + (casa.x) + ", Y: " + (casa.y+1) + " vai para verificação")
          casas_para_verificar[casas_para_verificar.length] = createVector(casa.x, casa.y+1)
        }
      }

      if (casa.x != 0) {
        //print("Pode ser verificada na esquerda.")
        let vetor = createVector(casa.x-1, casa.y)
        if (labirinto[casa.y][casa.x-1] == 0 && !(contemVetor(vetor, casas_verificadas))) {
          //print("X: " + (casa.x-1) + ", Y: " + (casa.y) + " vai para verificação")
          casas_para_verificar[casas_para_verificar.length] = createVector(casa.x-1, casa.y)
        }
      }

      if (casa.x != n_cells-1) {
        //print("Pode ser verificada na direita.")
        let vetor = createVector(casa.x+1, casa.y)
        if (labirinto[casa.y][casa.x+1] == 0 && !(contemVetor(vetor, casas_verificadas))) {
          //print("X: " + (casa.x+1) + ", Y: " + (casa.y) + " vai para verificação")
          casas_para_verificar[casas_para_verificar.length] = createVector(casa.x+1, casa.y)
        }
      }

      casas_verificadas.push(casa)
      casas_para_verificar.splice(casas_para_verificar.indexOf(casa), 1)
      //print(casas_para_verificar.indexOf(casa))
    }
    //print(casas_para_verificar.length)
  }
  
  
  // Se o jogador se encontra em alguma das casas verificadas, então o labirinto é resolvivel
  for (let casa of casas_verificadas) {
    if (casa.x == jogador_x && casa.y == jogador_y) {
        return
    }
  }
  //print("Jogador não encontrado. Recolocando meta.")
  criar_meta() // Colocar a meta noutro sítio se nenhuma casa verificada estiver nas coordenadas do jogador
}

// Desenha a meta
function desenhar_meta() {
  fill(255, 0, 0)
  image(REI_BRANCO, meta_x*tamanho_casa, meta_y*tamanho_casa, tamanho_casa, tamanho_casa)
}

// Verifica se uma array de vetores contém um vetor específico
function contemVetor(vetor, lista) {
    for (let i = 0; i < lista.length; i++) {
        if (lista[i].x == vetor.x && lista[i].y == vetor.y) {
            return true
        }
    }
    return false
}