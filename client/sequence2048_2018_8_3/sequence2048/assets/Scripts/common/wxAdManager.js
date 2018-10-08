/**
 * Created by tuyoo on 2018/9/17.
 */
wxGame.wxAdManager = {
    videoAdId:"adunit-cfb475129810e6a2",
    checkVideoTime : 300000,
    /*
     * 播放激励广告视频
     *
     */
    showRewardVideo:function(adSuccessCallFunc,adfailCallFunc){
        if (!wx.hasOwnProperty('createRewardedVideoAd')){
            wxGame.LOGD("玩家基础库不支持激励广告视频");
            wxGame.GlobalFuncs.showToast('您的微信版本过低,请升级至6.6.6以上');
            return
        }
        var onAdClose = function(res){
            var playEnded = (!res || (res && res.isEnded));
            //只有播放完成才发奖
            // wxGame.NotificationCenter.trigger(wxGame.EventType.REWARD_VIDEO_COMPLETE, playEnded);
            if (adSuccessCallFunc) {
                adSuccessCallFunc(playEnded);
            }
            wxGame.wxAdManager.videoAdManager.offClose(onAdClose);
            wxGame.wxAdManager.canPlay = false;
            wxGame.wxAdManager.checkVideoAd();
        };

        if (wxGame.wxAdManager.canPlay){
            wxGame.wxAdManager.videoAdManager.show();
            this.destroyBanner();
            wxGame.wxAdManager.videoAdManager.onClose(onAdClose);
        }
        else{
            // ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeWatchVideo, ["fail", type]);
            // wxGame.NotificationCenter.trigger(wxGame.EventType.REWARD_VIDEO_COMPLETE, true);
            if (adfailCallFunc) {
                adfailCallFunc();
            }
        }
    },

    checkVideoAd:function(){
        if (!wx.hasOwnProperty('createRewardedVideoAd')){
            return;
        }

        if (!this.videoAdManager){
            this.videoAdManager = wx.createRewardedVideoAd({
                adUnitId:wxGame.wxAdManager.videoAdId
            });
        }

        this.videoAdManager.load().then(function () {
            wxGame.LOGW("====== 成功获取广告");
            wxGame.wxAdManager.canPlay = true;
        }).catch(function (err) {
            wxGame.LOGW("====== 获取广告失败,继续获取", JSON.stringify(err));
            wxGame.wxAdManager.canPlay = false;

            setTimeout(function () {
                wxGame.wxAdManager.checkVideoAd();
            }, wxGame.wxAdManager.checkVideoTime);
        });
    },
    
    destroyBanner:function(){
        if (wxGame.wxBannerAd.bannerAd) {
            try {
                wxGame.wxBannerAd.bannerAd.hide();
            } catch (error) {

            }
        }
    },
}