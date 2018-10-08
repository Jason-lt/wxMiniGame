/*
 * file : LinkImages.js
 * brief: This file can link images on different platforms.
 */

let wxRewardVideoAd = {
    videoAd: null,

    initCreateReward: function (onCLoseCallback, onFailedCallBack) {
        if (typeof wx !== 'undefined') {
            console.log('call initCreateReward');

            try {
                let videoAd = wx.createRewardedVideoAd({
                    adUnitId: 'adunit-cadfea7f9bcdbcd8'
                })

                //videoAd.load()
                // .then(() => videoAd.show())
                // .catch(err => console.log(err.errMsg))


                videoAd.load()
                    .then(() => videoAd.show())
                    .catch(err => {
                        console.log('ad load faild:', err.errMsg)
                        // videoAd.load()
                        //     .then(() => videoAd.show())
                    })

                videoAd.offClose();
                videoAd.onClose((res) => {
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
                })

                videoAd.onError(err => {
                    console.log('onError:', err.errMsg)
                    Global.game.showDialogText('拉取数据失败');
                    // videoAd.load()
                    //     .then(() => videoAd.show())
                })
            } catch (error) {
                console.log('wxRewardVideoAd error', error);
            }
        }
    },

    onEnabled: function () {

    },
}

module.exports = wxRewardVideoAd;