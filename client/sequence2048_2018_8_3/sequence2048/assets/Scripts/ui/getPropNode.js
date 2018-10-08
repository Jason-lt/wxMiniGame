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
        propSprite:cc.Sprite,
        propSpriteFrame:[cc.SpriteFrame],
        shareBtn:cc.Node,
        videoBtn:cc.Node,
    },

    onLoad:function(){
        wxGame.NotificationCenter.listen(wxGame.EventType.UPDATE_SHARE_STATE,this.updateShareState,this);
    },

    setPropData:function(propIndex){
        this.propIndex = propIndex; // 0:炸弹   1:万能  2:交换
        if (this.propSpriteFrame[this.propIndex]){
            this.propSprite.spriteFrame = this.propSpriteFrame[this.propIndex]
        }
        if (wxGame.shareConfig.getProp && wxGame.shareConfig.getProp.useMethod == "share") {
            this.shareBtn.active = true;
            this.videoBtn.active = false;
        }else {
            this.shareBtn.active = false;
            this.videoBtn.active = true;
        }
    },

    onClickShareBtn:function(){
        tywx.BiLog.clickStat(wxGame.biManager.getProp, ["share"]);
        wxGame.shareManager.sharePoint("577");

    },

    updateShareState:function(){
        if (wxGame.Global.sharePoint == "577") {
            wxGame.LOGW("file = [getPropNode] fun = [updateShareState] ");
            var resultType = wxGame.shareManager.resultType;
            switch (resultType) {
                case 1:
                    wxGame.GlobalFuncs.showToast("分享到群才有效哦~");
                    break;
                case 2:
                    wxGame.GlobalFuncs.showToast("这个群今天已经打扰过了哦~");
                    break;
                case 3:
                    if (this.propIndex == 2) {
                        tcpManager.sendCmd.shareToGetreward(10700001);
                        tywx.BiLog.clickStat(wxGame.biManager.getChangeCard, ["share","cardBag"]);
                    }else {
                        wxGame.GlobalFuncs.getCardProp(this.propIndex);
                        if (this.propIndex == 0){   //炸弹
                            tywx.BiLog.clickStat(wxGame.biManager.getBombCard, ["share","cardBag"]);
                        }else if (this.propIndex == 1){   //万能
                            tywx.BiLog.clickStat(wxGame.biManager.getPowerfulCard, ["share","cardBag"]);
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

    onClickVideoBtn:function(){
        tywx.BiLog.clickStat(wxGame.biManager.getProp, ["video"]);
        wxGame.wxAdManager.showRewardVideo(this.onAdSuccess.bind(this),this.onAdFail.bind(this));
    },

    onAdSuccess:function(isEnd){
        if (isEnd){
            if (this.propIndex == 2) {
                tcpManager.sendCmd.shareToGetreward(10700001);
                tywx.BiLog.clickStat(wxGame.biManager.getChangeCard, ["video","cardBag"]);
            }else {
                wxGame.GlobalFuncs.getCardProp(this.propIndex);
                if (this.propIndex == 0){   //炸弹
                    tywx.BiLog.clickStat(wxGame.biManager.getBombCard, ["video","cardBag"]);
                }else if (this.propIndex == 1){   //万能
                    tywx.BiLog.clickStat(wxGame.biManager.getPowerfulCard, ["video","cardBag"]);
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
        wxGame.shareManager.sharePoint("577");
    },

    onClose:function(){
        this.node.destroy();
    },
    onDestroy:function () {
        wxGame.NotificationCenter.ignoreScope(this);
    }
    // update (dt) {},
});
