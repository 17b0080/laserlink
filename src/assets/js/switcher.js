class Switch {
  constructor(opts) {
    this.button = opts.button;
    this.item = opts.item;
    this.open = opts.open;
    this.close = opts.close;
    this.state = false;
  }
  listen() {
    this.button.onclick = () => {
      if (this.state) {
        this.close();
        this.state = false;
      } else {
        this.open();
        this.state = true;
      }
    };
  }
}

export default Switch;
