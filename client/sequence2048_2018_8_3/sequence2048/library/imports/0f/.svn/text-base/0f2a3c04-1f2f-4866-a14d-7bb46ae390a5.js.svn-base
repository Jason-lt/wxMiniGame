"use strict";
cc._RF.push(module, '0f2a3wEHy9IZqFNe7Rq45Cl', 'rankUI');
// Scripts/ui/rankUI.js

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
        titleLabel: cc.Label,
        rankBtnLabel: cc.Label,

        playBtn: cc.Node,
        groupRankBtn: cc.Node,

        rankSprite: cc.Sprite,
        texture: cc.Texture2D,
        spriteFrame: cc.SpriteFrame,
        shareTicket: ""
    },

    onLoad: function onLoad() {
        var openDataContext = wxGame.GlobalFuncs.getOpenData();
        if (!openDataContext) {
            return;
        }
        wxGame.NotificationCenter.trigger(wxGame.EventType.STOP_UPDATE_RANK_TEXTURE);
        this.shareCanvas = openDataContext.canvas;
        this.shareCanvas.width = 540;
        this.shareCanvas.height = 1760;
        wxGame.GlobalFuncs.showOrigin();
        this.texture = new cc.Texture2D();
        this.spriteFrame = new cc.SpriteFrame(this.texture);
        // var texture = this.texture;
        // var spriteFrame = this.spriteFrame;
        // var sprite = this.rankSprite;
        // var main = function(){
        //     texture.initWithElement(shareCanvas);
        //     texture.handleLoadedTexture();
        //     sprite.spriteFrame = spriteFrame;
        //     sprite.spriteFrame._refreshTexture(texture);
        // };
        // main();
        // tywx.Timer.setTimer(this, main, 1/10, 1000);
        tywx.Timer.cancelTimer(this, this.updateRankTexture);
        tywx.Timer.setTimer(this, this.updateRankTexture, 1 / 10, 1000);
    },

    showRankListForShare: function showRankListForShare() {
        this.unscheduleAllCallbacks();
        var openDataContext = wxGame.GlobalFuncs.getOpenData();
        if (!openDataContext) {
            return;
        }

        this.sharedCanvas = openDataContext.canvas;
        if (!this.shareTicket || this.shareTicket == "") {
            wxGame.GlobalFuncs.getFriendRank();
        } else {
            wxGame.GlobalFuncs.getGroupRank(this.shareTicket);
        }
        // tywx.Timer.setTimer(this, main, 1/10,1000);
        tywx.Timer.cancelTimer(this, this.updateRankTexture);
        tywx.Timer.setTimer(this, this.updateRankTexture, 1 / 10, 1000);
    },
    updateRankTexture: function updateRankTexture() {
        var texture = this.texture;
        var spriteFrame = this.spriteFrame;
        var sprite = this.rankSprite;
        texture.initWithElement(this.sharedCanvas);
        texture.handleLoadedTexture();
        sprite.spriteFrame = spriteFrame;
        sprite.spriteFrame._refreshTexture(texture);
    },
    changeButtonToRank: function changeButtonToRank(shareTicket) {
        this.shareTicket = shareTicket;
        this.showRankListForShare();
        if (shareTicket && shareTicket != "") {
            this.titleLabel.string = "群排行";
            this.playBtn.active = true;
            this.groupRankBtn.active = false;
        } else {
            this.titleLabel.string = "好友排行";
            this.playBtn.active = false;
            this.groupRankBtn.active = true;
        }
    },

    //
    onClickRankBtn: function onClickRankBtn() {
        wxGame.GlobalFuncs.showRankUI("");
    },

    onClickGroupRankBtn: function onClickGroupRankBtn() {
        wxGame.shareManager.sharePoint("574", this.RankShareSuccess.bind(this), this.RankShareFail.bind(this));
    },

    RankShareSuccess: function RankShareSuccess(openId, shareTicket) {
        wxGame.LOGE("file = [rankUI] fun = [RankShareSuccess] shareTicket = " + JSON.stringify(shareTicket));
        wxGame.GlobalFuncs.showRankUI(shareTicket);
        // wxGame.shareManager.resultType = 0;
    },

    RankShareFail: function RankShareFail() {
        wxGame.GlobalFuncs.showToast("分享失败!");
    },

    //玩一局
    onClickPlayBtn: function onClickPlayBtn() {
        if (wxGame.gameResult) {
            wxGame.gameResult.onClose();
        }
        this.backAction();
        wxGame.GlobalFuncs.playGame();
    },

    backAction: function backAction() {
        tywx.Timer.cancelTimer(this, this.updateRankTexture);
        this.node.destroy();
        wxGame.rankUI = null;
        wxGame.NotificationCenter.trigger(wxGame.EventType.UPDATE_RESULT_RANK);
    },

    onDestroy: function onDestroy() {
        wxGame.rankUI = null;
        tywx.Timer.cancelTimer(this, this.updateRankTexture);
        this.unscheduleAllCallbacks();
    }
    // update (dt) {},
});

cc._RF.pop();