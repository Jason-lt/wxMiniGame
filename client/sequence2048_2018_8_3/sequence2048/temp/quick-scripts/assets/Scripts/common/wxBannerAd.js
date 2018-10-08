(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Scripts/common/wxBannerAd.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '03b51zXJw9Pu5kO2MeDjg4b', 'wxBannerAd', __filename);
// Scripts/common/wxBannerAd.js

'use strict';

// banner广告接入

wxGame.wxBannerAd = {
    bannerAd: null,
    bannerAdTimer: null,

    isScale: false,
    myUtil: require('myUtil'),

    getSysInfo: function getSysInfo() {
        if (!this.sysInfo) {
            this.sysInfo = wx.getSystemInfoSync();
        }
        return this.sysInfo;
    },

    canShowBanner: function canShowBanner() {
        return wx.hasOwnProperty('createBannerAd');
    },
    createBannerAd: function createBannerAd() {
        if (!this.canShowBanner()) {
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
                    adUnitId: "adunit-bff01a2ea318d456",
                    style: {
                        left: 0,
                        top: 0,
                        width: screenWidth
                    }
                });
            }

            // 适配iphoneX
            var isFitIphoneX = this.myUtil.isIphoneX();
            var inter = 0;
            if (isFitIphoneX) {
                inter = 15;
            }
            wxGame.wxBannerAd.bannerAd.onResize(function (res) {
                if (wxGame.wxBannerAd.bannerAd) {
                    if (res.width > 300 && res.height > 100) {
                        // wxGame.wxBannerAd.bannerAd.style.width = 300;
                    }
                    wxGame.wxBannerAd.bannerAd.style.left = (screenWidth - res.width) / 2;
                    wxGame.wxBannerAd.bannerAd.style.top = screenHeight - res.height - inter;
                    wxGame.LOGW("file = [wxBannerAd] fun = [createBannerAd] height = " + res.height);
                    wxGame.LOGW("file = [wxBannerAd] fun = [createBannerAd] screenHeight = " + screenHeight);
                }
            });
            wxGame.wxBannerAd.bannerAd.show();
        } catch (error) {
            console.log(error);
        }
    },

    hideBannerAd: function hideBannerAd() {
        console.log('call hideBannerAd');

        if (this.bannerAd) {
            this.bannerAd.hide();
        }
    },

    showBannerAd: function showBannerAd() {
        console.log('call showBannerAd');

        if (this.bannerAd) {
            this.bannerAd.show();
        }
    },

    //销毁广告
    destroyBannerAd: function destroyBannerAd() {
        console.log('call destroyBannerAd');

        if (wxGame.wxBannerAd.bannerAd) {
            try {
                wxGame.wxBannerAd.bannerAd.hide();
            } catch (error) {}
        }
    }
};

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=wxBannerAd.js.map
        