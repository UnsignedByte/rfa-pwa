/*
* @Author: UnsignedByte
* @Date:   11:16:06, 06-Jun-2020
* @Last Modified by:   UnsignedByte
* @Last Modified time: 11:19:22, 06-Jun-2020
*/

export default class RequestQueue {
  static queue = [];
  static pending = false;

  static push(promise) {
    return new Promise((resolve, reject) => {
        this.queue.push({promise,resolve,reject});
        this.dq();
    });
  }

	static dq() {
    if (this.working) {
      return false;
    }
    const item = this.queue.shift();
    if (!item) {
      return false;
    }
    this.working = true;
      item.promise()
      .then(val => {
        this.working = false;
        item.resolve(val);
        this.dq();
      })
      .catch(err => {
        this.working = false;
        item.reject(err);
        this.dq();
      })
    return true;
  }
}