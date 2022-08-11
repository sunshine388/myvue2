let id = 0;
class Dep {
  constructor() {
    this.id = id++;
    this.subs = [];
  }
  depend() {
    this.subs.push(Dep.target);
    console.log(this.subs);
  }
}

Dep.target = null;

export default Dep;
