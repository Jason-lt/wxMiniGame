(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Scripts/view/flyNum.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '13c8bLoIxNJd6hxiaJl5vN4', 'flyNum', __filename);
// Scripts/view/flyNum.js

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

    //数字飞入效果
    toItemPosition: function toItemPosition(toPos) {
        this.node.stopAllActions();

        var upAction = cc.moveTo(0.5, cc.p(this.node.getPosition().x, this.node.getPosition().y + 150));

        var dist = cc.pDistance(this.node.getPosition(), toPos);
        var playTime = dist / 1000;
        console.log('playTime:', playTime);

        var smallAction = cc.scaleTo(playTime, 0.4);
        var flyScoreAction = cc.moveTo(playTime, cc.p(toPos.x, toPos.y));

        //var spawn = cc.spawn(bigAction, upAction);

        var finished = cc.callFunc(this.finished, this);
        var addScoreAction = cc.callFunc(function () {
            var gridControllerScript = Global.gridController.getComponent("gridController");
            var addScore = this.num * parseInt(Global.cdnGameConfig.bombDoubleRate);
            gridControllerScript.scoreScript.addScore(addScore);
            gridControllerScript.scoreScript.scaleAction();
        }, this);

        var flySpawn = cc.spawn(smallAction, flyScoreAction);
        var myAction = cc.sequence(upAction, flySpawn, addScoreAction, finished);
        this.node.runAction(myAction);
        this.node.setLocalZOrder(2000);

        /*
                var self = this;
                var curPos = this.node.getPosition();
                this.node.stopAllActions();
                this.node.setScale(0.5, 0.5);
                //先放大
                var action1 = cc.scaleTo(0.3, 1, 1);
                this.node.runAction(action1);
                 //再上移
                var finished = cc.callFunc(this.finished, this);
                var addScoreAction = cc.callFunc(function () {
                    var gridControllerScript = Global.gridController.getComponent("gridController");
                    var addScore = this.num * 3;
                    gridControllerScript.scoreScript.addScore(addScore);
                }, this);
                var action2 = cc.moveTo(0.5, cc.p(this.node.getPosition().x, this.node.getPosition().y + 150));
                var myAction = cc.sequence(action2, addScoreAction, finished);
                this.node.runAction(myAction);
                this.node.setLocalZOrder(2000);*/
    },

    setNum: function setNum(_num, doubleTimes) {
        this.num = _num;
        var extraStr = "";
        if (doubleTimes > 1) {
            extraStr = 'x' + parseInt(doubleTimes);
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
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=flyNum.js.map
        