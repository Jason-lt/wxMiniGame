"use strict";
cc._RF.push(module, '13c8bLoIxNJd6hxiaJl5vN4', 'flyNum');
// Scripts/view/flyNum.js

'use strict';

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
        num: 0,
        numlabel: {
            default: null,
            type: cc.Label
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start: function start() {},


    toPosition: function toPosition(score) {
        var self = this;
        var curPos = this.node.getPosition();
        this.node.stopAllActions();
        this.node.setScale(0.5, 0.5);
        //先放大
        var action1 = cc.scaleTo(0.3, 1, 1);
        this.node.runAction(action1);

        //再上移
        var finished = cc.callFunc(this.finished, this);
        var action2 = cc.moveTo(0.5, cc.p(this.node.getPosition().x, this.node.getPosition().y + 150));
        var myAction = cc.sequence(action2, finished);
        this.node.runAction(myAction);
        this.node.setLocalZOrder(10000);
    },

    setNum: function setNum(_num) {
        this.num = _num;
        var extraStr = "";
        if (Global.combineTimes > 1) {
            extraStr = 'x' + Global.combineTimes;
        }
        this.numlabel.string = _num + '' + extraStr;
    },

    finished: function finished() {
        this.node.stopAllActions();
        this.node.parent.removeChild(this.node);
        this.node.destroy();
    }

    // update (dt) {},
});

cc._RF.pop();