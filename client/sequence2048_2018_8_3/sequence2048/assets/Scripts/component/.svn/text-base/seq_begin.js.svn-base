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
        versionLabel:cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad:function(){
        tcpManager.websocket.init();
        // tcpManager.sendCmd.lisiner();
        // tcpManager.receiveCmd.boot();
        // wxGame.AudioManager.isPlayMusic(true);

        tywx.BiLog.clickStat(wxGame.biManager.enterGame, ["seq_begin"]);

        wxGame.AudioManager.loadNode();

        // tcpManager.sendCmd.getUserInfoForShot();
        var ThirdAPI = require('../common/ThirdAPI');
        ThirdAPI.showGameClub(false);

        wxGame.NotificationCenter.listen(wxGame.EventType.UPDATE_USER_INFO,this.updateUserInfo,this);
        this.updateUserInfo();
        ctr.addGuide.show();
    },

    updateUserInfo:function(){
        if(wxGame.Global.gameInfo.max_score != null){
            wxGame.GlobalFuncs.upDateRankData(wxGame.Global.gameInfo.max_score);
        }
        this.versionLabel.string = "v"+wxGame.Global.version;
    },

    onClickTopBtn:function(){
        var shareManager = require('shareManager');
        var extraParam = {
            sendTime: (new Date()).getTime()
        };
        wxGame.shareManager.sharePoint("573");
    },

    onClickBottomBtn:function(){
        tywx.BiLog.clickStat(wxGame.biManager.startGame, ["mainPlayGame"]);
        if (wxGame.GlobalFuncs.isEmptyObject(wxGame.saveGameInfo)) {
            wxGame.GlobalFuncs.playGame();
        } else {
            wxGame.GlobalFuncs.recordUI();
        }
    },

    onClickFriendRank:function(){
        tywx.BiLog.clickStat(wxGame.biManager.friendRank, ["mainFriendRank"]);
        wxGame.GlobalFuncs.showRankUI("");
    },

    onClickGroupRank:function(){
        wxGame.shareManager.sharePoint("574",this.RankShareSuccess.bind(this),this.RankShareFail.bind(this));
    },

    RankShareSuccess:function(openId,shareTicket){
        wxGame.LOGE("file = [seq_begin] fun = [RankShareSuccess] shareTicket = " + JSON.stringify(shareTicket));
        wxGame.GlobalFuncs.showRankUI(shareTicket);
        // wxGame.shareManager.resultType = 0;
    },

    RankShareFail:function(){
        wxGame.GlobalFuncs.showToast("分享失败!");
    },
    
    onDestroy:function () {
        wxGame.NotificationCenter.ignoreScope(this);
        ctr.addGuide.hide();
    }
    
});
