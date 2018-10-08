"use strict";
cc._RF.push(module, '958e2Xi9ylJuIQqbAn3gS4U', 'wxBannerAd');
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
                    adUnitId: 'adunit-bde6af15378cfbbd',
                    style: {
                        left: 0,
                        top: 0,
                        width: 300
                    }
                });

                if (this.bannerAd) {

                    this.bannerAd.show();
                    this.addBannerAdTimer();

                    this.bannerAd.onResize(function (res) {
                        console.log("res:", res.width, res.height);
                        if (_this.bannerAd.style) {
                            console.log("real:", _this.bannerAd.style.realWidth, _this.bannerAd.style.realHeight);

                            var fitOffsetY = isFitIphoneX ? 0.01 : 0;
                            console.log('fitOffsetY:', fitOffsetY, isFitIphoneX);
                            console.log('res height:', sysInfo.screenHeight, cc.winSize.height, sysInfo.screenHeight / cc.winSize.height);

                            _this.bannerAd.style.left = (sysInfo.screenWidth - res.width) / 2;
                            _this.bannerAd.style.top = sysInfo.screenHeight - res.height + fitOffsetY;

                            console.log("top:", _this.bannerAd.style.top);

                            // 调整banner关闭按钮位置

                            if (Global.game && Global.game.btnCloseBanner) {
                                Global.game.btnCloseBanner.active = true;
                                Global.game.btnCloseBanner.setLocalZOrder(999);

                                var posx = _this.bannerAd.style.width / 2 / (sysInfo.screenHeight / cc.winSize.height) + Global.game.btnCloseBanner.width / 2;
                                var posy = cc.winSize.height / 2 * -1 + res.height / (sysInfo.screenHeight / cc.winSize.height) - Global.game.btnCloseBanner.height / 2;
                                Global.game.btnCloseBanner.setPosition(posx, posy);
                                console.log("------------->>>>>>>>>>>>>>banner close btn pos:", Global.game.btnCloseBanner.active, Global.game.btnCloseBanner.position);
                            }
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
            if (Global.game && Global.game.btnCloseBanner) {
                Global.game.btnCloseBanner.active = false;
            }

            if (this.bannerAd) {
                this.bannerAd.destroy();
                this.bannerAd = null;
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
            this.bannerAdTimer = null;
            return;
        }
        this.bannerAdTimer = setTimeout(function () {
            _this2.createBannerAd();
        }, Global.bannerAdConfig.interval);
    }
};

module.exports = wxBannerAd;

cc._RF.pop();