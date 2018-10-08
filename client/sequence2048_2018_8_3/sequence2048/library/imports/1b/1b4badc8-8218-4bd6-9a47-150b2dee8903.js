"use strict";
cc._RF.push(module, '1b4ba3IghhL1ppHFQst7okD', 'SeqNotificationCenter');
// Scripts/SeqNotificationCenter.js

"use strict";

/**
 * Created by tuyoo on 2018/8/7.
 */
wxGame.NotificationCenter = {
    events: {},
    listen: function listen(eName, handler, scope) {
        this.events[eName] = this.events[eName] || [];
        this.events[eName].push({
            scope: scope || this,
            handler: handler
        });
    },

    ignore: function ignore(eName, handler, scope) {
        scope = scope || this;
        var fns = this.events[eName];

        if (!fns) return;

        this.events[eName] = fns.filter(function (fn) {
            return fn.scope != scope || fn.handler != handler;
        });
    },
    ignoreScope: function ignoreScope(scope) {
        for (var msg in this.events) {
            var obs = this.events[msg];
            if (obs) {
                this.events[msg] = obs.filter(function (fn) {
                    if (fn.scope != scope) {
                        return true;
                    } else {
                        return false;
                    }
                });
            }
        }
    },
    //
    trigger: function trigger(eventName, params) {
        var fns = this.events[eventName];

        if (!fns) {
            return;
        }

        var fn;

        for (var i = 0; i < fns.length; i++) {

            fn = fns[i];
            // fn.handler.apply(fns.scope, params||[]);
            // 用call直接把各个参数回调出去
            fn.handler.call(fn.scope, params);
        }
    }
};

cc._RF.pop();