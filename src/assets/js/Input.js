function checkInput(input, placeholder) {
  if (input.value === '') {
    placeholder.classList.remove(`${placeholder.classList[0]}--top`);
  } else {
    placeholder.classList.add(`${placeholder.classList[0]}--top`);
  }
}

export default class Input {
  constructor(opts) {
    this.inputsAndPlaceholders = opts;

    this.listen();
  }

  listen() {
    for (let i = 0; i < this.inputsAndPlaceholders.length; i += 1) {
      const { input } = this.inputsAndPlaceholders[i];
      const { placeholder } = this.inputsAndPlaceholders[i];
      input.oninput = checkInput.bind(this, input, placeholder);
    }
  }

  manuallyCheck() {
    for (let i = 0; i < this.inputsAndPlaceholders.length; i += 1) {
      const { input } = this.inputsAndPlaceholders[i];
      const { placeholder } = this.inputsAndPlaceholders[i];
      checkInput(input, placeholder);
    }
  }
}
