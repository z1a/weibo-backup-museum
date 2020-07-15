import { delay } from "./delay"
import { DEBUG } from "../../config"

export class PrintBuffer {
  private buffer: string[] = []
  private revolving = false

  // 60 FPS
  constructor(private printer: (x: string[]) => void, private interval = 16) {}

  public add = (text: string) => {
    this.buffer = this.buffer.concat(text.split(""))
    this.revolve()
  }

  private async revolve() {
    if (this.revolving) {
      return
    }
    this.revolving = true
    while (this.buffer.length > 0) {
      const out = Math.ceil(this.buffer.length / 60)
      this.printer(this.buffer.slice(0, out))
      this.buffer = this.buffer.slice(out)
      await delay(this.interval)
    }
    this.revolving = false
  }
}

export function log(...data: any[]) {
  if (DEBUG) {
    console.log(...data)
  }
}
