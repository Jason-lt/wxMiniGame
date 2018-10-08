// banner广告接入

var wxBannerAd = {
    bannerAd: null,
    bannerAdTimer: null,

    isScale: false,

    createBannerAd: function () {
        console.log('call initBannerAd');
        if (!Global.myUtil) {
            Global.myUtil = require('myUtil');
        }

        if (typeof wx !== 'undefined') {
            var sysInfo = wx.getSystemInfoSync();
            console.log('sysinfo: ', sysInfo);
            if (sysInfo && sysInfo.SDKVersion && sysInfo.SDKVersion !== '') {
                console.log('sysinfo---: ', sysInfo.SDKVersion.replace(/\./g, ""));
            }
            if (sysInfo && sysInfo.SDKVersion && sysInfo.SDKVersion !== '' && sysInfo.SDKVersion.slice(0, 5).replace(/\./g, "") >= 204) {
                this.destroyBannerAd();
                try {
                    if (!this.bannerAd) {
                        this.bannerAd = wx.createBannerAd({
                            adUnitId: 'adunit-b4b17fafcb3b6c17',
                            style: {
                                left: 0,
                                top: 0,
                                width: sysInfo.screenWidth
                            }
                        });
                    }

                    this.isScale = false;
                    // var myUtil = require('myUtil');
                    var isFitIphoneX = Global.myUtil.isIphoneX();
                    if (this.bannerAd) {
                        this.bannerAd.show();
                        this.addBannerAdTimer();
                        var winSize = cc.director.getWinSize();
                        // 适配iphoneX

                        var fitOffsetY = 0;
                        if (isFitIphoneX) {
                            fitOffsetY = 40;
                        }
                        tywx.LOGE("","file = [wxBannerAd] fun = [createBannerAd] 111  ");
                        var startY = 328 - fitOffsetY - (Global.vNum - 1) * Global.itemSize - (Global.vNum - 1) * Global.itemSplit -(Global.itemSize + Global.itemSplit)/2;
                        startY = winSize.height/2 - Math.abs(startY);

                        this.bannerAd.onResize(res => {
                            if (this.bannerAd && this.bannerAd.style) {
                            tywx.LOGE("","file = [wxBannerAd] fun = [createBannerAd] isFitIphoneX =  " + isFitIphoneX);

                            console.log("bannerAd....",this.bannerAd);
                            if (this.bannerAd && this.bannerAd.style) {
                                if (this.bannerAd.style.realHeight >= ((sysInfo.screenHeight/winSize.height)*Math.abs(startY) - fitOffsetY)) {
                                    console.log('重设宽度');
                                    this.bannerAd.style.width = 300;
                                }
                                var _inter = 0;
                                // if (isFitIphoneX && this.bannerAd.style.width == 300) {
                                //     // _inter = (1 - 300/sysInfo.screenWidth) * res.height/(300/sysInfo.screenWidth) + 22;
                                //     _inter = 26.5;
                                // }
                                // tywx.LOGE("","file = [wxBannerAd] fun = [createBannerAd] _inter = " + _inter);
                                this.bannerAd.style.left = (sysInfo.screenWidth - res.width) / 2;
                                this.bannerAd.style.top = sysInfo.screenHeight - (sysInfo.screenHeight/winSize.height)*Math.abs(startY);

                            }
                        }
                    })
                    }
                } catch (error) {
                    console.log("banner创建失败",error);
                }
            } else {
                console.log('SDKVersion 判断基础库版本号 >= 2.0.4 后再使用该 API');
            }
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

        if (this.bannerAd) {
            try {
                this.bannerAd.hide();
                // this.bannerAd.destroy();
                // this.bannerAd = null;
            } catch (error) {
                // this.bannerAd = null;
            }
        }
        clearTimeout(this.bannerAdTimer);
    },

    //增加广告计时器
    addBannerAdTimer: function () {
        console.log('addBannerAdTimer');
        if (!Global.bannerAdConfig.swith) {
            console.log('关闭每60s刷新banner广告机制');
            clearTimeout(this.bannerAdTimer);
            return;
        }
        var that = this;
        this.bannerAdTimer = setTimeout(function() {
            that.createBannerAd();
        }, Global.bannerAdConfig.interval);
    },
}

module.exports = wxBannerAd;