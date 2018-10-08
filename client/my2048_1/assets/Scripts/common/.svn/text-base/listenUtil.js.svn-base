listenUtil = {};
//事件管理
listenUtil.eventCtrl = {
    events: {},

    //添加监听
    addListen: function (eName, handler) {
        this.events[eName] = this.events[eName] || [];
        this.events[eName].push(handler);
    },

    //移除监听
    removeListen: function (eName, handler) {
        var fns = this.events[eName];
        if (!fns) {
            return;
        }
        var eventidx = this.events[eName].indexOf(handler);
        this.events[eName].splice(eventidx, 1);
    },

    //触发事件
    trigger: function (eventName, params) {
        var fns = this.events[eventName];
        if (!fns) {
            return;
        }

        var fn;

        for (var i = 0; i < fns.length; i++) {
            fn = fns[i];
            fn(params)
        }
    }
}