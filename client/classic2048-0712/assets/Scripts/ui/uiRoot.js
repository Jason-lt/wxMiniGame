// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

cc.Class({
    extends: cc.Component,

    properties: {
        startUI: {
            default: null,
            type: cc.Node
        },

        shareUI: {
            default: null,
            type: cc.Node
        },
    },


    start() {
        Global.startUI = this.startUI.getComponent('startUI');
        Global.shareUI = this.shareUI.getComponent("shareUI");
    },

    showStartUI: function () {
        this.startUI.active = true;
        this.shareUI.active = false;
        if (Global.startUI) {
            Global.startUI.init();
        }
    },

    showShareUI: function () {
        this.startUI.active = false;
        this.shareUI.active = true;
        if (Global.shareUI == null) {
            Global.shareUI = this.shareUI.getComponent("shareUI");
        }
        Global.shareUI.initData();
    },
});