(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Scripts/common/wxAPI.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '7f6f0qagh5LFbhN7qubIwcf', 'wxAPI', __filename);
// Scripts/common/wxAPI.js

'use strict';

var _dataStatistics = require('./lib_dataStatistics/dataStatistics.js');

var _dataStatistics2 = _interopRequireDefault(_dataStatistics);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
        this.channelPrefix = '';

        this.setShareTicketEnabled(true);
        this.showShareMenu();
        // this.getAuth();
        this.registShare();
        this.registOnShow();
        this.registOnHide();
        this.registOnError();

        this.userInfo = {
            nickName: '不愿透露姓名的老王',
            maxscore: 0,
            gold: 0,
            iv: '',
            signature: '',
            gender: 1,
            avatarUrl: 'res/raw-assets/resources/textures/gridItem/rank_1.png'

            /*
            var sysInfo = wx.getSystemInfoSync();
            console.log('sysinfo: ', sysInfo, sysInfo.SDKVersion.replace(/\./g, ""));
            if (sysInfo.SDKVersion.slice(0, 5).replace(/\./g, "") >= 203) {
                this.GameClubButton = wx.createGameClubButton({
                    icon: 'green',
                    style: {
                        left: 20,
                        top: 20,
                        width: 40,
                        height: 40
                    }
                })
            }*/

            //this.showGameClub();
        };
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

    registOnError: function registOnError() {
        wx.onError(function (res) {
            console.log('wx error:' + res.message + '\nstack:\n' + res.stack);
        });
    },

    isFromGroup: function isFromGroup() {
        console.log('global shareticket', WXGlobal.shareTicket);
        console.log('WXGlobal helpInfo', WXGlobal.helpInfo);
        console.log('比较分享点是否为送宝箱点：', parseInt(WXGlobal.helpInfo.sourceCode), parseInt("3020000006"), parseInt(WXGlobal.helpInfo.sourceCode) == parseInt("3020000006"));

        if (!WXGlobal.shareTicket) {
            return -1;
        }
        if (!WXGlobal.helpInfo) {
            return -1;
        }

        if (parseInt(WXGlobal.helpInfo.sourceCode) === parseInt("3010000028")) {
            console.log('获得清除道具');
            return 1;
        }
        if (parseInt(WXGlobal.helpInfo.sourceCode) === parseInt("3010000029")) {
            console.log('获得万能道具');
            return 2;
        }
        if (parseInt(WXGlobal.helpInfo.sourceCode) === parseInt("3010000030")) {
            console.log('获得双倍道具');
            return 3;
        }
        return -1;
    },

    registOnShow: function registOnShow() {
        wx.onShow(function (info) {
            console.log('wx onShow+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++', info);
            if (info.shareTicket) {
                WXGlobal.shareTicket = info.shareTicket;
            }
            if (info.query) {
                WXGlobal.helpInfo = info.query;
            }

            //let dataStatistics = require("dataStatistics");
            _dataStatistics2.default.onShowInfo(info, function (res) {
                console.log('dataStatistics onShowInfo success: ', res);
                var msg = res.data; // 'success';
                if (msg == 'success') {
                    //注意，部分接口需要等待onShowInfo回调成功，如下:
                    //setKVUserData,getKVUserData,onShareAppMsg,onHideInfo,shareAppMsg,shareSuccess //以下不需要等待:getShareInfo,getGameConfigByAppkey

                    //this.gameSdkLogin(info);
                }
            }, function (err) {
                console.log(err);
            });
        });
    },

    registOnHide: function registOnHide() {
        wx.onHide(function (res) {
            console.log('wx onHide<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<', res);
            _dataStatistics2.default.onHideInfo();
        });
    },

    gameSdkLogin: function gameSdkLogin(info) {
        var gameSdk = require("gamesdk");

        var myBtn = {};
        gameSdk.login(function (res) {
            console.log('game sdk login...', res);
            var data = res.data;
            if (data.isNeedUpdateUserInfo) {
                //需要登录授权
                // dosomething...
                //代码示例:
                gameSdk.createUserInfoBtn('text', '获取用户信息', '', {
                    left: 0,
                    top: 0,
                    width: 640,
                    height: 1136,
                    lineHeight: 40,
                    backgroundColor: '#ff000000',
                    color: '#ffffff00',
                    textAlign: 'center',
                    fontSize: 16,
                    borderRadius: 4
                }, function (res) {
                    console.log(res);
                    if (res.code == 1) {
                        myBtn = res.data;
                        //点击刚刚创建的用户按钮,传点击信息 
                        myBtn.onTap(function (info) {
                            gameSdk.authorize(info, function (res) {
                                //授权成功,返回登录信息
                                // dosomething...
                                // let userInfo = data.userInfo; 
                                // let sessionId = data.sessionId; 
                                // let openId = data.openId; 
                                console.log('授权成功');

                                //隐藏按钮
                                myBtn.hide();
                            }, function (err) {
                                console.log(err); //打印错误回调 })
                            });
                        });
                    } else if (res.code == 0) {
                        //授权成功,返回登录信息
                        // let userInfo = data.userInfo; 
                        // let sessionId = data.sessionId; 
                        // let openId = data.openId;
                    }
                }, function (err) {
                    console.log(err);
                });
            } else {
                console.log('第三方SDK:不需要授权！');
                //不需要授权
                // dosomething
                //返回登录信息
                // let userInfo = data.userInfo; 
                // let sessionId = data.sessionId; 
                // let openId = data.openId;
            }
        }, function (err) {
            console.log('game sdk login failed :', err); //打印错误回调 
        });
    },

    pay: function pay() {
        var gameSdk = require("gamesdk");

        //平台点券跟游戏币比例根据具体情况而定 
        //当选择10人民币兑换100钻石的时候，输入如下代码,coin等于人民币 * 10，即为100 
        gameSdk.pay(100, 100, '钻石', '...param', function (res) {
            console.log(res);
            if (res.code == 10400) {
                //支付成功，到账可能延迟
                console.log('10400');
            } else if (res.code == 10401) {
                //支付成功
                console.log('10401');
            }
        }, function (err) {
            console.log(err);
            if (err.code == 0) {
                //充值开关没开，另作处理
                //err.data == 'audit'
            } else if (err.code == 10403) {
                //报错
                console.log('10403');
            } else if (err.code == 10402) {
                //订单被取消
                console.log('10402');
            } else if (err.code == 10102) {
                //服务器报错
                console.log('10102');
            } else if (err.code == 10405) {
                //用户取消支付
                console.log('10405');
            } else {
                //其他错误
                console.log(err);
            }
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

            //let dataStatistics = require("dataStatistics");

            //当分享信息需要常规右上角信息的时候 
            var EChannelPrefix = require("EChannelPrefix");
            console.log('*********************分享场景值: ', EChannelPrefix.regular);
            _this.channelPrefix = EChannelPrefix.regular;
            _dataStatistics2.default.getShareInfo(EChannelPrefix.regular);

            console.log("被动转发");
            var shareObj = {
                title: text,
                imageUrl: imageurl,
                query: '',
                success: function success(info) {
                    console.log("被动转发 成功:", info);
                    //代码在这里!!!
                    //需要传的参数:shareType 
                    //passive为右上角分享,initiative为主动分享 
                    var shareType = 'passive';
                    _dataStatistics2.default.shareSuccess(shareType);
                },
                complet: function complet(info) {
                    console.log("被动转发完成:", info);
                }
            };

            shareObj = _dataStatistics2.default.onShareAppMsg(shareObj);
            console.log(shareObj);
            return shareObj;

            /*
            return {
                title: text,
                imageUrl: imageurl,
                query: WXGlobal.queryString
            }*/

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
        });
    },

    sendChannelPrefix: function sendChannelPrefix(key) {
        //let dataStatistics = require("dataStatistics");

        //当分享信息需要常规右上角信息的时候 
        console.log('*********************分享场景值: ', key);
        this.channelPrefix = key;
        _dataStatistics2.default.getShareInfo(key, function (res) {
            console.log('======================getShareInfo success!', res);
            var imgUrl = res.data.data.image; // 分享图片路径 let title = res.data.data.title; // 分享文字信息
        }, function (err) {

            console.log('======================getShareInfo failed!', err);
            //注意:当小游戏处于断网时,或者其他错误时 console.log(err)
            var code = err.code; // 错误码10110
            var data = err.data; // {errMsg: "request:fail "} let msg = err.msg; // "request fail"
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
        } else if ((imageTag == "01" || imageTag == "02" || imageTag == "03") && Global.propShareImages) {
            console.log('imageTag:', Global.propShareImages, imageTag);
            imageurl = Global.propShareImages[imageTag];
            this.setQueryInfo(sourcecode, imageurl);
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
        if (imageTag == "01" || imageTag == "02" || imageTag == "03") {
            text = Global.propShareTexts[imageTag];
            console.log('道具分享文字', text);
        } else if (Global.cdnTexts && Global.cdnTexts.length > 0) {
            text = myUtil.randomForArray(Global.cdnTexts);
            console.log('从cdn请求分享文字：', text);
        } else {
            text = myUtil.randomForArray(Global.shareTexts);
            console.log('从本地读取分享文字：', text);
        }
        console.log('用户点击分享,query:', WXGlobal.queryString);

        //let dataStatistics = require("dataStatistics");
        console.log("主动转发");
        /*
        let shareObj = {
            title: text,
            imageUrl: imageurl,
            query: '',
            success: (info) => {
                console.log("主动转发 成功:", info);
                //代码在这里!!!
                //需要传的参数:shareType 
                //passive为右上角分享,initiative为主动分享 
                let shareType = 'initiative';
                dataStatistics.shareSuccess(shareType);
            },
            complet: info => {
                console.log("主动转发 完成:", info);
            }
        }*/

        var shareObj = {
            title: text,
            imageUrl: imageurl,
            query: WXGlobal.queryString,
            success: function success(res) {
                console.log('wx分享成功', res);

                console.log("主动转发 成功:", res);
                //代码在这里!!!
                //需要传的参数:shareType 
                //passive为右上角分享,initiative为主动分享 
                var shareType = 'initiative';
                _dataStatistics2.default.shareSuccess(shareType);

                if (res.shareTickets) {
                    WXGlobal.shareTicketEnabled = true;
                    WXGlobal.shareTicket = res.shareTickets[0];

                    if (callback != null) {
                        callback(null, WXGlobal.shareTicket);
                    }
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
        };

        _dataStatistics2.default.shareAppMsg(shareObj);

        /*
        WXGlobal.shareAppMessage({
            title: text,
            imageUrl: imageurl,
            query: WXGlobal.queryString,
            success: (res) => {
                console.log('wx分享成功', res);
                if (res.shareTickets) {
                    WXGlobal.shareTicketEnabled = true;
                    WXGlobal.shareTicket = res.shareTickets[0];
                     wx.getShareInfo({
                        shareTicket: res.shareTickets[0],
                        success: function (result) {
                            console.log('获取分享信息成功', result);
                            if (result) {
                                //判断秘钥是否有用
                                var iv = result.iv;
                                var encryptedData = result.encryptedData;
                                console.log('解析分享信息', tywx.UserInfo.wxgame_session_key, iv, encryptedData);
                                var resultString = WXGlobal.decrypt(tywx.UserInfo.wxgame_session_key, iv, encryptedData);
                                console.log(resultString);
                                if (resultString) {
                                    resultString = JSON.parse(resultString);
                                    let openid = '';
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
                            }
                        },
                        fail: () => {
                            console.log('获取分享信息失败');
                            if (failcallback) {
                                failcallback();
                            }
                        },
                        complete: () => {
                         },
                    })
                } else {
                    console.log('wx分享到群失败', failcallback);
                    if (failcallback) {
                        failcallback();
                    }
                }
            },
            fail: () => {
                console.log('wx分享失败', failcallback);
                if (failcallback) {
                    failcallback();
                }
            }
        });*/

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

    getFriendRank: function getFriendRank(params) {
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
                    params.callback('failed');
                }
            } else {
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
                    params.callback(shareTicket);
                    _this2.shareTicket = undefined;
                }
            }
        }, function () {
            //分享失败
            if (params.callback) {
                params.callback('failed');
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
        WXGlobal.queryString = 'nickName=' + WXGlobal.userInfo.nickName + '&' +
        //'inviteCode=' + tywx.UserInfo.userId + '&' +
        'sourceCode=' + 301 * 10000 + sourcecode + '&' +
        //'sourceCode=' + this.channelPrefix + '&' +
        'imageType=' + imageUrl;
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
        