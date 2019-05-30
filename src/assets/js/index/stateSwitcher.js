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
  const { buttonList } = opts;

  const itemClassList = itemList.map(
    (item, index) =>
      `${item.classList[item.classList.length - 1]}--${
        opts.itemClassList[index]
      }`
  );

  const { onTrue } = opts;
  const { onFalse } = opts;

  let { state } = opts;

  function handleClick(e) {
    e.preventDefault();
    state === true
      ? onTrue(itemList, itemClassList)
      : onFalse(itemList, itemClassList);
    state = !state;
  }

  buttonList.forEach(button => (button.onclick = handleClick));
}
