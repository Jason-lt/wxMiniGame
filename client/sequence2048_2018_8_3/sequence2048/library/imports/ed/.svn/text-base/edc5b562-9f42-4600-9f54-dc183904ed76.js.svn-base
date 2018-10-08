"use strict";
cc._RF.push(module, 'edc5bVin0JGAJ9U3Bg5BO12', 'pauseUI');
// Scripts/ui/pauseUI.js

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
        setBg: cc.Node,
        soundOn: cc.Node,
        soundOff: cc.Node,
        shockOn: cc.Node,
        shockOff: cc.Node
    },

    onLoad: function onLoad() {
        if (wxGame.Global.isVibrateShort) {
            this.shockOff.active = true;
            this.shockOn.active = false;
        } else {
            this.shockOff.active = false;
            this.shockOn.active = true;
        }

        if (wxGame.AudioManager.isPlayMusic) {
            this.soundOff.active = true;
            this.soundOn.active = false;
        } else {
            this.soundOff.active = false;
            this.soundOn.active = true;
        }
    },

    onClickSetBtn: function onClickSetBtn() {
        this.setBg.stopAllActions();
        if (this.setBg.getScaleX() == 0) {
            var scale1 = cc.scaleTo(0.1, 1, 1);
            this.setBg.runAction(scale1);
        } else {
            var scale1 = cc.scaleTo(0.1, 0, 1);
            this.setBg.runAction(scale1);
        }
    },

    onClickRankBtn: function onClickRankBtn() {
        wxGame.GlobalFuncs.showRankUI("");
    },

    onClickShockBtn: function onClickShockBtn() {
        wxGame.Global.isVibrateShort = !wxGame.Global.isVibrateShort;
        if (wxGame.Global.isVibrateShort) {
            this.shockOff.active = true;
            this.shockOn.active = false;
        } else {
            this.shockOff.active = false;
            this.shockOn.active = true;
        }
    },

    onClickSoundBtn: function onClickSoundBtn() {
        wxGame.AudioManager.isPlayMusic = !wxGame.AudioManager.isPlayMusic;
        if (wxGame.AudioManager.isPlayMusic) {
            this.soundOff.active = true;
            this.soundOn.active = false;
        } else {
            this.soundOff.active = false;
            this.soundOn.active = true;
        }
    },

    onClickBackBtn: function onClickBackBtn() {
        wxGame.NotificationCenter.trigger(wxGame.EventType.SAVE_DATA);
        wxGame.NotificationCenter.trigger(wxGame.EventType.REMOVE_GAME_ANI);
        this.onClose();
        wxGame.GlobalFuncs.goToBeginScene();
    },

    onClickRestartBtn: function onClickRestartBtn() {
        this.onClose();
        wxGame.saveGameInfo = {};
        wxGame.GlobalFuncs.playGame();
    },

    onClickContinueBtn: function onClickContinueBtn() {
        wxGame.NotificationCenter.trigger(wxGame.EventType.UPDATE_RANK_INFO);
        this.onClose();
        wxGame.wxBannerAd.createBannerAd();
    },

    onClose: function onClose() {
        this.node.destroy();
    }

    // update (dt) {},
});

cc._RF.pop();