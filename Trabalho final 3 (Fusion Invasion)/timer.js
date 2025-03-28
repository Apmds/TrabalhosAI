// Timer
class Timer {
  constructor(time = 1, func = function () {}) {
    this.total_time = time
    this.current_time = this.total_time
    this.func = func
  }
  
  update(restart_on_end = true) {
    this.current_time -= deltaTime / 1000
    if (this.current_time <= 0) {
      this.func()
      if (restart_on_end) {
        this.restart()
      }
    }
  }
  
  restart() {
    this.current_time = this.total_time
  }
}
