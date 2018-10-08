// banner广告接入

let wxBannerAd = {
    bannerAd: null,
    bannerAdTimer: null,

    isScale: false,

    createBannerAd: function () {
        console.log('call initBannerAd');

        if (typeof wx !== 'undefined') {
            var sysInfo = wx.getSystemInfoSync();
            console.log('sysinfo: ', sysInfo);
            if (sysInfo && sysInfo.SDKVersion && sysInfo.SDKVersion !== '') {
                console.log('sysinfo---: ', sysInfo.SDKVersion.replace(/\./g, ""));
            }

            // 适配iphoneX
            var myUtil = require('myUtil');
            var winSize = cc.director.getWinSize();
            var isFitIphoneX = myUtil.isIphoneX();

            var fitOffsetY = 0;
            if (isFitIphoneX) {
                fitOffsetY = 15;
            }
            if (sysInfo && sysInfo.SDKVersion && sysInfo.SDKVersion !== '' && sysInfo.SDKVersion.slice(0, 5).replace(/\./g, "") >= 204) {
                this.destroyBannerAd();
                try {
                    if (!this.bannerAd) {
                        this.bannerAd = wx.createBannerAd({
                            adUnitId: 'adunit-c0fde1713ca9781a',
                            style: {
                                left: 0,
                                top: 0,
                                width: sysInfo.screenWidth
                            }
                        });
                    }
                    this.isScale = false;

                    if (this.bannerAd) {
                        this.bannerAd.show();
                        this.addBannerAdTimer();




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

                                        //this.bannerAd.style.top = sysInfo.screenHeight - this.bannerAd.style.realHeight;
                                    } else {
                                        // this.bannerAd.style.top = sysInfo.screenHeight - buttomHeight;
                                    }

                                    var _height = sysInfo.screenHeight - (sysInfo.screenHeight/winSize.height)*Math.abs(startY);
                                    var _inter = 0;
                                    if (isFitIphoneX && this.bannerAd.style.width == 300) {
                                        // _inter = (1 - 300/sysInfo.screenWidth) * res.height/(300/sysInfo.screenWidth) + 22;
                                        _inter = 26.5;
                                    }
                                    tywx.LOGE("","file = [wxBannerAd] fun = [createBannerAd] _inter = " + _inter);
                                    this.bannerAd.style.left = (sysInfo.screenWidth - res.width) / 2;
                                    this.bannerAd.style.top = sysInfo.screenHeight - (sysInfo.screenHeight/winSize.height)*Math.abs(startY) + _inter;

                                    // tywx.LOGE("","file = [wxBannerAd] fun = [createBannerAd] sysInfo.screenWidth = " + sysInfo.screenWidth);
                                    // tywx.LOGE("","file = [wxBannerAd] fun = [createBannerAd] sysInfo.screenHeight = " + sysInfo.screenHeight);
                                    // tywx.LOGE("","file = [wxBannerAd] fun = [createBannerAd] this.bannerAd.style.top = " + this.bannerAd.style.top);
                                    // console.log("","file = [wxBannerAd] fun = [createBannerAd] res = ", res);

                                }
                            }
                        })
                        // this.bannerAd.hide();

                        // //自己的banner
                        // if (tywx.AdManager && tywx.AdManager.getBannerNodeByTag("tyBanner")) {
                        //     tywx.AdManager.getBannerNodeByTag("tyBanner").showAdNode();
                        // }else {
                        //     tywx.AdManager.showBanner(cc.p(cc.winSize.width/2,83 + fitOffsetY),"tyBanner");
                        // }

                        this.bannerAd.onError(function(msg){
                            console.log('创建banner失败,使用自己的banner msg : ' , msg);
                            //自己的banner
                            if (tywx.AdManager && tywx.AdManager.getBannerNodeByTag("tyBanner")) {
                                tywx.AdManager.getBannerNodeByTag("tyBanner").showAdNode();
                            }else {
                                tywx.AdManager.showBanner(cc.p(cc.winSize.width/2,83 + fitOffsetY),"tyBanner");
                            }
                        });
                        if (tywx.AdManager && tywx.AdManager.getBannerNodeByTag("tyBanner")) {
                            tywx.AdManager.getBannerNodeByTag("tyBanner").showAdNode();
                        }

                    }
                } catch (error) {
                    console.log(error);
                    //自己的banner
                    if (tywx.AdManager && tywx.AdManager.getBannerNodeByTag("tyBanner")) {
                        tywx.AdManager.getBannerNodeByTag("tyBanner").showAdNode();
                    }else {
                        tywx.AdManager.showBanner(cc.p(cc.winSize.width/2,83 + fitOffsetY),"tyBanner");
                    }
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
                // this.bannerAd = null;
            } catch (error) {
                // this.bannerAd = null;
            }
        }
        clearTimeout(this.bannerAdTimer);

        if (tywx.AdManager && tywx.AdManager.getBannerNodeByTag("tyBanner")) {
            tywx.AdManager.getBannerNodeByTag("tyBanner").hideAdNode();
        }

    },

    //增加广告计时器
    addBannerAdTimer: function () {
        console.log('addBannerAdTimer');
        if (!Global.bannerAdConfig.swith) {
            console.log('关闭每60s刷新banner广告机制');
            clearTimeout(this.bannerAdTimer);
            return;
        }
        this.bannerAdTimer = setTimeout(() => {
            this.createBannerAd();
        }, Global.bannerAdConfig.interval);
    },
}

module.exports = wxBannerAd;