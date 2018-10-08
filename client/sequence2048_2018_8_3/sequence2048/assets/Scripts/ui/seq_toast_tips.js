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
        titleLabel : {
            default : null,
            type : cc.Label
        }
    },

    setTitleWithString : function (titleString) {
        this.titleLabel.string = titleString;
        tywx.Timer.setTimer(this, this.closeAction, 1.5)
    },

    closeAction : function () {
        this.node.destroy();
        wxGame.msgBoxNode = null;
    },
    onDestroy:function(){
        this.unscheduleAllCallbacks();
    }


});
