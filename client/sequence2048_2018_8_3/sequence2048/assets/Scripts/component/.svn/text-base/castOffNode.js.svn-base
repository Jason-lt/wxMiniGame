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
        state_1:cc.Node,
        state_2:cc.Node,
        wasteBg_1:cc.Node,
        wasteBg_2:cc.Node,
        tipsLabel:cc.Label,
        wasteKuang:cc.Node,
        selectCastOff:cc.Node,

        shareBg_1:cc.Node,
        shareBg_2:cc.Node,
        videoBg_1:cc.Node,
        videoBg_2:cc.Node,

    },

    onLoad:function(){
        wxGame.NotificationCenter.listen(wxGame.EventType.UPDATE_TOUCH_BEGAN,this._onTouchBegan,this);
        wxGame.NotificationCenter.listen(wxGame.EventType.UPDATE_TOUCH_MOVE,this._onTouchMove,this);
        wxGame.NotificationCenter.listen(wxGame.EventType.UPDATE_TOUCH_END,this._onTouchEnd,this);
        wxGame.NotificationCenter.listen(wxGame.EventType.RECOVER_LAST_OPERATION,this.recoverLastOperation,this);
        wxGame.NotificationCenter.listen(wxGame.EventType.GAME_OVER_RESET,this.resetData,this);
        wxGame.NotificationCenter.listen(wxGame.EventType.CLEAR_WASTE_STATE,this.clearCastOff,this);

        wxGame.NotificationCenter.listen(wxGame.EventType.UPDATE_SHARE_STATE,this.updateShareState,this);

        if (!this.wasteNumer) {
            this.wasteNumer = 0;
            this.setWasteState();
        }

        this.lastOperation = false;

        if(wxGame.shareConfig.castOff.useMethod == "share") {
            this.shareBg_1.active = true;
            this.shareBg_2.active = true;
            this.videoBg_1.active = false;
            this.videoBg_1.active = false;
        }else {
            this.shareBg_1.active = false;
            this.shareBg_2.active = false;
            this.videoBg_1.active = true;
            this.videoBg_1.active = true;
        }
    },

    _onTouchBegan:function(item){
        this.selectWaste = false;
        this.isVibrateShort = false;
    },

    _onTouchMove:function(data){
        var pos = data.pos;
        var callFunc = data.callFunc;
        this.selectWaste = false;
        this.setTipsLabel();
        var _item = data.item;
        this.selectCastOff.active = false;
        if (_item.getIsGridSelect()) {
            return;
        }
        if (this.wasteNumer < 2) {
            var grid_pos = this.node.convertToNodeSpace(this.node.convertToWorldSpace(cc.p(0,0)));
            pos = this.node.convertToNodeSpace(pos);
            var winSize = cc.director.getWinSize();
            var cardRect = cc.rect(grid_pos.x - winSize.width/2 - this.wasteKuang.width/2,
                grid_pos.y-wxGame.Global.isXInter , this.wasteKuang.width, this.wasteKuang.height);
            if (cc.rectContainsPoint(cardRect, pos) && !this.isMergeIng) {
                this.selectCastOff.active = true;
                if (!this.isVibrateShort){
                    this.isVibrateShort = true;
                    wxGame.GlobalFuncs.vibrateShort();
                }
                this.selectWaste = true;
            }
        }else {
            this.tipsLabel.string = "已满";
            this.isVibrateShort = false;
        }

        callFunc();
    },

    _onTouchEnd:function(){
        this.selectCastOff.active = false;
        if (this.selectWaste) {  //保存上次各个格子的分数
            wxGame.NotificationCenter.trigger(wxGame.EventType.SELECT_WASTE,this.selectWaste);
            this.wasteNumer ++;
            this.setWasteState();
            this.setLastOperation(true);
        }else {
            this.setLastOperation(false);
        }
        this.setTipsLabel();
    },

    setWasteState:function(){
        if (this.wasteNumer == 0) {
            this.wasteBg_1.active = false;
            this.wasteBg_2.active = false;
        }else if (this.wasteNumer == 1) {
            this.wasteBg_1.active = true;
            this.wasteBg_2.active = false;
        }else {
            this.wasteBg_1.active = true;
            this.wasteBg_2.active = true;
        }
    },

    setTipsLabel:function(){
        if (this.wasteBg_1 && this.wasteBg_2) {
            if (this.wasteBg_1.active && this.wasteBg_2.active) {
                if (!wxGame.shareConfig.castOff.isUse) {
                    this.tipsLabel.string = "已满";
                }else {
                    if(wxGame.shareConfig.castOff.useMethod == "share") {
                        this.tipsLabel.string = "分享清空";
                    }else {
                        this.tipsLabel.string = "看视频清空";
                    }
                }
            }else {
                this.tipsLabel.string = "丢弃";
            }
        }
    },

    setLastOperation:function(isOperation){
        this.lastOperation = isOperation;
        if (isOperation) {
            wxGame.Global.isLastOperation = isOperation;
        }

    },

    recoverLastOperation:function(){
        if (this.lastOperation) {
            this.wasteNumer--;
            this.setWasteState();
            this.setTipsLabel();
            this.setLastOperation(false);
        }
    },

    onClickCastOffBtn:function(){
        if (!wxGame.shareConfig.castOff.isUse) {
            return
        }
        //垃圾桶满了
        if (this.wasteBg_1.active && this.wasteBg_2.active) {
            // wxGame.shareManager.sharePoint("570",this.CastShareSuccess.bind(this),this.CastShareFail.bind(this));
            if(wxGame.shareConfig.castOff.useMethod == "share") {
                tywx.BiLog.clickStat(wxGame.biManager.clickCastoff, ["share"]);
                wxGame.shareManager.sharePoint("570");
            }else {
                tywx.BiLog.clickStat(wxGame.biManager.clickCastoff, ["video"]);
                wxGame.wxAdManager.showRewardVideo(this.onAdSuccess.bind(this),this.onAdFail.bind(this));
            }
        }
    },

    onAdSuccess:function(isEnd){
        if (isEnd){
            tywx.BiLog.clickStat(wxGame.biManager.castoff, ["video"]);
            this.clearCastOff();
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
        wxGame.shareManager.sharePoint("570");
    },

    updateShareState:function(){
        if (wxGame.Global.sharePoint == "570") {
            var resultType = wxGame.shareManager.resultType;
            wxGame.LOGW("file = [castOffNode] fun = [updateShareState] resultType = " + resultType);
            switch (resultType) {
                case 1:
                    wxGame.GlobalFuncs.showToast("分享到群才有效哦~");
                    break;
                case 2:
                    wxGame.GlobalFuncs.showToast("这个群今天已经打扰过了哦~");
                    break;
                case 3:
                    tywx.BiLog.clickStat(wxGame.biManager.castoff, ["share"]);
                    this.clearCastOff();
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

    //清理
    clearCastOff:function(){
        this.wasteNumer = 0;
        this.setWasteState();
        this.setTipsLabel();
    },

    resetData:function(){
        this.wasteNumer = 0;
        this.isVibrateShort = false;
        this.setWasteState();
        this.setTipsLabel();
        this.lastOperation = false;
    },

    onDestroy:function () {
        wxGame.NotificationCenter.ignoreScope(this);
    }

    // update (dt) {},
});
