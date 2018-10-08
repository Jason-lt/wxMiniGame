"use strict";
cc._RF.push(module, '9b085CGjSpKv4HVviusb52z', 'wxRewardVideoAd');
// Scripts/common/wxRewardVideoAd.js

'use strict';

/*
 * file : LinkImages.js
 * brief: This file can link images on different platforms.
 */

var wxRewardVideoAd = {
    videoAd: null,

    initCreateReward: function initCreateReward(onCLoseCallback) {
        if (typeof wx !== 'undefined') {
            console.log('call initCreateReward');
            var videoAd = wx.createRewardedVideoAd({
                adUnitId: 'adunit-cadfea7f9bcdbcd8'
            });

            //videoAd.load()
            // .then(() => videoAd.show())
            // .catch(err => console.log(err.errMsg))


            videoAd.load().then(function () {
                return videoAd.show();
            }).catch(function (err) {
                console.log('ad load faild:', err.errMsg);
                // videoAd.load()
                //     .then(() => videoAd.show())
            });

            videoAd.offClose();
            videoAd.onClose(function (res) {
                console.log('==> wxRewardVideoAd onClose', res);
                // 用户点击了【关闭广告】按钮

                if (res == undefined) {
                    if (onCLoseCallback) {
                        onCLoseCallback(true);
                    }
                } else {
                    if (onCLoseCallback) {
                        onCLoseCallback(res.isEnded);
                    }
                }
            });

            /*videoAd.onLoad(() => {
                console.log('激励 广告加载成功')
                videoAd.show();
            })*/
            videoAd.onError(function (err) {
                console.log('onError:', err.errMsg);
                Global.game.showDialogText('拉取数据失败');
                // videoAd.load()
                //     .then(() => videoAd.show())
            });
        }
    },

    onEnabled: function onEnabled() {}

    /*
        videoAdOnLoad: function (onCLoseCallback) {
            this.videoAd.load();
             this.videoAd.onLoad(() => {
                console.log('激励 广告加载成功')
                videoAd.show();
            })
             this.videoAd.onClose(() => {
                // 用户点击了【关闭广告】按钮
                if (onCLoseCallback) {
                    onCLoseCallback();
                }
            })
             this.videoAd.onError(err => {
                console.log(err.errMsg)
                videoAd.load()
                    .then(() => videoAd.show())
            })
        },
    */

};

module.exports = wxRewardVideoAd;

cc._RF.pop();