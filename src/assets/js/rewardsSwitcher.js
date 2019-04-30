export default class rewardsSwitcher {
  constructor() {
    this.item = document.querySelector('.rewards-frame');
    this.button = document.querySelector('.rewards');
    this.button.onclick = this.handleButtonClick.bind(this);
  }

  handleButtonClick() {
    if (this.closed) {
      this.item.classList.add('rewards-frame--opened');
    } else {
      this.item.classList.remove('rewards-frame--opened');
    }
  }
}
