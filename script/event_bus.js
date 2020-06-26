class EvenBus {

    constructor() {
        this.events = {};
    }

    $on(id, callback) {
        let callbackList = this.events[id];
        if (callbackList) {
            let duplicate = false;
            for (let i = 0; i < callbackList.length; i++) {
                if (callbackList[i] == callback) {
                    duplicate = true;
                    break;
                }
            }
            if (!duplicate) {
                this.events[id].push(callback);
            }
        } else {
            this.events[id] = [callback];
        }
    }

    $emit(id, ...vars) {
        let callbackList = this.events[id];
        if (callbackList) {
            for (let i = 0; i < callbackList.length; i++) {
                callbackList[i](...vars);
            }
        }
    }
}