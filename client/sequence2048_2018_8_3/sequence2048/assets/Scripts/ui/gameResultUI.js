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
        homeBtn:cc.Node,
        historyScore:cc.Label,
        rankTexture : cc.Texture2D,
        rankSpriteFrame : cc.SpriteFrame,
        rankSprite : cc.Sprite,

    },

    onLoad:function(){
        this.historyScore.string = wxGame.Global.gameInfo.score;
        wxGame.NotificationCenter.listen(wxGame.EventType.UPDATE_RESULT_RANK,this.setRankInfo,this);
        wxGame.NotificationCenter.listen(wxGame.EventType.STOP_UPDATE_RANK_TEXTURE,this.stopUpdateRankTexture,this);

        this.updateUserInfo();
        this.setRankInfo();

        tywx.BiLog.clickStat(wxGame.biManager.enterGameResult, ["gameResult"]);
    },

    updateUserInfo:function(){
        if(wxGame.Global.gameInfo.max_score != null){
            wxGame.GlobalFuncs.upDateRankData(wxGame.Global.gameInfo.max_score);
        }
    },

    setRankInfo:function(){
        var openDataContext = wxGame.GlobalFuncs.getOpenData();
        if(!openDataContext){
            return;
        }
        this.sharedCanvas = openDataContext.canvas;
        this.sharedCanvas.width = 400;
        this.sharedCanvas.height = 180;
        this.rankTexture = new cc.Texture2D();
        this.rankSpriteFrame = new cc.SpriteFrame(this.rankTexture);


        tywx.Timer.cancelTimer(this,this.updateRankTexture);
        tywx.Timer.setTimer(this, this.updateRankTexture, 1/10, 1000);
        // tywx.Timer.setTimer(this, main, 1/10, 1000);

        wxGame.GlobalFuncs.getThirdRankInfo();
    },

    updateRankTexture:function(){
        var texture = this.rankTexture;
        var spriteFrame = this.rankSpriteFrame;
        var sprite = this.rankSprite;
        texture.initWithElement(this.sharedCanvas);
        texture.handleLoadedTexture();
        sprite.spriteFrame = spriteFrame;
        sprite.spriteFrame._refreshTexture(texture);
    },

    //停止刷新当前排行
    stopUpdateRankTexture:function(){
        tywx.Timer.cancelTimer(this,this.updateRankTexture);
    },

    onClickHomeBtn:function(){
        wxGame.GlobalFuncs.goToBeginScene();
    },

    onClickChallengeBtn:function(){
        wxGame.shareManager.sharePoint("576");
    },

    onClickRankBtn:function(){
        tywx.BiLog.clickStat(wxGame.biManager.friendRank, ["gameResultFriendRank"]);
        wxGame.GlobalFuncs.showRankUI("");
    },

    onClickAgainBtn:function(){
        tywx.BiLog.clickStat(wxGame.biManager.resultClcikRestart, ["gameResultPlayGame"]);
        wxGame.GlobalFuncs.playGame();
        this.onClose();
    },

    onClose:function(){
        this.node.destroy();
        wxGame.gameResult = null;
    },

    onDestroy:function () {
        this.sharedCanvas = null;
        tywx.Timer.cancelTimer(this,this.updateRankTexture);
        wxGame.NotificationCenter.ignoreScope(this);
    }
});
