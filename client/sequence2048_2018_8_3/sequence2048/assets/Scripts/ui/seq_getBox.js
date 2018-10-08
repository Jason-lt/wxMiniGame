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
        cardSprite:cc.Sprite,
        cardSpriteFrame:[cc.SpriteFrame],

        boxNode:cc.Node,
    },

    onLoad:function(){
        wxGame.NotificationCenter.listen(wxGame.EventType.UPDATE_SHARE_STATE,this.updateShareState,this);
        this.isAction = true;
        var ani = this.node.getComponent(cc.Animation);
        var anim = ani.getAnimationState('2048_baoxiang');
        var that = this;
        anim.once("finished", function () {
            that.isAction = false;
        });
        anim.play();
    },

    setBoxCardScore:function(score){
        var index = wxGame.GameConfig.itemScoreConfig.indexOf(score);
        if (index >= 0) {
            this.cardSprite.spriteFrame = this.cardSpriteFrame[index];
        }
    },

    updateShareState:function(){
        if (wxGame.Global.sharePoint == "571") {
            wxGame.LOGW("file = [seq_getBox] fun = [updateShareState] ");
            var resultType = wxGame.shareManager.resultType;
            switch (resultType) {
                case 1:
                    wxGame.GlobalFuncs.showToast("分享到群才有效哦~");
                    break;
                case 2:
                    wxGame.GlobalFuncs.showToast("这个群今天已经打扰过了哦~");
                    break;
                case 3:
                    var propList = [0,1,2];
                    var arrIndex = Math.floor(Math.random() * propList.length);
                    if (propList[arrIndex] != null) {
                        if (propList[arrIndex] == 2) {
                            tcpManager.sendCmd.shareToGetreward(10700001);
                            tywx.BiLog.clickStat(wxGame.biManager.getChangeCard, ["video","box"]);
                        }else {
                            wxGame.GlobalFuncs.getCardProp(propList[arrIndex]);
                            if (this.propIndex == 0){   //炸弹
                                tywx.BiLog.clickStat(wxGame.biManager.getBombCard, ["video","box"]);
                            }else if (this.propIndex == 1){   //万能
                                tywx.BiLog.clickStat(wxGame.biManager.getPowerfulCard, ["video","box"]);
                            }
                        }
                    }
                    this.onClose();
                    break;
                case 6:
                    wxGame.GlobalFuncs.showToast("分享失败!");
                    break;
                default:
                    wxGame.GlobalFuncs.showToast("分享失败!");
                    break;
            }
            wxGame.shareManager.resultType = 0;
        }
    },

    onClickGetBox:function(){
        if (this.isAction) {
            return
        }
        if(wxGame.shareConfig.mergeBox.useMethod == "share") {
            wxGame.shareManager.sharePoint("571");
            tywx.BiLog.clickStat(wxGame.biManager.onClickBox, ["share"]);
        }else {
            tywx.BiLog.clickStat(wxGame.biManager.onClickBox, ["video"]);
            wxGame.wxAdManager.showRewardVideo(this.onAdSuccess.bind(this),this.onAdFail.bind(this));
        }
    },

    onAdSuccess:function(isEnd){
        if (isEnd){
            var propList = [0,1,2];
            var arrIndex = Math.floor(Math.random() * propList.length);
            if (propList[arrIndex] != null) {
                if (propList[arrIndex] == 2) {
                    tcpManager.sendCmd.shareToGetreward(10700001);
                    tywx.BiLog.clickStat(wxGame.biManager.getChangeCard, ["share","box"]);
                }else {
                    wxGame.GlobalFuncs.getCardProp(propList[arrIndex]);
                    if (this.propIndex == 0){   //炸弹
                        tywx.BiLog.clickStat(wxGame.biManager.getBombCard, ["share","box"]);
                    }else if (this.propIndex == 1){   //万能
                        tywx.BiLog.clickStat(wxGame.biManager.getPowerfulCard, ["share","box"]);
                    }
                }
            }
            this.onClose();
        }else {
            wxGame.GlobalFuncs.showToast("观看完整视频,才可获得奖励");
        }
        wxGame.wxBannerAd.createBannerAd();
    },

    onAdFail:function(){
        wxGame.GlobalFuncs.showToast("激励视频已达上限!");
        wxGame.wxBannerAd.createBannerAd();
        if (wxGame.Global.isBringVersion) {
            return
        }
        wxGame.shareManager.sharePoint("571");
    },

    onClickSkipBtn:function(){
        if (this.isAction) {
            return
        }
        this.onClose();
    },

    onClose:function(){
        var ani = this.node.getComponent(cc.Animation);
        var anim = ani.getAnimationState('2048_baoxiang');
        anim.stop();

        this.boxNode.stopAllActions();

        this.node.destroy();
    },
    onDestroy:function () {
        wxGame.boxUI = null;
        wxGame.NotificationCenter.ignoreScope(this);
    }
});
