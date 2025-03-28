// 1 é o menu para escolher, 2 é o jogo da turma da mónica, 3 é o jogo da escola e 4 é o jogo do xadrez
let diferencas_menu = 1
let botao_voltar_dif
let bt_dif1

function diferencas_setup() {
  diferencas_menu = 1
  resizeCanvas(800, 800)
  botao_voltar_dif = new Botao(0, 750, 50, 50, color(30), color(30, 130, 30), texto = "", ICONE_SETA, function () {trocar_menu(1)})
  
  bt_dif1 = new Botao(100, 500, 200, 100, color(30), color(30, 130, 30), texto = "Mónica", null, function () {trocar_diferencas_menu(2)})
  bt_dif2 = new Botao(500, 500, 200, 100, color(30), color(30, 130, 30), texto = "Escola", null, function () {trocar_diferencas_menu(3)})
  bt_dif3 = new Botao(300, 300, 200, 100, color(30), color(30, 130, 30), texto = "Xadrez", null, function () {trocar_diferencas_menu(4)})
}

function diferencas_draw() {
  switch (diferencas_menu) {
    case 1:
      
      background(202, 242, 160)
      textSize(50)
      fill(129, 237, 102)
      text("DIFERENÇAS", width/2, height/5)
      
      bt_dif1.desenhar()
      bt_dif1.verificar_press()
      bt_dif2.desenhar()
      bt_dif2.verificar_press()
      bt_dif3.desenhar()
      bt_dif3.verificar_press()
      break
    case 2:
      monica_draw()
      break
    case 3:
      escola_draw()
      break
    case 4:
      xadrez_dif_draw()
      break
  }
  botao_voltar_dif.desenhar()
  botao_voltar_dif.verificar_press()
}

function trocar_diferencas_menu(novo_menu) {
  switch (novo_menu) {
    case 1:
      botao_voltar_dif.func = function () {trocar_menu(1)}
      botao_voltar_dif.y = 750
      resizeCanvas(800, 800)
      break
    case 2:
      monica_setup()
      botao_voltar_dif.func = function () {trocar_diferencas_menu(1)}
      botao_voltar_dif.y = 400
      break
    case 3:
      escola_setup()
      botao_voltar_dif.func = function () {trocar_diferencas_menu(1)}
      botao_voltar_dif.y = 550
      break
    case 4:
      xadrez_dif_setup()
      botao_voltar_dif.func = function () {trocar_diferencas_menu(1)}
      botao_voltar_dif.y = 650
      break
  }
  diferencas_menu = novo_menu
}