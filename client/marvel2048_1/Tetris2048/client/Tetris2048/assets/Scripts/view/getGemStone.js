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
    },

    onLoad: function () {
        this.canGetReward = true;
    },

    //拾起钻石
    onBtnClick: function () {
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

    toPosition: function (p) {
        console.log('getStone toPosition');
        this.node.stopAllActions();
        //再上移
        var finished = cc.callFunc(this.finished, this);
        var action = cc.spawn(cc.moveTo(0.5, cc.p(p[0], p[1])), cc.rotateBy(0.5, 0));
        var action2 = cc.scaleTo(0.3, 2, 2);
        var myAction = cc.sequence(action, action2, finished);
        this.node.runAction(myAction);
        this.node.setLocalZOrder(1);
    },

    finished: function () {
        this.node.stopAllActions();
        this.node.parent.removeChild(this.node);
        this.node.destroy();

        Global.startUI.updateGold(1);
    }

    // update (dt) {},
});