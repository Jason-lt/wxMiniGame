(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Scripts/common/shareManager.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '2f935PT1E9JNqpFrziXtWKK', 'shareManager', __filename);
// Scripts/common/shareManager.js

'use strict';

var shareManager = {
    load: function load() {
        this.getShareConfig();
        console.log('load shareConfig');
    },

    //从分享营销系统获取配置信息
    getShareConfig: function getShareConfig() {
        var obj = {};
        //获取分享参数
        tywx.PropagateInterface.getShareConfigInfo(obj);
    },

    //获取一个分享点
    //point 必须为3位，类似001  002  003,对应配置系统的后台
    getRandomShareByPoint: function getRandomShareByPoint(strpoint) {
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
            var randomIndex = Math.floor(Math.random() * 10000) % shareKeys.length;
            var sharePointKey = shareKeys[randomIndex];
            var sharePointInfo = tywx.PropagateInterface.ShareConfig[sharePointKey];
            if (sharePointInfo && sharePointInfo.length > 0) {
                randomIndex = Math.floor(Math.random() * 10000) % sharePointInfo.length;
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

    sharePoint: function sharePoint(strpoint, successcallback, failcallback, extraParam) {
        var shareinfo = this.getRandomShareByPoint(strpoint);
        console.log("getRandomShareByPoint return : ", shareinfo, extraParam);
        if (shareinfo == null) {
            if (failcallback) {
                failcallback('fail');
            }
            return;
        }
        tywx.ShareInterface.share(shareinfo.title, shareinfo.imageUrl, shareinfo.sharePointId, shareinfo.shareSchemeId, function (obj) {
            console.log('sharecomplete:');
            console.log(obj);
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
                            var resultString = Global.shareManager.decrypt(tywx.UserInfo.wxgame_session_key, iv, encryptedData);
                            console.log(resultString);
                            if (resultString) {
                                resultString = JSON.parse(resultString);
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
        }, failcallback, extraParam);
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
    }

};
shareManager.load();
module.exports = shareManager;

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
        //# sourceMappingURL=shareManager.js.map
        