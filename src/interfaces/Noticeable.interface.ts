abstract class Noticeable {
  #_isChecked: Boolean = false;

  check() {
    this.#_isChecked = true;
  }

  get isChecked() {
    return this.#_isChecked;
  }
}

export default Noticeable;
