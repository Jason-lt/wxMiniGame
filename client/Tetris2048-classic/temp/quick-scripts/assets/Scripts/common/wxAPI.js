(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Scripts/common/wxAPI.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '7f6f0qagh5LFbhN7qubIwcf', 'wxAPI', __filename);
// Scripts/common/wxAPI.js

'use strict';

var WXGlobal = {

    initOnEnter: function initOnEnter() {
        console.log('get launch options');
        var options = this.getLaunchOptionsSync();
        console.log('launch options', options);
        this.shareTicket = options.shareTicket;
        this.scene = options.scene;
        this.query = options.query;
        this.isSticky = options.isSticky;
        this.queryString = '';
        this.helpInfo = null;

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
        };

        try {
            var sysInfo = wx.getSystemInfoSync();

            this.GameClubButton = wx.createGameClubButton({
                icon: 'green',
                style: {
                    left: 10,
                    top: sysInfo.screenHeight / 2 - 20 - 25,
                    width: 40,
                    height: 40
                }
            });
        } catch (error) {}

        //this.showGameClub();
    },

    showGameClub: function showGameClub(value) {
        if (!this.GameClubButton) return;

        if (value) {
            console.log('显示游戏圈按钮');
            this.GameClubButton.show();
        } else {
            console.log('隐藏游戏圈按钮');
            this.GameClubButton.hide();
        }
    },

    isFromGroup: function isFromGroup() {
        console.log('isFromGroup', WXGlobal.shareTicket, WXGlobal.helpInfo);
        console.log('比较分享点是否为送宝箱点：', parseInt(WXGlobal.helpInfo.sourceCode), parseInt("3020000006"), parseInt(WXGlobal.helpInfo.sourceCode) == parseInt("3020000006"));

        return WXGlobal.shareTicket && WXGlobal.helpInfo && parseInt(WXGlobal.helpInfo.sourceCode) == parseInt("3020000006");
    },

    // 获取游戏进入的微信群分享点
    getEnterGroupShareInfo: function getEnterGroupShareInfo() {
        console.log('getEnterGroupSharePoint', WXGlobal.shareTicket, WXGlobal.helpInfo);

        if (!WXGlobal.shareTicket) {
            console.log('不是从微信群点击进入！', WXGlobal.shareTicket);
            return null;
        }

        return WXGlobal.helpInfo;
    },

    registOnShow: function registOnShow(params) {
        wx.onShow(function (res) {
            console.log('------------------wx onShow-------------------', res);
            if (res.shareTicket) {
                WXGlobal.shareTicket = res.shareTicket;
            }
            if (res.query) {
                WXGlobal.helpInfo = res.query;
            }
            /*
            if (params.callback) {
                params.callback();
            }*/

            if (Global.judgeReviveCoin) {
                Global.judgeReviveCoin(WXGlobal.shareTicket, WXGlobal.helpInfo);
            }
        });
    },

    registOnError: function registOnError() {
        wx.onError(function (res) {
            console.log('wx error:' + res.message + '\nstack:\n' + res.stack);
        });
    },

    getAuth: function getAuth(callback) {
        wx.getUserInfo({
            success: function success(res) {
                // iOS 和 Android 对于拒绝授权的回调 errMsg 没有统一，需要做一下兼容处理
                console.log(res);
                WXGlobal.userInfo = res.userInfo;
                WXGlobal.setUserCloudStorage({
                    KVDataList: [{
                        key: 'name',
                        value: res.userInfo.nickName
                    }, {
                        key: 'gender',
                        value: res.userInfo.gender + ''
                    }, {
                        key: 'avatarUrl',
                        value: res.userInfo.avatarUrl
                    }, {
                        key: 'iv',
                        value: res.iv
                    }, {
                        key: 'signature',
                        value: res.signature
                    }],
                    success: function success() {
                        console.log('set User Cloud Storage success');
                    }
                });
            },
            fail: function fail(res) {
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
                    };
                    console.log('set UserInfo default');
                }
            },
            complete: function complete() {
                if (callback) {
                    callback();
                }
            }
        });
    },

    registShare: function registShare() {
        var _this = this;

        var self = this;
        var myUtil = require("myUtil");
        this.onShareAppMessage(function () {
            //self.shareGame('randomImg', null, null, '001');

            //分享图片
            var imageurl;
            if (Global.cdnShareImages && Global.cdnShareImages.length > 0) {
                imageurl = myUtil.randomForArray(Global.cdnShareImages);
                console.log('从cdn请求分享图：', imageurl);
            } else {
                var image = myUtil.randomForArray(Global.shareImages);
                imageurl = 'res/raw-assets/resources/textures/gridItem/' + image;
                console.log('从本地请求分享图：', imageurl);
            }

            //分享文字
            var text;
            if (Global.cdnTexts && Global.cdnTexts.length > 0) {
                text = myUtil.randomForArray(Global.cdnTexts);
                console.log('从cdn请求分享文字：', text);
            } else {
                text = myUtil.randomForArray(Global.shareTexts);
                console.log('从本地读取分享文字：', text);
            }

            // var img = myUtil.randomForArray(Global.shareImages);
            // imageurl = 'res/raw-assets/resources/textures/gridItem/' + img;
            _this.setQueryInfo('001', imageurl);

            console.log('用户点击了右上按钮并分享,query:', WXGlobal.queryString);
            return {
                title: text,
                imageUrl: imageurl,
                query: WXGlobal.queryString

                /*
                            var myUtil = require("myUtil");
                            var text = myUtil.randomForArray(Global.shareTexts);
                            console.log('用户点击了右上按钮并分享,query:', WXGlobal.queryString, ' text:' + text);
                            var img = WXGlobal.getShareScreenShot();
                             self.setQueryInfo(sourcecode, imageurl);
                             WXGlobal.shareAppMessage({
                                title: text,
                                imageUrl: img,
                                query: WXGlobal.queryString
                            });*/
            };
        });
    },

    //分享  001点击转发   002点击群排行    003分享界面点击分享  004 复活界面
    shareGame: function shareGame(imageTag, callback, failcallback, sourcecode) {
        var myUtil = require("myUtil");

        var imageurl;
        if (imageTag == "screenshot") {
            imageurl = WXGlobal.getShareScreenShot();
            this.setQueryInfo(sourcecode, 'screenshot');
        } else if (imageTag == "screenshotForDown") {
            imageurl = WXGlobal.getShareScreenShotForDown();
            this.setQueryInfo(sourcecode, 'screenshot');
        } else {
            if (Global.cdnShareImages && Global.cdnShareImages.length > 0) {
                imageurl = myUtil.randomForArray(Global.cdnShareImages);
                console.log('从cdn请求分享图：', imageurl);
            } else {
                var img = myUtil.randomForArray(Global.shareImages);
                imageurl = 'res/raw-assets/resources/textures/gridItem/' + img;
                console.log('从本地请求分享图：', imageurl);
            }

            // var img = myUtil.randomForArray(Global.shareImages);
            // imageurl = 'res/raw-assets/resources/textures/gridItem/' + img;
            this.setQueryInfo(sourcecode, imageurl);
        }
        /*
                if (!imageurl) {
                    imageurl = myUtil.randomForArray(Global.shareImages);
                } else {
                    imageurl = 'ScreenShot';
                }*/

        //分享文字
        var text;
        if (Global.cdnTexts && Global.cdnTexts.length > 0) {
            text = myUtil.randomForArray(Global.cdnTexts);
            console.log('从cdn请求分享文字：', text);
        } else {
            text = myUtil.randomForArray(Global.shareTexts);
            console.log('从本地读取分享文字：', text);
        }
        console.log('用户点击分享,query:', WXGlobal.queryString);

        if (sourcecode == '005' || sourcecode == '006') {
            //text = '20W分大佬都在用的道具免费送，快来抢吧！';
            if (Global.cdnShareImages1 && Global.cdnShareImages1.length > 0 && Global.cdnTexts1 && Global.cdnTexts1.length > 0) {
                var index = myUtil.randomIndexForArray(Global.cdnShareImages1);
                imageurl = Global.cdnShareImages1[index];
                text = Global.cdnTexts1[index];
                console.log('从cdn请求分享图：', imageurl, text);
            }
        }

        WXGlobal.shareAppMessage({
            title: text,
            imageUrl: imageurl,
            query: WXGlobal.queryString,
            success: function success(res) {
                console.log('wx分享成功', res);
                if (res.shareTickets) {
                    WXGlobal.shareTicketEnabled = true;
                    WXGlobal.shareTicket = res.shareTickets[0];

                    wx.getShareInfo({
                        shareTicket: res.shareTickets[0],
                        success: function success(result) {
                            console.log('获取分享信息成功', result);
                            if (result) {
                                //判断秘钥是否有用
                                var iv = result.iv;
                                var encryptedData = result.encryptedData;
                                console.log('解析分享信息', tywx.UserInfo.wxgame_session_key, iv, encryptedData);
                                try {
                                    var resultString = WXGlobal.decrypt(tywx.UserInfo.wxgame_session_key, iv, encryptedData);
                                    console.log(resultString);
                                    if (resultString) {
                                        resultString = JSON.parse(resultString);
                                        var openid = '';
                                        // 分享
                                        if (resultString.openGId) {
                                            openid = resultString.openGId;
                                        }
                                        console.log('分享群ID:', openid);
                                        if (callback != null) {
                                            callback(openid, WXGlobal.shareTicket);
                                        }
                                    } else {
                                        if (failcallback) {
                                            failcallback();
                                        }
                                    }
                                } catch (error) {}
                            }
                        },
                        fail: function fail() {
                            console.log('获取分享信息失败');
                            if (failcallback) {
                                failcallback();
                            }
                        },
                        complete: function complete() {}
                    });
                } else {
                    console.log('wx分享到群失败', failcallback);
                    if (failcallback) {
                        failcallback();
                    }
                }
            },
            fail: function fail() {
                console.log('wx分享失败', failcallback);
                if (failcallback) {
                    failcallback();
                }
            }
        });

        // WXGlobal.shareAppMessage({
        //     title: text,
        //     imageUrl: imageurl,
        //     query: WXGlobal.queryString,
        //     /*success: (res) => {
        //         console.log('wx分享成功', res);
        //         if (res.shareTickets) {
        //             WXGlobal.shareTicketEnabled = true;
        //             WXGlobal.shareTicket = res.shareTickets[0];
        //         }
        //         if (callback) {
        //             callback(res.shareTickets);
        //         }
        //     },*/

        //     success: function (result) {
        //         wx.getShareInfo({
        //             shareTicket: result.shareTickets[0],
        //             success: function (result) {
        //                 console.log('获取分享信息成功', result);
        //                 if (result) {
        //                     //判断秘钥是否有用
        //                     var iv = result.iv;
        //                     var encryptedData = result.encryptedData;
        //                     console.log('解析分享信息', tywx.UserInfo.wxgame_session_key, iv, encryptedData);
        //                     var resultString = WXGlobal.decrypt(tywx.UserInfo.wxgame_session_key, iv, encryptedData);
        //                     console.log(resultString);
        //                     if (resultString) {
        //                         resultString = JSON.parse(resultString);
        //                         let openid = '';
        //                         // 分享
        //                         if (resultString.openGId) {
        //                             openid = resultString.openGId;
        //                         }
        //                         console.log('分享群ID:', openid);
        //                         if (callback != null) {
        //                             callback(openid, result.);
        //                         }
        //                     } else {
        //                         if (failcallback) {
        //                             failcallback();
        //                         }
        //                     }
        //                 }
        //             },
        //             fail: () => {
        //                 console.log('获取分享信息失败');
        //                 if (failcallback) {
        //                     failcallback();
        //                 }
        //             },
        //             complete: () => {

        //             },
        //         });

        //     },
        //     fail: () => {
        //         console.log('wx分享失败', failcallback);
        //         if (failcallback) {
        //             failcallback();
        //         }
        //     },
        // })
    },

    decrypt: function decrypt(key, iv, crypted) {
        var crypto = require('crypto');

        crypted = new Buffer(crypted, 'base64');
        iv = new Buffer(iv, 'base64');
        key = new Buffer(key, 'base64');
        var decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
        var decoded = decipher.update(crypted, 'binary', 'utf8');
        decoded += decipher.final('utf8');
        return decoded;
    },

    login: function login(callback) {
        wx.login(callback);
    },

    setMaxScore: function setMaxScore(maxscore, gold) {

        WXGlobal.queryString = 'nickName=' + WXGlobal.userInfo.nickName + '&' + 'maxscore=' + maxscore + '&' + 'gold=' + gold + '&' + 'gender=' + WXGlobal.userInfo.gender + '&' + 'avatarUrl=' + WXGlobal.userInfo.avatarUrl;

        console.log('wx setMaxScore, query:', WXGlobal.queryString);
    },

    // 返回小程序启动参数
    getLaunchOptionsSync: function getLaunchOptionsSync() {
        return wx.getLaunchOptionsSync();
    },

    setShareTicketEnabled: function setShareTicketEnabled(isEnabled) {
        wx.updateShareMenu({
            withShareTicket: isEnabled,
            success: function success() {
                WXGlobal.shareTicketEnabled = isEnabled;
            }
        });
    },

    getShareInfo: function getShareInfo(obj) {
        return wx.getShareInfo(obj);
    },

    getShareUserInfo: function getShareUserInfo() {
        return this.query;
    },

    showShareMenu: function showShareMenu() {
        console.log('显示右上菜单的转发按钮');
        wx.showShareMenu();
    },
    hideShareMenu: function hideShareMenu() {
        console.log('隐藏右上菜单的转发按钮');
        wx.hideShareMenu();
    },
    onShareAppMessage: function onShareAppMessage(callback) {
        console.log('注册点击转发按钮事件');
        wx.onShareAppMessage(callback);
    },
    shareAppMessage: function shareAppMessage(params) {
        console.log('转发:', params);
        wx.shareAppMessage(params);
    },

    getShareScreenShot: function getShareScreenShot() {
        return canvas.toTempFilePathSync({
            x: 0,
            y: 0.5 * canvas.height - 0.8 * 0.8 * canvas.width,
            width: canvas.width,
            height: 0.8 * canvas.width,
            destWidth: 500,
            destHeight: 400
        });
    },

    getShareScreenShotForDown: function getShareScreenShotForDown() {
        return canvas.toTempFilePathSync({
            x: 0,
            y: 0.5 * canvas.height + 0 * canvas.width,
            width: canvas.width,
            height: 0.8 * canvas.width,
            destWidth: 500,
            destHeight: 400
        });
    },

    getScreenShot: function getScreenShot() {
        return canvas.toTempFilePathSync({});
    },

    initFriendRank: function initFriendRank() {
        try {
            var openDataContext = wx.getOpenDataContext();
            var msg = {
                type: 'initFriendRank'
            };
            if (WXGlobal.shareTicketEnabled) {
                msg.shareTicket = WXGlobal.shareTicket;
            }
            console.log(msg);

            openDataContext.postMessage(msg);
        } catch (error) {}
    },

    getNextFriendRank: function getNextFriendRank(params) {
        try {
            var openDataContext = wx.getOpenDataContext();
            var msg = {
                type: 'getNextFriend',
                score: params.score,
                width: params.rect.width,
                height: params.rect.height
            };
            if (WXGlobal.shareTicketEnabled) {
                msg.shareTicket = WXGlobal.shareTicket;
            }
            console.log(msg);

            openDataContext.postMessage(msg);
            if (params.callback) {
                params.callback('wx');
            }
        } catch (error) {}
    },

    getFriendRank: function getFriendRank(params) {
        try {
            var openDataContext = wx.getOpenDataContext();
            var msg = {
                type: 'getFriendRank',
                width: params.rect.width,
                height: params.rect.height
            };
            if (WXGlobal.shareTicketEnabled) {
                msg.shareTicket = WXGlobal.shareTicket;
            }
            console.log(msg);

            openDataContext.postMessage(msg);
            if (params.callback) {
                params.callback('wx');
            }
        } catch (error) {}
    },

    getGroupRank: function getGroupRank(params) {
        var _this2 = this;

        var myUtil = require("myUtil");
        //if (!WXGlobal.shareTicketEnabled || typeof this.shareTicket === 'undefined') {
        var image = myUtil.randomForArray(Global.shareImages);
        this.shareGame('res/raw-assets/resources/textures/gridItem/' + image, function (openGId, shareTicket) {
            console.log('on get group rank pre share', shareTicket);
            //分享给个人
            if (!shareTicket) {
                if (params.callback) {
                    params.callback();
                }
            } else {
                try {
                    //分享给群
                    var openDataContext = wx.getOpenDataContext();
                    var msg = {
                        type: 'getGroupRank',
                        width: params.rect.width,
                        height: params.rect.height,
                        shareTicket: shareTicket
                    };
                    console.log(msg);
                    openDataContext.postMessage(msg);
                    if (params.callback) {
                        params.callback(openGId, shareTicket);
                        _this2.shareTicket = undefined;
                    }
                } catch (error) {}
            }
        }, function () {
            //分享失败
            if (params.callback) {
                params.callback();
            }
        }, '002');
        return;
        //} 
        /*else {
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
        }*/
    },

    setQueryInfo: function setQueryInfo(sourcecode, imageUrl) {
        WXGlobal.queryString = 'nickName=' + WXGlobal.userInfo.nickName + '&' + 'inviteCode=' + tywx.UserInfo.userId + '&' + 'sourceCode=' + tywx.SystemInfo.gameId * 10000 + sourcecode + '&' + 'imageType=' + imageUrl + '&' + 'shareTime=' + new Date();
        console.log(WXGlobal.queryString);
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
    setUserCloudStorage: function setUserCloudStorage(params) {
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
    saveScore: function saveScore(maxscore, gold, callback) {
        if (typeof wx === 'undefined') return;
        var obj = {
            KVDataList: [{
                key: 'maxscore',
                value: maxscore + ''
            }, {
                key: 'gold',
                value: gold + ''
            }],
            success: callback
        };
        console.log('wx saveScore:', obj);
        this.setUserCloudStorage(obj);
        this.setMaxScore(maxscore, gold);
    },
    loadScore: function loadScore(params) {
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
    shakeShort: function shakeShort(params) {
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
    shakeLong: function shakeLong(params) {
        wx.vibrateLong(params);
    },
    exit: function exit() {
        wx.exitMiniProgram({
            success: function success(res) {
                console.log('exit game:', res);
            }
        });
    },

    getSystemInfo: function getSystemInfo() {
        return wx.getSystemInfoSync();
    }

};

module.exports = WXGlobal;

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
        //# sourceMappingURL=wxAPI.js.map
        