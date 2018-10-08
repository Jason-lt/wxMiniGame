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
        scoreLabel:cc.Label,
        betLabel:cc.Label,
        betIcon:cc.Node,
        scoreProgress:cc.ProgressBar,
        sectionLabel_1:cc.Label,
        sectionLabel_2:cc.Label,
        zhixiang:cc.Node,


        rankTexture : cc.Texture2D,
        rankSpriteFrame : cc.SpriteFrame,
        rankSprite : cc.Sprite,
    },

    onLoad:function(){
        wxGame.NotificationCenter.listen(wxGame.EventType.UPDATE_SCORE_LABEL,this.setScoreLabel,this);
        wxGame.NotificationCenter.listen(wxGame.EventType.GAME_OVER_RESET,this.resetData,this);
        wxGame.NotificationCenter.listen(wxGame.EventType.UPDATE_RANK_INFO,this.updateRankInfo,this);
        wxGame.NotificationCenter.listen(wxGame.EventType.STOP_UPDATE_RANK,this.stopUpdateRank,this);
        this.section_1 = 0;

        this.section_2 = 500;
        this.lastScore = 0;
        this.setScoreLabel();

        wxGame.GlobalFuncs.getFriendRankInfo(this.section_1,this.section_2,this.lastScore,false);
    },

    updateRankInfo:function(){
        var openDataContext = wxGame.GlobalFuncs.getOpenData();
        if(!openDataContext){
            return;
        }

        this.sharedCanvas = openDataContext.canvas;
        this.sharedCanvas.width = 640;
        this.sharedCanvas.height = 100;
        this.rankTexture = new cc.Texture2D();
        this.rankSpriteFrame = new cc.SpriteFrame(this.rankTexture);

        this.rankSprite.node.active = true;

        tywx.Timer.cancelTimer(this,this.updateRank);
        tywx.Timer.setTimer(this, this.updateRank, 1/10, 1000);

        wxGame.GlobalFuncs.getFriendRankInfo(this.section_1,this.section_2,this.lastScore,true);
    },

    updateRank:function(){
        var texture = this.rankTexture;
        var spriteFrame = this.rankSpriteFrame;
        var sprite = this.rankSprite;
        texture.initWithElement(this.sharedCanvas);
        texture.handleLoadedTexture();
        sprite.spriteFrame = spriteFrame;
        sprite.spriteFrame._refreshTexture(texture);
    },

    //停止刷新当前排行
    stopUpdateRank:function(){
        tywx.Timer.cancelTimer(this,this.updateRank);
    },

    setScoreLabel:function(){
        if (!this.scoreLabel) {
            return
        }
        var gameInfo = wxGame.Global.gameInfo;
        var score = gameInfo.score;
        this.lastScore = parseInt(this.scoreLabel.string);
        this.scoreLabel.string = wxGame.GlobalFuncs.formatGold(score);
        if (wxGame.Global.gameInfo.nowCrossBet > 1) {
            this.betIcon.active = true;
            // var scoreSize = this.scoreLabel.node.getContentSize();
            this.betLabel.string = "x" + wxGame.Global.gameInfo.nowCrossBet;
            // this.betLabel.node.x = scoreSize.width/2 + 20;
        }else {
            this.betIcon.active = false;
        }

        this.getScoreSection(score);
    },

    resetData:function(){
        this.section_1 = 0;
        this.section_2 = 500;
        this.lastSection = null;
        this.rankSprite.node.active = false;
        tywx.Timer.cancelTimer(this,this.updateRank);
        this.sharedCanvas = null;
    },

    //计算分数两端区间数
    getScoreSection:function(score){
        var index = 0;
        var score_2 = 500*Math.pow(2,index);
        while (score >= score_2){
            index++;
            score_2 = 500*Math.pow(2,index);
        }
        this.section_1 = 0;
        if (index == 0){
            this.sectionLabel_1.string = 0;
            this.section_1 = 0;
        }else if (index > 0){
            var index_2 = index - 1;
            this.sectionLabel_1.string = 500*Math.pow(2,index_2);
            this.section_1 = 500*Math.pow(2,index_2);
        }
        this.section_2 = 500*Math.pow(2,index);
        this.sectionLabel_2.string = this.section_2;
        this.sectionLabel_1.string = this.section_1;

        var _progress = (score - this.section_1)/(this.section_2 - this.section_1);
        var size = this.scoreProgress.node.getContentSize();
        var endPos = size.width * _progress - size.width/2;
        wxGame.GlobalFuncs.proGressAni(this.zhixiang,endPos,0.5);
        // var _progress = (score - section_1)/(section_2 - section_1);
        // this.scoreProgress.progress = _progress;

        this.updateRankInfo();
        if (this.lastSection != this.section_1) {
            this.lastSection = this.section_1;
        }
        if (score > 0) {
            tcpManager.sendCmd.sendSaveScore();
        }
    },

    onDestroy:function () {
        wxGame.NotificationCenter.ignoreScope(this);
        tywx.Timer.cancelTimer(this,this.updateRank);
    }

});
