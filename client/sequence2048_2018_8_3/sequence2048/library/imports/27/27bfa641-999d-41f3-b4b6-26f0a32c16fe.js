"use strict";
cc._RF.push(module, '27bfaZBmZ1B87S2JvCjLBb+', 'betScore');
// Scripts/ui/betScore.js

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
        betLabel: cc.Label
    },

    onLoad: function onLoad() {
        wxGame.NotificationCenter.listen(wxGame.EventType.REMOVE_GAME_ANI, this.removeGameAni, this);

        var ani = this.node.getComponent(cc.Animation);
        var anim = ani.getAnimationState("betAni");
        var that = this;
        anim.once("finished", function () {
            that.node.destroy();
        });
        anim.play();
    },

    setBet: function setBet(_bet) {
        this.betLabel.string = "x" + _bet;
    },

    removeGameAni: function removeGameAni() {
        var ani = this.node.getComponent(cc.Animation);
        var anim = ani.getAnimationState("betAni");
        anim.stop();

        this.node.destroy();
    },

    onDestroy: function onDestroy() {
        wxGame.NotificationCenter.ignoreScope(this);
    }
});

cc._RF.pop();