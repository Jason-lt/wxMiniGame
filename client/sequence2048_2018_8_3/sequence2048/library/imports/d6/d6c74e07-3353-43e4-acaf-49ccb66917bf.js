"use strict";
cc._RF.push(module, 'd6c744HM1ND5KyvScy2aRe/', 'seq_toast_tips');
// Scripts/ui/seq_toast_tips.js

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
        titleLabel: {
            default: null,
            type: cc.Label
        }
    },

    setTitleWithString: function setTitleWithString(titleString) {
        this.titleLabel.string = titleString;
        tywx.Timer.setTimer(this, this.closeAction, 1.5);
    },

    closeAction: function closeAction() {
        this.node.destroy();
        wxGame.msgBoxNode = null;
    },
    onDestroy: function onDestroy() {
        this.unscheduleAllCallbacks();
    }

});

cc._RF.pop();