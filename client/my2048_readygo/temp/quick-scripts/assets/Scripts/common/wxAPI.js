(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Scripts/common/wxAPI.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '7f6f0qagh5LFbhN7qubIwcf', 'wxAPI', __filename);
// Scripts/common/wxAPI.js

'use strict';

var _gamesdk = require('../sdk_readygo/gamesdk');

var _gamesdk2 = _interopRequireDefault(_gamesdk);

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
            console.log('sysinfo: ', sysInfo, sysInfo.SDKVersion.replace(/\./g, ""));
            if (sysInfo.SDKVersion.slice(0, 5).replace(/\./g, "") >= 203) {
                this.GameClubButton = wx.createGameClubButton({
                    icon: 'green',
                    style: {
                        left: 8,
                        top: 60,
                        width: 40,
                        height: 40
                    }
                });

                this.showGameClub(false);
            }
        } catch (error) {}

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
        var self = this;
        var shareObj;
        _gamesdk2.default.dataStatistics.getShareInfo('regular', function (res) {
            console.log(res);
            var imgUrl = res.data.data.image; // 分享图片路径
            var title = res.data.data.title; // 分享文字信息

            shareObj = {
                title: title,
                imageUrl: imgUrl,
                query: '?param1=abc&param2=efg'
            };
            shareObj = _gamesdk2.default.dataStatistics.onShareAppMsg(shareObj);

            // self.onShareAppMessage(shareObj);
            return shareObj;
        }, function (err) {
            console.log("onShareAppMessage :   err");
            //注意:当小游戏处于断网时,或者其他错误时
            console.log(err);
            var code = err.code; // 错误码10110
            var data = err.data; // {errMsg: "request:fail "}
            var msg = err.msg; // "request fail"
        }, '', '', '', '', '');

        self.onShareAppMessage(function () {
            console.log("右上角转发");

            _gamesdk2.default.dataStatistics.getShareInfo('regular', function (res) {
                console.log(res);
                var imgUrl = res.data.data.image; // 分享图片路径
                var title = res.data.data.title; // 分享文字信息

                shareObj = {
                    title: title,
                    imageUrl: imgUrl,
                    query: '?param1=abc&param2=efg'
                };
                shareObj = _gamesdk2.default.dataStatistics.onShareAppMsg(shareObj);

                // self.onShareAppMessage(shareObj);
                return shareObj;
            }, function (err) {
                console.log("onShareAppMessage :   err");
                //注意:当小游戏处于断网时,或者其他错误时
                console.log(err);
                var code = err.code; // 错误码10110
                var data = err.data; // {errMsg: "request:fail "}
                var msg = err.msg; // "request fail"
            }, '', '', '', '', '');

            return shareObj;
        });
    },

    isFromGroup: function isFromGroup() {
        var ThirdAPI = require('ThirdAPI');
        console.log('global shareticket', WXGlobal.shareTicket);
        console.log('WXGlobal helpInfo', WXGlobal.helpInfo);
        //console.log('比较分享点是否为送宝箱点：', parseInt(WXGlobal.helpInfo.sourceCode), parseInt(WXGlobal.helpInfo.sourceCode) == parseInt("3010000400"));

        if (!WXGlobal.shareTicket) {
            return -1;
        }
        if (!WXGlobal.helpInfo) {
            return -1;
        }

        //凌晨兼容判断
        if (!Global.gameinfo.inviteUserList || Global.gameinfo.inviteUserList.inviteDate != new Date(Date.now()).toDateString()) {
            Global.gameinfo.inviteUserList = {
                inviteDate: new Date(Date.now()).toDateString(),
                userList: []
            };
            ThirdAPI.saveFriendGenStoneInfo(Global.gameinfo);
        }
        //分享到同一群只能获得一次
        var inviteCode = parseInt(WXGlobal.helpInfo.inviteCode);
        if (Global.gameinfo && Global.gameinfo.inviteUserList) {
            console.log('领取群小卡片判断是否今日领取过');
            if (Global.gameinfo.inviteUserList.userList.indexOf(inviteCode) != -1) {
                console.log('该群已经领取过奖励', inviteCode);
                return -1;
            }
        }
        //额外参数
        if (Global.helpInfo.extraParam) {
            console.log('额外参数：', Global.helpInfo.extraParam);
            if (new Date().getTime() - parseInt(Global.helpInfo.extraParam.sendTime) > Global.cdnGameConfig.validTime) {
                console.log('奖励失效,超过了一小时不能领取奖励');
                return -1;
            }
        }

        if (parseInt(WXGlobal.helpInfo.sourceCode) === parseInt("248")) {
            console.log('获得清除道具');
            console.log('该群未领取过奖励', inviteCode);
            Global.gameinfo.inviteUserList.userList.push(inviteCode);
            ThirdAPI.saveFriendGenStoneInfo(Global.gameinfo);
            return 1;
        }
        if (parseInt(WXGlobal.helpInfo.sourceCode) === parseInt("249")) {
            console.log('获得万能道具');
            console.log('该群未领取过奖励', inviteCode);
            Global.gameinfo.inviteUserList.userList.push(inviteCode);
            ThirdAPI.saveFriendGenStoneInfo(Global.gameinfo);
            return 2;
        }
        if (parseInt(WXGlobal.helpInfo.sourceCode) === parseInt("3010000300")) {
            console.log('获得双倍道具');
            console.log('该群未领取过奖励', inviteCode);
            Global.gameinfo.inviteUserList.userList.push(inviteCode);
            ThirdAPI.saveFriendGenStoneInfo(Global.gameinfo);
            return 3;
        }
        if (parseInt(WXGlobal.helpInfo.sourceCode) === parseInt("137")) {
            console.log('获得钻石');
            console.log('该群未领取过奖励', inviteCode);
            Global.gameinfo.inviteUserList.userList.push(inviteCode);
            ThirdAPI.saveFriendGenStoneInfo(Global.gameinfo);
            return 4;
        }
        return -1;
    },

    getHelpInfo: function getHelpInfo() {
        return WXGlobal.helpInfo;
    },

    registOnShow: function registOnShow() {
        var myBtn = {};
        wx.onShow(function (showInfo) {
            console.log('wx onShow+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++', showInfo);
            if (showInfo.shareTicket) {
                WXGlobal.shareTicket = showInfo.shareTicket;
            }

            Global.helpInfo = null;
            if (showInfo.query) {
                WXGlobal.helpInfo = showInfo.query;
                Global.helpInfo = WXGlobal.helpInfo;
                console.log('registOnShow----', Global.helpInfo);
            }

            /*
            gamesdk.dataStatistics.onShowInfo(res, res1 => {
                console.log('dataStatistics onShowInfo success: ', res1)
                var openId = res1.data.openId; // 成功回调返回openId;
                
                gamesdk.coin.addUserOpenidMapping(showInfo, 0, res => {
                    console.log(res);
                    var gold = res.data.gold; //如果映射成功或者之前已经映射则返回金币
                }, err => {
                    if (err.data.code == 40111) {
                        console.log('没有找到平台openid,之前也没有做过映射');
                    }
                })
                
            }, err => {
                console.log("%%%%%%%%%%%%%", err)
            });*/

            _gamesdk2.default.game.login(function (res) {
                console.log(res);
                var data = res.data;
                if (data.isNeedUpdateUserInfo) {
                    //需要登录授权 
                    // dosomething...
                    //代码示例：
                    _gamesdk2.default.game.createUserInfoBtn('text', '获取用户信息', '', {
                        left: 0,
                        top: 0,
                        width: 640,
                        height: 1136,
                        lineHeight: 40,
                        backgroundColor: '#ffffff00',
                        color: '#ff000000',
                        textAlign: 'center',
                        fontSize: 16,
                        borderRadius: 4
                    }, function (res) {
                        console.log(res);
                        if (res.code == 1) {
                            myBtn = res.data;
                            //点击刚刚创建的用户按钮,传点击信息
                            myBtn.onTap(function (info) {
                                _gamesdk2.default.game.authorize(info, function (res) {
                                    //授权成功,返回登录信息
                                    // dosomething...
                                    // var userInfo = data.userInfo;
                                    // var sessionId = data.sessionId;
                                    // var openId = data.openId;
                                    console.log('授权成功');
                                    _gamesdk2.default.dataStatistics.onShowInfo(showInfo, function (res) {
                                        var openId = res.data.openId; // 成功回调返回openId;
                                        _gamesdk2.default.coin.addUserOpenidMapping(showInfo, 0, function (res) {
                                            console.log(res);
                                            var gold = res.data.gold; //如果映射成功或者之前已经映射则返回金币
                                        }, function (err) {
                                            if (err.data.code == 40111) {
                                                console.log('没有找到平台openid,之前也没有做过映射');
                                            }
                                        });
                                    }, function (err) {
                                        console.log(err);
                                    });
                                    //隐藏按钮
                                    myBtn.hide();
                                }, function (err) {
                                    console.log(err); //打印错误回调
                                });
                            });
                        } else if (res.code == 0) {
                            //授权成功,返回登录信息
                            // var userInfo = data.userInfo;
                            // var sessionId = data.sessionId;
                            // var openId = data.openId;
                            _gamesdk2.default.dataStatistics.onShowInfo(showInfo, function (res) {
                                var openId = res.data.openId; // 成功回调返回openId;
                                _gamesdk2.default.coin.addUserOpenidMapping(showInfo, 0, function (res) {
                                    console.log(res);
                                    var gold = res.data.gold; //如果映射成功或者之前已经映射则返回金币
                                }, function (err) {
                                    if (err.data.code == 40111) {
                                        console.log('没有找到平台openid,之前也没有做过映射');
                                    }
                                });
                            }, function (err) {
                                console.log(err);
                            });
                        }
                    }, function (err) {});
                } else {
                    //不需要授权
                    // dosomething
                    //返回登录信息
                    // var userInfo = data.userInfo;
                    // var sessionId = data.sessionId;
                    // var openId = data.openId;
                    _gamesdk2.default.dataStatistics.onShowInfo(showInfo, function (res) {
                        var openId = res.data.openId; // 成功回调返回openId;
                        _gamesdk2.default.coin.addUserOpenidMapping(showInfo, 0, function (res) {
                            console.log(res);
                            var gold = res.data.gold; //如果映射成功或者之前已经映射则返回金币
                        }, function (err) {
                            if (err.data.code == 40111) {
                                console.log('没有找到平台openid,之前也没有做过映射');
                            }
                        });
                    }, function (err) {
                        console.log(err);
                    });
                }
            }, function (err) {
                console.log(err); //打印错误回调
            });
        });
    },

    registOnHide: function registOnHide() {
        wx.onHide(function (res) {
            console.log('wx onHide<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<', res);
            _gamesdk2.default.dataStatistics.onHideInfo();
        });
    },

    //分享  001点击转发   002点击群排行    003分享界面点击分享  004 复活界面
    shareGame: function shareGame(imageTag, successcallback, failcallback, sourcecode, channelPrefix) {
        this.setQueryInfo(sourcecode, 'image');

        var that = this;
        _gamesdk2.default.dataStatistics.getShareInfo('regular', function (res) {
            console.log("------------------>获取分享管理信息：", res);
            var imgUrl = res.data.data.image; // 分享图片路径
            var title = res.data.data.title; // 分享文字信息

            var shareObj = {
                title: title,
                imageUrl: imgUrl,
                query: '',
                success: function success(obj) {
                    console.log("主动转发  成功：", obj);
                    console.log('sharecomplete:');
                    tywx.LOGE("", "file = [wxAPI] fun = [shareGame] obj = " + JSON.stringify(obj));
                    if (!(obj.shareTickets && obj.shareTickets.length > 0)) {
                        if (failcallback) {
                            failcallback('fail');
                        }
                        return;
                    }
                    wx.getShareInfo({
                        shareTicket: obj.shareTickets[0],
                        success: function success(result) {
                            if (result) {
                                //判断秘钥是否有用
                                var iv = result.iv;
                                var encryptedData = result.encryptedData;
                                try {
                                    var resultString = that.decrypt(tywx.UserInfo.wxgame_session_key, iv, encryptedData);
                                    console.log(resultString);
                                    if (resultString) {
                                        resultString = JSON.parse(resultString);
                                        tywx.LOGE("", "file = [wxAPI] fun = [shareGame] resultString = " + JSON.stringify(resultString));
                                        var openid = '';
                                        // 分享
                                        if (resultString.openGId) {
                                            openid = resultString.openGId;
                                        }
                                        console.log('分享群ID:', successcallback, openid);
                                        if (successcallback != null) {
                                            successcallback(openid, obj.shareTickets[0]);
                                        }
                                    } else {
                                        if (failcallback) {
                                            failcallback();
                                        }
                                    }
                                } catch (error) {
                                    console.log('分享出异常了*****', obj.shareTickets[0]);
                                    if (successcallback != null) {
                                        successcallback(obj.shareTickets[0], obj.shareTickets[0]);
                                    }
                                }
                            }
                        },
                        fail: function fail() {
                            if (failcallback) {
                                failcallback('cancel');
                            }
                        },
                        complete: function complete() {
                            // if (failcallback) {
                            //     failcallback();
                            // }
                        }
                    });
                },
                fail: function fail(info) {
                    console.log('wx分享失败', failcallback);
                    if (failcallback) {
                        failcallback("cancel");
                    }
                }
            };
            //gamesdk.dataStatistics.shareAppMsg(shareObj);
            tywx.LOGE("", "file = [wxAPI] fun = [shareGame] shareObj = " + JSON.stringify(shareObj));
            that.shareAppMessage(shareObj);
        }, function (err) {
            //注意:当小游戏处于断网时,或者其他错误时
            console.log(err);
            var code = err.code; // 错误码10110
            var data = err.data; // {errMsg: "request:fail "}
            var msg = err.msg; // "request fail"
        }, '', '', '', '', '');
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
            // tywx.LOGE("","file = [wxAPI] fun = [getNextFriendRank] ");
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
            //console.log(msg);

            openDataContext.postMessage(msg);
            if (params.callback) {
                params.callback('wx');
            }
        } catch (error) {
            // console.log("file = [wxAPI] fun = [getNextFriendRank]  error = ",error)
        }
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
        var _this = this;

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
                try {
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
                        _this.shareTicket = undefined;
                    }
                } catch (error) {}
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
            var openDataContext = wx.getOpenDataContext()
            var msg = {
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

    //每日挑战排行榜
    getDailyRank: function getDailyRank(params) {
        try {
            var openDataContext = wx.getOpenDataContext();
            var msg = {
                type: 'getDailyRank',
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

    //好友互助奖励信息
    getMyInfo: function getMyInfo(params) {
        try {
            var openDataContext = wx.getOpenDataContext();
            var msg = {
                type: 'getMyInfo',
                width: params.rect.width,
                height: params.rect.height
            };
            if (WXGlobal.shareTicketEnabled) {
                msg.shareTicket = WXGlobal.shareTicket;
            }
            console.log('getMyInfo:', msg);

            openDataContext.postMessage(msg);
            if (params.callback) {
                params.callback('wx');
            }
        } catch (error) {}
    },

    setQueryInfo: function setQueryInfo(sourcecode, imageUrl) {
        WXGlobal.queryString = 'nickName=' + WXGlobal.userInfo.nickName + '&' + 'inviteCode=' + tywx.UserInfo.userId + '&' + 'sourceCode=' + tywx.SystemInfo.gameId * 10000 + sourcecode + '&' + 'imageType=' + imageUrl;
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
        try {
            wx.setUserCloudStorage(params);
        } catch (error) {}
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
        //兼容dailyScore
        if (!Global.gameinfo) {
            var myUtil = require('myUtil');
            myUtil.resetInitData();
        }
        if (Global.gameinfo && !Global.gameinfo.dailyScore) {
            Global.gameinfo.dailyScore = 0;
        }

        var obj = {
            KVDataList: [{
                key: 'maxscore',
                value: maxscore + ''
            }, {
                key: 'gold',
                value: gold + ''
            }, {
                key: 'dailyTime',
                value: Global.gameinfo.dailyTime + ''
            }, {
                key: 'dailyScore',
                value: Global.gameinfo.dailyScore + ''
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

}; //import dataStatistics from '../lib_dataStatistics/dataStatistics.js';


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
        