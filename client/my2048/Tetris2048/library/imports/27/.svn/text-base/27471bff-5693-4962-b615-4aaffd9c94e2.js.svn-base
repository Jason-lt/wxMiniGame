"use strict";
cc._RF.push(module, '27471v/VpNJYrYVSq/9nJTi', 'itemSound');
// Scripts/ui/itemSound.js

"use strict";

// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        sound: {
            default: null,
            type: cc.AudioSource
        }
    },

    start: function start() {
        var self = this;
        this.node.runAction(cc.sequence(cc.delayTime(2), cc.callFunc(function () {
            self.destoryThis();
        })));
    },


    destoryThis: function destoryThis() {
        this.destroy();
        this.node.parent.removeChild(this);
    }
});

cc._RF.pop();