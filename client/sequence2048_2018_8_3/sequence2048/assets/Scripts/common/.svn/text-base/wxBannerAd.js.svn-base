// banner广告接入

wxGame.wxBannerAd = {
    bannerAd: null,
    bannerAdTimer: null,

    isScale: false,
    myUtil : require('myUtil'),

    getSysInfo:function(){
        if (!this.sysInfo) {
            this.sysInfo = wx.getSystemInfoSync();
        }
        return this.sysInfo;
    },

    canShowBanner:function(){
        return wx.hasOwnProperty('createBannerAd');
    },
    createBannerAd: function () {
        if (!this.canShowBanner()){
            wxGame.LOGD("玩家基础库不支持banner");
            return;
        }

        var sysInfo = this.getSysInfo();
        var screenWidth = sysInfo.screenWidth;
        var screenHeight = sysInfo.screenHeight;
        var winSize = cc.director.getWinSize();

        this.destroyBannerAd();

        try {
            if (!wxGame.wxBannerAd.bannerAd) {
                wxGame.wxBannerAd.bannerAd = wx.createBannerAd({
                    adUnitId:"adunit-bff01a2ea318d456",
                    style: {
                        left:0,
                        top:0,
                        width:screenWidth
                    }
                });
            }

            // 适配iphoneX
            var isFitIphoneX = this.myUtil.isIphoneX();
            var inter = 0;
            if (isFitIphoneX){
                inter = 15;
            }
            wxGame.wxBannerAd.bannerAd.onResize(function(res){
                if (wxGame.wxBannerAd.bannerAd) {
                    if (res.width > 300 && res.height > 100) {
                        // wxGame.wxBannerAd.bannerAd.style.width = 300;
                    }
                    wxGame.wxBannerAd.bannerAd.style.left = (screenWidth - res.width)/2;
                    wxGame.wxBannerAd.bannerAd.style.top = screenHeight-res.height-inter;
                    wxGame.LOGW("file = [wxBannerAd] fun = [createBannerAd] height = " + res.height)
                    wxGame.LOGW("file = [wxBannerAd] fun = [createBannerAd] screenHeight = " + screenHeight)
                }
            });
            wxGame.wxBannerAd.bannerAd.show();
        } catch (error) {
            console.log(error);
        }
    },

    hideBannerAd: function () {
        console.log('call hideBannerAd');

        if (this.bannerAd) {
            this.bannerAd.hide();
        }
    },

    showBannerAd: function () {
        console.log('call showBannerAd');

        if (this.bannerAd) {
            this.bannerAd.show();
        }
    },

    //销毁广告
    destroyBannerAd: function () {
        console.log('call destroyBannerAd');

        if (wxGame.wxBannerAd.bannerAd) {
            try {
                wxGame.wxBannerAd.bannerAd.hide();
            } catch (error) {

            }
        }
    },
}