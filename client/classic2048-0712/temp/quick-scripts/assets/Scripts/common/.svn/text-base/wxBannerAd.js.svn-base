(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Scripts/common/wxBannerAd.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '03b51zXJw9Pu5kO2MeDjg4b', 'wxBannerAd', __filename);
// Scripts/common/wxBannerAd.js

'use strict';

// banner广告接入

var wxBannerAd = {
    bannerAd: null,
    bannerAdTimer: null,

    isScale: false,

    createBannerAd: function createBannerAd() {
        var _this = this;

        console.log('call initBannerAd');

        if (typeof wx !== 'undefined') {
            var sysInfo = wx.getSystemInfoSync();
            console.log('sysinfo: ', sysInfo);
            if (sysInfo && sysInfo.SDKVersion && sysInfo.SDKVersion !== '') {
                console.log('sysinfo---: ', sysInfo.SDKVersion.replace(/\./g, ""));
            }
            if (sysInfo && sysInfo.SDKVersion && sysInfo.SDKVersion !== '' && sysInfo.SDKVersion.slice(0, 5).replace(/\./g, "") >= 204) {
                this.destroyBannerAd();
                try {
                    this.bannerAd = wx.createBannerAd({
                        adUnitId: 'adunit-bde6af15378cfbbd',
                        style: {
                            left: 0,
                            top: 0,
                            width: sysInfo.screenWidth
                        }
                    });
                    this.isScale = false;

                    if (this.bannerAd) {
                        this.bannerAd.show();
                        this.addBannerAdTimer();

                        this.bannerAd.onResize(function (res) {
                            if (_this.bannerAd && _this.bannerAd.style) {
                                console.log("res:", res.width, res.height);
                                if (_this.bannerAd && _this.bannerAd.style) {
                                    console.log("real:", _this.bannerAd.style.realWidth, _this.bannerAd.style.realHeight);
                                }

                                // 适配iphoneX
                                var myUtil = require('myUtil');
                                var fitOffsetY = myUtil.isIphoneX() ? 0.01 : 0;
                                console.log('fitOffsetY:', fitOffsetY);

                                var showHeight = Global.bannerAdConfig.showHeight;
                                if (_this.bannerAd && _this.bannerAd.style.realHeight <= Global.bannerAdConfig.showHeight) {
                                    showHeight = _this.bannerAd.style.realHeight;
                                }

                                if (_this.bannerAd && _this.bannerAd.style) {
                                    //var buttomHeight = sysInfo.screenHeight / sysInfo.pixelRatio - (Global.lineHight / 2 - Global.linePosY) / sysInfo.pixelRatio;
                                    var buttomHeight = sysInfo.screenHeight / 2 - (sysInfo.screenHeight * Global.lineHight / 568 / 2 - Global.linePosY) / 2;
                                    if (myUtil.isIphoneX()) {
                                        console.log('isIphoneX');
                                        buttomHeight -= 6;
                                    }
                                    //var buttomHeight = sysInfo.screenHeight / sysInfo.pixelRatio - (Global.lineHight / 2 - Global.linePosY) / sysInfo.pixelRatio - (sysInfo.screenHeight - 568) / 4;
                                    //var buttomHeight = sysInfo.screenHeight / sysInfo.pixelRatio - (sysInfo.screenHeight * sysInfo.pixelRatio -Math.abs(Global.lineHight)) / sysInfo.pixelRatio;
                                    if (_this.bannerAd.style.realHeight >= buttomHeight) {
                                        console.log('重设宽度');
                                        _this.bannerAd.style.width = 300;

                                        //this.bannerAd.style.top = sysInfo.screenHeight - this.bannerAd.style.realHeight;
                                    } else {
                                            // this.bannerAd.style.top = sysInfo.screenHeight - buttomHeight;
                                        }

                                    console.log('buttomHeight', Global.lineHight, Global.linePosY, buttomHeight);
                                    _this.bannerAd.style.left = (sysInfo.screenWidth - res.width) / 2;
                                    _this.bannerAd.style.top = sysInfo.screenHeight - buttomHeight;
                                    //this.bannerAd.style.top = sysInfo.screenHeight - this.bannerAd.style.realHeight;


                                    /*
                                                                        var downHeight = 0;
                                                                        if ((this.bannerAd.style.realHeight / sysInfo.screenHeight) > 0.16) {
                                                                            //downHeight = this.bannerAd.style.realHeight - sysInfo.screenHeight * 0.16;
                                                                            console.log('****this.bannerAd.style.realHeight:', this.bannerAd.style.realHeight);
                                                                            this.bannerAd.style.width = 300;
                                                                            this.bannerAd.style.top = sysInfo.screenHeight - this.bannerAd.style.realHeight;
                                                                            this.isScale = true;
                                                                        } else {
                                                                            if (this.isScale) {
                                                                                console.log('重设宽度之后：', sysInfo.screenHeight, this.bannerAd.style.realHeight);
                                                                                 this.bannerAd.style.top = sysInfo.screenHeight - this.bannerAd.style.realHeight - 20;
                                                                                this.isScale = false;
                                                                            } else {
                                                                                this.bannerAd.style.top = sysInfo.screenHeight - this.bannerAd.style.realHeight;
                                                                            }
                                                                             //this.bannerAd.style.top = sysInfo.screenHeight - this.bannerAd.style.realHeight;
                                                                        }*/

                                    /* var width = sysInfo.screenWidth;
                                     if ((this.bannerAd.style.realHeight / sysInfo.screenHeight) > 0.16) {
                                         width -= sysInfo.screenWidth * 0.16;
                                     }
                                     this.bannerAd.style.width = width;*/

                                    //this.bannerAd.style.left = (sysInfo.screenWidth - res.width) / 2;

                                    //this.bannerAd.style.top = sysInfo.screenHeight - showHeight + fitOffsetY;


                                    // this.bannerAd.style.top = sysInfo.screenHeight - this.bannerAd.style.realHeight;


                                    // console.log("top:", this.bannerAd.style.top, "showHeight:", showHeight);
                                }
                            }
                        });
                    }
                } catch (error) {
                    console.log(error);
                }
            } else {
                console.log('SDKVersion 判断基础库版本号 >= 2.0.4 后再使用该 API');
            }
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

        if (this.bannerAd) {
            try {
                this.bannerAd.destroy();
                this.bannerAd = null;
            } catch (error) {
                this.bannerAd = null;
            }
        }
        clearTimeout(this.bannerAdTimer);
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
        