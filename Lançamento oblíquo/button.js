// Button
class Button {
  constructor(x = 0, y = 0, w = 10, h = 10, fill_color = color(255), outline = color(0), text = "Button", final_size = 1, icon = null, func = function() {}) {
    this.x = x
    this.y = y
    
    this.start_w = w
    this.start_h = h
    this.w = w
    this.h = h
    this.final_size = final_size
    
    this.text = text
    this.func = func
    this.icon = icon
    
    this.hovered = false
    this.pressed = false
    
    this.fill_color = fill_color
    this.outline = outline
    this.text_color = color(255)
    this.text_size_offset = 0
    this.text_has_outline = true
  }
  
  draw() {
    if (this.icon == null) {
      strokeWeight(5); stroke(this.outline)
      if (this.hovered) {
        fill(this.fill_color.levels[0]*0.6, this.fill_color.levels[1]*0.6, this.fill_color.levels[2]*0.6, this.fill_color.levels[3])
      } else {
        fill(this.fill_color)
      }
      rectMode(CENTER)
      rect(this.x, this.y, this.w, this.h, 15)
      rectMode(CORNER)
    } else {
      if (this.hovered) {
        tint(200)
      }
      imageMode(CENTER)
      image(this.icon, this.x, this.y, this.w, this.h)
      imageMode(CORNER)
      noTint()
    }
    
    textSize((25*this.h)/70 + this.text_size_offset); textAlign(CENTER, CENTER); fill(this.text_color); stroke(0); strokeWeight(3)
    if (!this.text_has_outline) {
      noStroke()
    }
    text(this.text, this.x, this.y)
    textAlign(CENTER, BASELINE)
  }
  
  check_press() {
    this.hovered = (mouseX > this.x-(this.w/2) && mouseX < this.x+this.w-(this.w/2) && mouseY > this.y-(this.h/2) && mouseY < this.y+this.h-(this.h/2))
    if (this.hovered) {
      this.w = lerp(this.w, this.start_w*this.final_size, 0.1)
      this.h = lerp(this.h, this.start_h*this.final_size, 0.1)
    } else {
      this.w = lerp(this.w, this.start_w, 0.1)
      this.h = lerp(this.h, this.start_h, 0.1)
    }
    
    this.pressed = (mouseButton == LEFT && mouse_released && this.hovered)
    if (this.pressed) {
      this.func()
    }
  }
}
