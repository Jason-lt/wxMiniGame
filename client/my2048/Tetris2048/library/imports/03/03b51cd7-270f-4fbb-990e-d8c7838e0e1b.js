"use strict";
cc._RF.push(module, '03b51zXJw9Pu5kO2MeDjg4b', 'wxBannerAd');
// Scripts/common/wxBannerAd.js

'use strict';

// banner广告接入

var wxBannerAd = {
    bannerAd: null,
    bannerAdTimer: null,

    createBannerAd: function createBannerAd() {
        var _this = this;

        console.log('call initBannerAd');

        if (typeof wx !== 'undefined') {
            try {
                this.destroyBannerAd();
                //var adheight = sysInfo.screenHeight/cc.winSize.height*( (cc.winSize.height * 0.693 + 208));

                var sysInfo = wx.getSystemInfoSync();
                // 判断是否为iphonex
                var isFitIphoneX = sysInfo.model.toLowerCase().replace(/\s+/g, "").indexOf("iphonex", 0) != -1;

                this.bannerAd = wx.createBannerAd({
                    adUnitId: 'adunit-b4b17fafcb3b6c17',
                    style: {
                        left: 0,
                        top: 0,
                        width: 300 //sysInfo.screenWidth
                    }
                });

                if (this.bannerAd) {

                    this.bannerAd.show();
                    this.addBannerAdTimer();

                    this.bannerAd.onResize(function (res) {
                        console.log("res:", res.width, res.height);
                        if (_this.bannerAd.style) {
                            console.log("real:", _this.bannerAd.style.realWidth, _this.bannerAd.style.realHeight);

                            /*
                            // 适配iphoneX
                            //var isFitIphoneX = (sysInfo.model == "iPhone X");//(cc.winSize.width / cc.winSize.height) <= 0.56;
                            
                            var fitOffsetY = isFitIphoneX ? 0.01 : 0;
                            console.log('fitOffsetY:', fitOffsetY, isFitIphoneX);
                            console.log('res height:', sysInfo.screenHeight, cc.winSize.height, sysInfo.screenHeight / cc.winSize.height);
                                     this.bannerAd.style.left = (sysInfo.screenWidth - res.width) / 2;
                            this.bannerAd.style.top = sysInfo.screenHeight - res.height + fitOffsetY;//- Global.bannerAdConfig.showHeight + fitOffsetY;                          
                             console.log("top:", this.bannerAd.style.top);
                            */
                            //var buttomHeight = sysInfo.screenHeight / sysInfo.pixelRatio - (Global.lineHight / 2 - Global.linePosY) / sysInfo.pixelRatio;
                            var buttomHeight = sysInfo.screenHeight / 2 - (sysInfo.screenHeight * Global.lineHight / 568 / 2 - Global.linePosY) / 2;
                            if (isFitIphoneX) {
                                console.log('isIphoneX');
                                buttomHeight -= 6;
                            }
                            //var buttomHeight = sysInfo.screenHeight / sysInfo.pixelRatio - (Global.lineHight / 2 - Global.linePosY) / sysInfo.pixelRatio - (sysInfo.screenHeight - 568) / 4;
                            //var buttomHeight = sysInfo.screenHeight / sysInfo.pixelRatio - (sysInfo.screenHeight * sysInfo.pixelRatio -Math.abs(Global.lineHight)) / sysInfo.pixelRatio;
                            //if (this.bannerAd.style.realHeight >= buttomHeight) {
                            //console.log('重设宽度');
                            //this.bannerAd.style.width = 300;

                            //this.bannerAd.style.top = sysInfo.screenHeight - this.bannerAd.style.realHeight;
                            //} else {
                            // this.bannerAd.style.top = sysInfo.screenHeight - buttomHeight;
                            //}

                            console.log('buttomHeight', Global.lineHight, Global.linePosY, buttomHeight);
                            _this.bannerAd.style.left = (sysInfo.screenWidth - res.width) / 2;
                            _this.bannerAd.style.top = sysInfo.screenHeight - buttomHeight;
                        }
                    });
                }
            } catch (error) {
                console.log(error);
            }
        }
    },

    hideBannerAd: function hideBannerAd() {
        console.log('call hideBannerAd');

        try {
            if (this.bannerAd) {
                this.bannerAd.hide();
            }
        } catch (error) {}
    },

    showBannerAd: function showBannerAd() {
        console.log('call showBannerAd');

        try {
            if (this.bannerAd) {
                this.bannerAd.show();
            }
        } catch (error) {}
    },

    //销毁广告
    destroyBannerAd: function destroyBannerAd() {
        console.log('call destroyBannerAd');

        try {
            if (this.bannerAd) {
                this.bannerAd.destroy();
            }
            clearTimeout(this.bannerAdTimer);
            this.bannerAd = null;
            this.bannerAdTimer = null;
        } catch (error) {}
    },

    //增加广告计时器
    addBannerAdTimer: function addBannerAdTimer() {
        var _this2 = this;

        console.log('addBannerAdTimer');
        if (!Global.bannerAdConfig.swith) {
            console.log('关闭每60s刷新banner广告机制');
            clearTimeout(this.bannerAdTimer);
            return;
        }
        this.bannerAdTimer = setTimeout(function () {
            _this2.createBannerAd();
        }, Global.bannerAdConfig.interval);
    }
};

module.exports = wxBannerAd;

cc._RF.pop();