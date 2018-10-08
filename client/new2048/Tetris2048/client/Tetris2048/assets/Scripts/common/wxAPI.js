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

        var sysInfo = wx.getSystemInfoSync();
        console.log('sysinfo: ', sysInfo, sysInfo.SDKVersion.replace(/\./g, ""));
        if (sysInfo.SDKVersion.slice(0, 5).replace(/\./g, "") >= 203) {
            this.GameClubButton = wx.createGameClubButton({
                icon: 'green',
                style: {
                    left: 10,
                    top: 30,
                    width: 40,
                    height: 40
                }
            })
        }

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

    showGameClub: function (value) {
        if (!this.GameClubButton) return;

        if (value) {
            console.log('显示游戏圈按钮');
            this.GameClubButton.show()
        } else {
            console.log('隐藏游戏圈按钮');
            this.GameClubButton.hide()
        }
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
        var self = this;
        var myUtil = require("myUtil");
        this.onShareAppMessage(() => {
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
            this.setQueryInfo('001', imageurl);

            console.log('用户点击了右上按钮并分享,query:', WXGlobal.queryString);
            return {
                title: text,
                imageUrl: imageurl,
                query: WXGlobal.queryString
            }


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
        })
    },

    isFromGroup: function () {
        let ThirdAPI = require('../common/ThirdAPI');
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
        if (!Global.gameinfo.inviteUserList || Global.gameinfo.inviteUserList.inviteDate != (new Date(Date.now())).toDateString()) {
            Global.gameinfo.inviteUserList = {
                inviteDate: (new Date(Date.now())).toDateString(),
                userList: [],
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
            if ((new Date()).getTime() - parseInt(Global.helpInfo.extraParam.sendTime) > Global.cdnGameConfig.validTime) {
                console.log('奖励失效,超过了一小时不能领取奖励');
                return -1;
            }
        }

        if (parseInt(WXGlobal.helpInfo.sourceCode) === parseInt("028")) {
            console.log('获得清除道具');
            console.log('该群未领取过奖励', inviteCode);
            Global.gameinfo.inviteUserList.userList.push(inviteCode);
            ThirdAPI.saveFriendGenStoneInfo(Global.gameinfo);
            return 1;
        }
        if (parseInt(WXGlobal.helpInfo.sourceCode) === parseInt("029")) {
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

    getHelpInfo: function () {
        return WXGlobal.helpInfo;
    },

    registOnShow: function () {
        wx.onShow((res) => {
            console.log('wx onShow+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++', res);
            if (res.shareTicket) {
                WXGlobal.shareTicket = res.shareTicket;
            }

            Global.helpInfo = null;

            if (Global.adReward) {
                Global.adReward = false;
                //跳转成功,给奖励
                let ThirdAPI = require('../common/ThirdAPI');
                var isReward = ThirdAPI.loadAdGetGuideReward();
                if (!isReward) {
                    Global.game.showDialogPropText('恭喜获得30钻石');
                    Global.startUI.updateGold(30);
                    ThirdAPI.saveAdGetGuideReward();

                    if (tywx.AdManager.getAdNodeByTag("myFirstAdNode")) {
                        tywx.AdManager.getAdNodeByTag("myFirstAdNode").hideAdNode();
                    }
                }
            }


            if (res.query) {
                WXGlobal.helpInfo = res.query;
                Global.helpInfo = WXGlobal.helpInfo;
                console.log('registOnShow----', Global.helpInfo);
            }

            /*
                        wx.getSetting({});

                        //创建授权按钮
                        let button = wx.createUserInfoButton({
                            type: 'text',
                            text: '获取用户信息',
                            style: {
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
                            }
                        })
                        button.onTap((btnRes) => {
                            wx.authorize(res, btnRes => {
                                //授权成功,返回登录信息
                                // dosomething...
                                // let userInfo = data.userInfo; 
                                // let sessionId = data.sessionId; 
                                // let openId = data.openId; 
                                console.log('授权成功', res)

                                //隐藏按钮
                                button.hide();
                            }, err => {
                                console.log(err) //打印错误回调 })
                            })
                        })*/

        });
    },

    //分享  001点击转发   002点击群排行    003分享界面点击分享  004 复活界面
    shareGame: function (imageTag, callback, failcallback, sourcecode) {
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
            this.setQueryInfo(sourcecode, imageurl);
        }

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

        /*
                tywx.PropagateInterface.getShareConfigInfo();
                console.log('all ConfigInfo:' + tywx.PropagateInterface.ShareConfig);
                var config = tywx.PropagateInterface.getShareConfigInfo({
                    share_type: sourcecode + ""
                });
                console.log('config1:' + config);
                if (!config) {
                    config = tywx.ShareInterface.getRandomOnShareAppMessageInfo();
                }
                tywx.ShareInterface.setOnShareAppMessageInfo(config.title, config.imageUrl, config.sharePointId, config.shareSchemeId);
                console.log('config:', config);

                tywx.ShareInterface.share(
                    config.title,
                    config.imageUrl,
                    config.sharePointId,
                    config.shareSchemeId,
                    (res) => {
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
                    () => {
                        console.log('wx分享失败', failcallback);
                        if (failcallback) {
                            failcallback();
                        }
                    }
                );*/

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
                                try {
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
                                } catch (error) {
                                    if (callback != null) {
                                        callback(res.shareTickets[0], WXGlobal.shareTicket);
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
                        failcallback("fail");
                    }
                }
            },
            fail: () => {
                console.log('wx分享失败', failcallback);
                if (failcallback) {
                    failcallback("cancel");
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

    decrypt: function (key, iv, crypted) {
        var crypto = require('crypto');

        crypted = new Buffer(crypted, 'base64');
        iv = new Buffer(iv, 'base64');
        key = new Buffer(key, 'base64');
        var decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
        var decoded = decipher.update(crypted, 'binary', 'utf8');
        decoded += decipher.final('utf8');
        return decoded;
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

    getShareScreenShotForDown: function () {
        return canvas.toTempFilePathSync({
            x: 0,
            y: 0.5 * canvas.height + 0 * canvas.width,
            width: canvas.width,
            height: 0.8 * canvas.width,
            destWidth: 500,
            destHeight: 400,
        })
    },

    getScreenShot: function () {
        return canvas.toTempFilePathSync({})
    },


    initFriendRank: function () {
        try {
            let openDataContext = wx.getOpenDataContext()
            let msg = {
                type: 'initFriendRank',
            }
            if (WXGlobal.shareTicketEnabled) {
                msg.shareTicket = WXGlobal.shareTicket;
            }
            console.log(msg);

            openDataContext.postMessage(msg);
        } catch (error) {

        }
    },

    getNextFriendRank: function (params) {
        try {
            let openDataContext = wx.getOpenDataContext()
            let msg = {
                type: 'getNextFriend',
                score: params.score,
                width: params.rect.width,
                height: params.rect.height,
            }
            if (WXGlobal.shareTicketEnabled) {
                msg.shareTicket = WXGlobal.shareTicket;
            }
            //console.log(msg);

            openDataContext.postMessage(msg);
            if (params.callback) {
                params.callback('wx');
            }
        } catch (error) {

        }
    },

    getFriendRank: function (params) {
        try {
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
        } catch (error) {

        }
    },

    getGroupRank: function (params) {
        var myUtil = require("myUtil");
        //if (!WXGlobal.shareTicketEnabled || typeof this.shareTicket === 'undefined') {
        var image = myUtil.randomForArray(Global.shareImages);
        this.shareGame('res/raw-assets/resources/textures/gridItem/' + image, (openGId, shareTicket) => {
                console.log('on get group rank pre share', shareTicket);
                //分享给个人
                if (!shareTicket) {
                    if (params.callback) {
                        params.callback('failed');
                    }
                } else {
                    //分享给群
                    try {
                        let openDataContext = wx.getOpenDataContext()
                        let msg = {
                            type: 'getGroupRank',
                            width: params.rect.width,
                            height: params.rect.height,
                            shareTicket: shareTicket
                        }
                        console.log(msg);
                        openDataContext.postMessage(msg);
                        if (params.callback) {
                            params.callback(shareTicket);
                            this.shareTicket = undefined;
                        }
                    } catch (error) {

                    }
                }
            },
            () => {
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

    //每日挑战排行榜
    getDailyRank: function (params) {
        try {
            let openDataContext = wx.getOpenDataContext()
            let msg = {
                type: 'getDailyRank',
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
        } catch (error) {}
    },


    //好友互助奖励信息
    getMyInfo: function (params) {
        try {
            let openDataContext = wx.getOpenDataContext()
            let msg = {
                type: 'getMyInfo',
                width: params.rect.width,
                height: params.rect.height,
            }
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

    setQueryInfo: function (sourcecode, imageUrl) {
        WXGlobal.queryString =
            'nickName=' + WXGlobal.userInfo.nickName + '&' +
            'inviteCode=' + tywx.UserInfo.userId + '&' +
            'sourceCode=' + tywx.SystemInfo.gameId * 10000 + sourcecode + '&' +
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
    setUserCloudStorage: function (params) {
        console.log('setUserCloudStorage:', params);
        try {
            wx.setUserCloudStorage(params);
        } catch (error) {

        }
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
        //兼容dailyScore
        if (!Global.gameinfo) {
            var myUtil = require('myUtil');
            myUtil.resetInitData();
        }
        if (Global.gameinfo && !Global.gameinfo.dailyScore) {
            Global.gameinfo.dailyScore = 0;
        }

        let obj = {
            KVDataList: [{
                    key: 'maxscore',
                    value: maxscore + ''
                },
                {
                    key: 'gold',
                    value: gold + ''
                },
                {
                    key: 'dailyTime',
                    value: Global.gameinfo.dailyTime + ''
                },
                {
                    key: 'dailyScore',
                    value: Global.gameinfo.dailyScore + ''
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