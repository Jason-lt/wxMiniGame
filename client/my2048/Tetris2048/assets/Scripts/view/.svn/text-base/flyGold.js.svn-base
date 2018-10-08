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
        Sprite: {
            default: null,
            type: cc.Sprite,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    toPosition: function (p, gridNum) {
        this.num = gridNum;
        this.node.stopAllActions();
        //再上移
        var finished = cc.callFunc(this.finished, this);
        var action = cc.spawn(cc.moveTo(0.5, cc.p(p.x, p.y)), cc.rotateBy(0.5, 0));
        var action2 = cc.scaleTo(0.3, 2, 2);
        var updateGoldNum = cc.callFunc(this.updateGold, this);
        var myAction = cc.sequence(action, action2, updateGoldNum, finished);
        this.node.runAction(myAction);
        this.node.setLocalZOrder(10);
    },

    finished: function () {
        this.node.stopAllActions();
        this.node.parent.removeChild(this.node);
        this.node.destroy();

        var gridControllerScript = Global.gridController.getComponent("gridController");
        gridControllerScript.updateGold(this.num);
    }

    // update (dt) {},
});