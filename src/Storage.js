export default class Storage {

  constructor() {
    this.load();
  }

  static defaultStorage = {
    session: null
  };

  static dataStore = null;

  static load() {
    const storage = localStorage.getItem('DooBeeAuth');

    if (storage) {
      this.dataStore = JSON.parse(storage);
      return this.dataStore;
    }

    this.dataStore = this.defaultStorage;
    return this.dataStore;
  }

  static del() {
    localStorage.removeItem('DooBeeAuth');
  }

  static save() {
    localStorage.setItem('DooBeeAuth', JSON.stringify(this.dataStore));
  }

  static get(option) {
    if (!this.dataStore) {
      this.load();
    }
    return this.dataStore[option];
  }

  static set(option, value) {
    if (!this.dataStore) {
      this.load();
    }
    this.dataStore[option] = value;
    this.save();
  }
}
