/* globals document */
export default class InputSwitcher {
  constructor(opts) {
    this.phone = opts.phone;
    this.mail = opts.mail;

    this.phoneForm = document.querySelector('form.phone-form');
    this.mailForm = document.querySelector('form.email-form');

    this.phone.onclick = this.handlePhoneClick.bind(this);
    this.mail.onclick = this.handleMailClick.bind(this);
  }

  handlePhoneClick() {
    this.phoneForm.classList.remove(`${this.phoneForm.classList[0]}--right`);
    this.mailForm.classList.add(`${this.mailForm.classList[0]}--left`);
  }

  handleMailClick() {
    this.phoneForm.classList.add(`${this.phoneForm.classList[0]}--right`);
    this.mailForm.classList.remove(`${this.mailForm.classList[0]}--left`);
  }
}
