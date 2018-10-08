(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Scripts/ui/gameResultUI.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'fc94apRgelP/KG5tUS3IdxO', 'gameResultUI', __filename);
// Scripts/ui/gameResultUI.js

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
        homeBtn: cc.Node,
        historyScore: cc.Label,
        rankTexture: cc.Texture2D,
        rankSpriteFrame: cc.SpriteFrame,
        rankSprite: cc.Sprite

    },

    onLoad: function onLoad() {
        this.historyScore.string = wxGame.Global.gameInfo.score;
        wxGame.NotificationCenter.listen(wxGame.EventType.UPDATE_RESULT_RANK, this.setRankInfo, this);
        wxGame.NotificationCenter.listen(wxGame.EventType.STOP_UPDATE_RANK_TEXTURE, this.stopUpdateRankTexture, this);

        this.updateUserInfo();
        this.setRankInfo();

        tywx.BiLog.clickStat(wxGame.biManager.enterGameResult, ["gameResult"]);
    },

    updateUserInfo: function updateUserInfo() {
        if (wxGame.Global.gameInfo.max_score != null) {
            wxGame.GlobalFuncs.upDateRankData(wxGame.Global.gameInfo.max_score);
        }
    },

    setRankInfo: function setRankInfo() {
        var openDataContext = wxGame.GlobalFuncs.getOpenData();
        if (!openDataContext) {
            return;
        }
        this.sharedCanvas = openDataContext.canvas;
        this.sharedCanvas.width = 400;
        this.sharedCanvas.height = 180;
        this.rankTexture = new cc.Texture2D();
        this.rankSpriteFrame = new cc.SpriteFrame(this.rankTexture);

        tywx.Timer.cancelTimer(this, this.updateRankTexture);
        tywx.Timer.setTimer(this, this.updateRankTexture, 1 / 10, 1000);
        // tywx.Timer.setTimer(this, main, 1/10, 1000);

        wxGame.GlobalFuncs.getThirdRankInfo();
    },

    updateRankTexture: function updateRankTexture() {
        var texture = this.rankTexture;
        var spriteFrame = this.rankSpriteFrame;
        var sprite = this.rankSprite;
        texture.initWithElement(this.sharedCanvas);
        texture.handleLoadedTexture();
        sprite.spriteFrame = spriteFrame;
        sprite.spriteFrame._refreshTexture(texture);
    },

    //停止刷新当前排行
    stopUpdateRankTexture: function stopUpdateRankTexture() {
        tywx.Timer.cancelTimer(this, this.updateRankTexture);
    },

    onClickHomeBtn: function onClickHomeBtn() {
        wxGame.GlobalFuncs.goToBeginScene();
    },

    onClickChallengeBtn: function onClickChallengeBtn() {
        wxGame.shareManager.sharePoint("576");
    },

    onClickRankBtn: function onClickRankBtn() {
        tywx.BiLog.clickStat(wxGame.biManager.friendRank, ["gameResultFriendRank"]);
        wxGame.GlobalFuncs.showRankUI("");
    },

    onClickAgainBtn: function onClickAgainBtn() {
        tywx.BiLog.clickStat(wxGame.biManager.resultClcikRestart, ["gameResultPlayGame"]);
        wxGame.GlobalFuncs.playGame();
        this.onClose();
    },

    onClose: function onClose() {
        this.node.destroy();
        wxGame.gameResult = null;
    },

    onDestroy: function onDestroy() {
        this.sharedCanvas = null;
        tywx.Timer.cancelTimer(this, this.updateRankTexture);
        wxGame.NotificationCenter.ignoreScope(this);
    }
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
        //# sourceMappingURL=gameResultUI.js.map
        