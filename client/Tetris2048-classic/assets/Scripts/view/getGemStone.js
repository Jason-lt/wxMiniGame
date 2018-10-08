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
        scenePoint: -1,
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
        this.toPosition([pos.x, pos.y], 2, 1);
    },


    toPosition: function (p, addNum, scenePoint) {
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

        this.scenePoint = scenePoint;
    },

    finished: function () {
        this.node.stopAllActions();
        this.node.parent.removeChild(this.node);
        this.node.destroy();

        this.node.setPosition(cc.p(0, 0));
        if (this.scenePoint == 1) {
            Global.startUI.updateGold(this.addNum);
        }
        else if (this.scenePoint == 2) {
            Global.rankui.updateGold(this.addNum);
        }
    }

    // update (dt) {},
});