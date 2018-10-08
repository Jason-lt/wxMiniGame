"use strict";
cc._RF.push(module, '95e7etjvnFMRpbdKhlci8VP', 'getGemStone');
// Scripts/view/getGemStone.js

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
        canGetReward: true,
        addNum: null
    },

    onLoad: function onLoad() {
        this.canGetReward = true;
    },

    //拾起星星
    onBtnClick: function onBtnClick() {
        console.log('this.canGetReward:', this.canGetReward);
        if (!this.canGetReward) {
            console.log('onBtnClick');
            return;
        }
        this.canGetReward = false;
        console.log('canFly');
        console.log(Global.startUI.goldNode.getPosition());
        var pos = Global.startUI.goldNode.getPosition();
        this.toPosition([pos.x, pos.y]);
    },

    toRepeat: function toRepeat(p, addNum) {
        this.addNum = 1;
        var finished = cc.callFunc(this.finished, this);
        var action = cc.spawn(cc.moveTo(0.3, cc.p(p[0], p[1])), cc.rotateBy(0.5, 0));
        var action2 = cc.scaleTo(0.1, 2, 2);
        var action3 = cc.scaleTo(0.1, 1, 1);
        //var myAction = cc.sequence(action, action2, finished);

        var seq = cc.repeat(cc.sequence(action, action2, action3, finished), 5);
        this.node.runAction(seq);
        this.node.setLocalZOrder(1);
    },

    toPosition: function toPosition(p, addNum) {
        this.addNum = addNum;
        console.log('getStone toPosition', this.addNum);
        this.node.stopAllActions();
        //再上移
        var finished = cc.callFunc(this.finished, this);
        var action = cc.spawn(cc.moveTo(0.5, cc.p(p[0], p[1])), cc.rotateBy(0.5, 0));
        var action2 = cc.scaleTo(0.3, 2, 2);
        var action3 = cc.scaleTo(0.1, 1, 1);
        var myAction = cc.sequence(action, action2, action3, finished, cc.delayTime(0.1));
        this.node.runAction(myAction);
        this.node.setLocalZOrder(1);
    },

    finished: function finished() {
        this.node.stopAllActions();
        this.node.parent.removeChild(this.node);
        this.node.destroy();

        this.node.setPosition(cc.p(0, 0));
        Global.startUI.updateGold(this.addNum);
    }

    // update (dt) {},
});

cc._RF.pop();