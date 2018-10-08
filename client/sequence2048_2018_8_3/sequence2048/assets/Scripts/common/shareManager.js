wxGame.shareManager = {
    load: function () {
        this.getShareConfig();
        console.log('load shareConfig')
    },

    ShareState:{
        isNotAGroupChat : 1,   //不是群聊
        repetitionGroupChat : 2,  //重复群聊
        suscessShare : 3, //正常分享
        exShare : 4,
        failToGetShareTicket : 5,
        failToShare : 6,
        userInfoError : 7,
        shareError : 8
    },

    //从分享营销系统获取配置信息
    getShareConfig: function () {
        var obj = {};
        //获取分享参数
        tywx.PropagateInterface.getShareConfigInfo(obj);
    },

    //获取一个分享点
    //point 必须为3位，类似001  002  003,对应配置系统的后台
    getRandomShareByPoint: function (strpoint) {
        var shareKeys = [];

        console.log('getRandomShareByPoint------', strpoint);
        console.log(tywx.PropagateInterface.ShareConfig);
        for (var _key in tywx.PropagateInterface.ShareConfig) {
            var sharePointInfo = tywx.PropagateInterface.ShareConfig[_key];
            if (sharePointInfo && sharePointInfo.length > 0) {
                if (sharePointInfo[0].sharePointId == strpoint) {
                    shareKeys.push(_key);
                    console.log('_key');
                }
            }
        }

        if (shareKeys && shareKeys.length > 0) {
            var randomIndex = (Math.floor(Math.random() * 10000)) % shareKeys.length;
            var sharePointKey = shareKeys[randomIndex];
            var sharePointInfo = tywx.PropagateInterface.ShareConfig[sharePointKey];
            if (sharePointInfo && sharePointInfo.length > 0) {
                randomIndex = (Math.floor(Math.random() * 10000)) % sharePointInfo.length;
                var config = {
                    title: sharePointInfo[randomIndex].shareContent,
                    imageUrl: sharePointInfo[randomIndex].sharePicUrl,
                    sharePointId: sharePointInfo[randomIndex].sharePointId,
                    shareSchemeId: sharePointInfo[randomIndex].shareSchemeId
                };
                return config;
            }
        }
        return null;
    },

    //存储分享数据
    getShareResultWithKey:function(informationMap,shareKey){
        wxGame.LOGW("file = [shareManager] fun = [getShareResultWithKey]");
        var openGId = informationMap.openGId;
        var toDay = wxGame.GlobalFuncs.getCurDay();
        var lastShareTime = wxGame.GlobalFuncs.ReadStringFromLocalStorage("LAST_SHARE_TIME", "");
        var shareTicketsDic = {};
        if(toDay != lastShareTime){
            shareTicketsDic[shareKey] = [openGId];
            wxGame.GlobalFuncs.setInLocalStorage("SHARETICKETS_LIST", JSON.stringify(shareTicketsDic));
            wxGame.GlobalFuncs.setInLocalStorage("LAST_SHARE_TIME", toDay);
        }else {
            var shareTickets = wxGame.GlobalFuncs.ReadStringFromLocalStorage("SHARETICKETS_LIST", "");
            shareTicketsDic = JSON.parse(shareTickets);
            if(shareTicketsDic && shareTicketsDic[shareKey] && shareTicketsDic[shareKey].length){
                var shareList = shareTicketsDic[shareKey];
                if (shareList.indexOf(openGId) > -1){
                    wxGame.shareManager.resultType = wxGame.shareManager.ShareState.repetitionGroupChat;
                    wxGame.LOGE("file = [shareManager] fun = [getShareResultWithKey] 重复群");
                    return;
                }
                shareList.push(openGId);
                wxGame.GlobalFuncs.setInLocalStorage("SHARETICKETS_LIST", JSON.stringify(shareTicketsDic));
            }else {
                shareTicketsDic[shareKey] = [openGId];
                wxGame.GlobalFuncs.setInLocalStorage("SHARETICKETS_LIST", JSON.stringify(shareTicketsDic));
            }
        }
        wxGame.LOGE("file = [shareManager] fun = [getShareResultWithKey] 成功");
        wxGame.shareManager.resultType = wxGame.shareManager.ShareState.suscessShare;
    },

    sharePoint: function (strpoint, successcallback, failcallback) {
        var shareinfo = this.getRandomShareByPoint(strpoint);
        if (!shareinfo) {
            wxGame.GlobalFuncs.showToast("数据获取失败~");
        }
        var extraParam = {
            sendTime: (new Date()).getTime()
        };
        console.log("getRandomShareByPoint return : ", shareinfo, extraParam);
        wxGame.LOGW("file = [shareManager] fun = [sharePoint] strpoint = " + strpoint);
        if (shareinfo == null) {
            if (failcallback) {
                wxGame.LOGW("file = [shareManager] fun = [sharePoint] return");
                failcallback('fail');
            }
            return;
        }

        wxGame.shareManager.resultType = 0;
        wxGame.Global.isOnShare = true;
        wxGame.Global.sharePoint = strpoint;
        tywx.ShareInterface.share(shareinfo.title, shareinfo.imageUrl, shareinfo.sharePointId, shareinfo.shareSchemeId, function(obj) {
            console.log('sharecomplete:');
            console.log(obj);
            if (!(obj.shareTickets && obj.shareTickets.length > 0)) {
                wxGame.shareManager.resultType = wxGame.shareManager.ShareState.isNotAGroupChat;
                if (failcallback) {
                    failcallback('fail');
                }
                return;
            }
            wx.getShareInfo({
                shareTicket: obj.shareTickets[0],
                success: function (result) {
                    if (result) {
                        //判断秘钥是否有用
                        var iv = result.iv;
                        var encryptedData = result.encryptedData;
                        // try {
                            var resultString = wxGame.shareManager.decrypt(tywx.UserInfo.wxgame_session_key, iv, encryptedData);
                            console.log(resultString);
                            wxGame.LOGW("file = [shareManager] fun = [sharePoint] resultString: = " + JSON.stringify(resultString));
                            if (resultString) {
                                resultString = JSON.parse(resultString);
                                wxGame.shareManager.getShareResultWithKey(resultString,strpoint);
                                var openid = '';
                                // 分享
                                if (resultString.openGId) {
                                    openid = resultString.openGId;
                                }
                                wxGame.LOGW("file = [shareManager] fun = [sharePoint] 分享群ID: = " + JSON.stringify(openid));
                                if (successcallback != null) {
                                    successcallback(openid, obj.shareTickets[0]);
                                }

                            } else {
                                if (failcallback) {
                                    failcallback();
                                }
                            }
                        // } catch (error) {
                        //     wxGame.LOGW("file = [shareManager] fun = [sharePoint] error = " + JSON.stringify(error));
                        //     if (successcallback != null) {
                        //         successcallback(obj.shareTickets[0], obj.shareTickets[0]);
                        //     }
                        // }
                    }
                },
                fail: function() {
                    wxGame.LOGW("file = [shareManager] fun = [sharePoint] getUserInfo  fail: ");
                    if (failcallback) {
                        failcallback('cancel');
                    }
                    wxGame.shareManager.resultType = wxGame.shareManager.ShareState.failToGetShareTicket;
                },
                complete: function()  {
                    // if (failcallback) {
                    //     failcallback();
                    // }
                },
            })
        }, failcallback, extraParam);
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

};