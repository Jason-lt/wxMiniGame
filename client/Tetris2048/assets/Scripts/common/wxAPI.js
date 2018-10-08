let WXGlobal = {


    initOnEnter: function () {
        console.log('get launch options')
        let options = this.getLaunchOptionsSync();
        console.log('launch options', options);
        this.shareTicket = options.shareTicket;
        this.scene = options.scene;
        this.query = options.query;
        this.isSticky = options.isSticky;
        this.queryString = '';

        this.setShareTicketEnabled(true);
        this.showShareMenu();
        // this.getAuth();
        this.registShare();
        this.registOnShow();
        this.registOnError();

        this.userInfo = {
            nickName: '不愿透露姓名的老王',
            maxscore: 0,
            gold: 0,
            iv: '',
            signature: '',
            gender: 1,
            avatarUrl: 'res/raw-assets/resources/textures/gridItem/rank_1.png'
        }
    },

    registOnShow: function () {
        wx.onShow((res) => {
            console.log('wx onShow', res);
            if (res.shareTicket) {
                WXGlobal.shareTicket = res.shareTicket;
            }
        });
    },

    registOnError: function () {
        wx.onError((res) => {
            console.log('wx error:' + res.message + '\nstack:\n' + res.stack);
        })
    },

    getAuth: function (callback) {
        wx.getUserInfo({
            success: function (res) {
                // iOS 和 Android 对于拒绝授权的回调 errMsg 没有统一，需要做一下兼容处理
                console.log(res);
                WXGlobal.userInfo = res.userInfo
                WXGlobal.setUserCloudStorage({
                    KVDataList: [{
                            key: 'name',
                            value: res.userInfo.nickName
                        },
                        {
                            key: 'gender',
                            value: res.userInfo.gender + ''
                        },
                        {
                            key: 'avatarUrl',
                            value: res.userInfo.avatarUrl
                        },
                        {
                            key: 'iv',
                            value: res.iv
                        },
                        {
                            key: 'signature',
                            value: res.signature
                        },
                    ],
                    success: function () {
                        console.log('set User Cloud Storage success');
                    }
                })
            },
            fail: function (res) {
                // iOS 和 Android 对于拒绝授权的回调 errMsg 没有统一，需要做一下兼容处理
                if (res.errMsg.indexOf('auth deny') > -1 || res.errMsg.indexOf('auth denied') > -1) {
                    // 处理用户拒绝授权的情况
                    console.log(res);
                    WXGlobal.userInfo = {
                        nickName: '不愿透露姓名的老王',
                        maxscore: 0,
                        gold: 0,
                        iv: '',
                        signature: '',
                        gender: 1,
                        avatarUrl: 'res/raw-assets/resources/textures/gridItem/rank_1.png'
                    }
                    console.log('set UserInfo default');
                }
            },
            complete: function () {
                if (callback) {
                    callback();
                }
            }
        })
    },

    registShare: function () {
        this.onShareAppMessage(() => {
            var Util = require("Util");
            var text = Util.randomForArray(Global.shareTexts);
            console.log('用户点击了右上按钮并分享,query:', WXGlobal.queryString, ' text:' + text);
            var img = WXGlobal.getShareScreenShot();

            WXGlobal.shareAppMessage({
                title: text,
                imageUrl: img,
                query: WXGlobal.queryString
            });
        })
    },

    shareGame: function (imageurl, callback, failcallback) {
        var Util = require("Util");
        console.log('用户点击分享,query:', WXGlobal.queryString);
        if (!imageurl) {
            var image = Util.randomForArray(Global.shareImages);
            imageurl = 'res/raw-assets/resources/textures/gridItem/' + image;
        }
        var text = Util.randomForArray(Global.shareTexts);

        // this.getAuth(() => {
        WXGlobal.shareAppMessage({
            title: text,
            imageUrl: imageurl,
            query: WXGlobal.queryString,
            success: (res) => {
                console.log('wx分享成功', res);
                if (res.shareTickets) {
                    WXGlobal.shareTicketEnabled = true;
                    WXGlobal.shareTicket = res.shareTickets[0];
                }
                if (callback) {
                    callback(res.shareTickets);
                }
            },
            fail: () => {
                console.log('wx分享失败', failcallback);
                if (failcallback) {
                    failcallback();
                }
            }
        })
        // });
    },

    login: function (callback) {
        wx.login(callback);
    },

    setMaxScore: function (maxscore, gold) {

        WXGlobal.queryString =
            'nickName=' + WXGlobal.userInfo.nickName + '&' +
            'maxscore=' + maxscore + '&' +
            'gold=' + gold + '&' +
            'gender=' + WXGlobal.userInfo.gender + '&' +
            'avatarUrl=' + WXGlobal.userInfo.avatarUrl;

        console.log('wx setMaxScore, query:', WXGlobal.queryString);
    },

    // 返回小程序启动参数
    getLaunchOptionsSync: function () {
        return wx.getLaunchOptionsSync()
    },

    setShareTicketEnabled: function (isEnabled) {
        wx.updateShareMenu({
            withShareTicket: isEnabled,
            success: () => {
                WXGlobal.shareTicketEnabled = isEnabled;
            }
        })
    },

    getShareInfo: function (obj) {
        return wx.getShareInfo(obj)
    },

    getShareUserInfo: function () {
        return this.query
    },

    showShareMenu: function () {
        console.log('显示右上菜单的转发按钮');
        wx.showShareMenu();
    },
    hideShareMenu: function () {
        console.log('隐藏右上菜单的转发按钮');
        wx.hideShareMenu();
    },
    onShareAppMessage: function (callback) {
        console.log('注册点击转发按钮事件');
        wx.onShareAppMessage(callback);
    },
    shareAppMessage: function (params) {
        console.log('转发:', params);
        wx.shareAppMessage(params);
    },

    getShareScreenShot: function () {
        return canvas.toTempFilePathSync({
            x: 0,
            y: 0.5 * canvas.height - 0.8 * 0.8 * canvas.width,
            width: canvas.width,
            height: 0.8 * canvas.width,
            destWidth: 500,
            destHeight: 400,
        })
    },

    getScreenShot: function () {
        return canvas.toTempFilePathSync({})
    },

    getFriendRank: function (params) {
        let openDataContext = wx.getOpenDataContext()
        let msg = {
            type: 'getFriendRank',
            width: params.rect.width,
            height: params.rect.height,
        }
        if (WXGlobal.shareTicketEnabled) {
            msg.shareTicket = WXGlobal.shareTicket;
        }
        console.log(msg);

        openDataContext.postMessage(msg);
        if (params.callback) {
            params.callback('wx');
        }
    },
    getGroupRank: function (params) {
        var Util = require("Util");
        if (!WXGlobal.shareTicketEnabled || typeof this.shareTicket === 'undefined') {
            var image = Util.randomForArray(Global.shareImages);
            this.shareGame('res/raw-assets/resources/textures/gridItem/' + image, (shareTicket) => {
                    console.log('on get group rank pre share', shareTicket);
                    if (!shareTicket) {
                        if (params.callback) {
                            params.callback('failed');
                        }
                    } else {
                        let openDataContext = wx.getOpenDataContext()
                        let msg = {
                            type: 'getGroupRank',
                            width: params.rect.width,
                            height: params.rect.height,
                            shareTicket: shareTicket[0]
                        }
                        console.log(msg);
                        openDataContext.postMessage(msg);
                        if (params.callback) {
                            params.callback(shareTicket[0]);
                        }
                    }
                },
                () => {
                    if (params.callback) {
                        params.callback('failed');
                    }
                });
            return;
        } else {
            let openDataContext = wx.getOpenDataContext()
            let msg = {
                type: 'getGroupRank',
                width: params.rect.width,
                height: params.rect.height,
                shareTicket: this.shareTicket
            }
            console.log(msg);
            openDataContext.postMessage(msg);
            if (params.callback) {
                params.callback('success');
            }
        }
    },

    /*
    params:
    {
        KVDataList: [
            { key: 'maxscore', value: score + '' },
            { key: 'name', value: res.userInfo.nickName },
        ],
        success: function () {},
        failed: function () {},
        comlete: function () {},
    }
    kvdata的key和value必须为string
    */
    setUserCloudStorage: function (params) {
        console.log('setUserCloudStorage:', params);
        wx.setUserCloudStorage(params);
    },

    /*
    params:
    {
        maxscore: int,
        crystal: int,
        callback: function () {},
    }
    */
    saveScore: function (maxscore, gold, callback) {
        if (typeof wx === 'undefined') return;
        let obj = {
            KVDataList: [{
                    key: 'maxscore',
                    value: maxscore + ''
                },
                {
                    key: 'gold',
                    value: gold + ''
                },
            ],
            success: callback
        }
        console.log('wx saveScore:', obj);
        this.setUserCloudStorage(obj);
        this.setMaxScore(maxscore, gold);
    },
    loadScore: function (params) {
        // 微信无法在主域获取用户托管数据
        // if (typeof wx !== 'undefined') {
        //     console.log('wx loadScore:', params);
        //     this.getUserCloudStorage(params);
        // }
    },
    /*
参数格式:
{
    success: function () {},
    failed: function () {},
    comlete: function () {},
}
*/
    shakeShort: function (params) {
        wx.vibrateShort(params);
    },

    /*
    参数格式:
    {
        success: function () {},
        failed: function () {},
        comlete: function () {},
    }
    */
    shakeLong: function (params) {
        wx.vibrateLong(params);
    },
    exit: function () {
        wx.exitMiniProgram({
            success: (res) => {
                console.log('exit game:', res)
            }
        })
    },

    getSystemInfo: function () {
        return wx.getSystemInfoSync()
    },

}

module.exports = WXGlobal;