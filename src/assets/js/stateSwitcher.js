// export default class StateSwitcher {
//   constructor(opts) {
//     this.item = opts.item;
//     this.button = opts.button;

//     opts.defaultState === true ? (this.state = true) : (this.state = false);

//     this.onTrue = opts.onTrue.bind(this);
//     this.onFalse = opts.onFalse;

//     this.button.onclick = this.handleClick.bind(this);
//   }

//   handleClick() {
//     this.state === true ? this.onTrue() : this.onFalse();
//     this.state = !this.state;
//   }
// }

export default function StateSwitcher(opts) {
  const { itemList } = opts;
  const { button } = opts;

  const { onTrue } = opts;
  const { onFalse } = opts;

  let state = false;
  if (opts.defaultState === true) state = true;
  function handleClick() {
    console.log('click');
    state === true ? onTrue(itemList) : onFalse(itemList);
    state = !state;
  }

  button.onclick = handleClick;
}
