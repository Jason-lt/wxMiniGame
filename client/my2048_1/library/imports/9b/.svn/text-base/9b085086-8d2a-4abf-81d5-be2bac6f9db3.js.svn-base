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

    initCreateReward: function initCreateReward(onCLoseCallback, onFailedCallBack) {
        if (typeof wx !== 'undefined') {
            console.log('call initCreateReward');

            try {
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
                    if (res == undefined) {
                        //看完广告,给奖励
                        if (onCLoseCallback) {
                            onCLoseCallback();
                        }
                    } else {
                        // 用户点击了【关闭广告】按钮
                        console.log('==> wxRewardVideoAd onClose', res);
                        if (res.isEnded) {
                            //看完广告,给奖励
                            if (onCLoseCallback) {
                                onCLoseCallback();
                            }
                        } else {
                            // 没看完,不给奖励
                            console.log('广告没看完');
                            if (onFailedCallBack) {
                                console.log('回调失败');
                                onFailedCallBack();
                            }
                        }
                    }
                });

                videoAd.onError(function (err) {
                    console.log('onError:', err.errMsg);
                    Global.game.showDialogText('拉取数据失败');
                    // videoAd.load()
                    //     .then(() => videoAd.show())
                });
            } catch (error) {
                console.log('wxRewardVideoAd error', error);
            }
        }
    },

    onEnabled: function onEnabled() {}
};

module.exports = wxRewardVideoAd;

cc._RF.pop();