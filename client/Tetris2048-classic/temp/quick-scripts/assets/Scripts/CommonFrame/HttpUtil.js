(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Scripts/CommonFrame/HttpUtil.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '27c804uvO5DjI1YiZ1RHN3G', 'HttpUtil', __filename);
// Scripts/CommonFrame/HttpUtil.js

'use strict';

/**
 * Created by xiaochuntian on 2018/5/2.
 */

tywx.HttpUtil = {
    httpPost: function httpPost(cfgObj, httpType) {
        if (tywx.IsWechatPlatform()) {
            wx.request({
                url: cfgObj.url,
                data: cfgObj.postData,
                header: cfgObj.header,
                method: httpType,
                dataType: 'json',
                success: function success(res) {
                    console.log(res);
                    if (res.statusCode == 200) {
                        //正常连接{"/api/bilog5/clientlog": "ok"}
                        if (res.data && res.data.hasOwnProperty('/api/bilog5/clientlog') && res.data['/api/bilog5/clientlog'] == "ok") {
                            tywx.LOGD('ty.HttpUtil.httpPost', 'post success! ');
                        }
                    } else {
                        tywx.LOGD('ty.HttpUtil.httpPost', 'statusCode:' + res.statusCode);
                    }
                },
                fail: function fail(res) {
                    console.log(res);
                    tywx.LOGD('ty.HttpUtil.httpPost', 'post error! ' + cfgObj.url);
                }
            });
        }
    }
};

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
        //# sourceMappingURL=HttpUtil.js.map
        