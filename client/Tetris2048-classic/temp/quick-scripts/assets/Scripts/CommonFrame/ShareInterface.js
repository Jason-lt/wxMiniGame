(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Scripts/CommonFrame/ShareInterface.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'd8bb4jMhZVIZaNSaBbQ32Bq', 'ShareInterface', __filename);
// Scripts/CommonFrame/ShareInterface.js

"use strict";

/**
 * Created by xiaochuntian on 2018/5/3.
 */

tywx.ShareInterface = {
    shareWithPic: function shareWithPic(type, imageType, titleString, imagUrl, query, sharePoint, successCallBackFun, failCallBackFun) {
        if (tywx.IsWechatPlatform()) {
            wx.shareAppMessage({
                title: titleString,
                imageUrl: imagUrl, //5:4
                query: query, //'key1=val1&key2=val2',
                success: function success(result) {
                    //分享成功相关处理
                },
                fail: function fail() {
                    if (failCallBackFun) {
                        failCallBackFun();
                    }
                    //分享失败相关处理
                },
                complete: function complete() {}
            });
        }
    }
};

tywx.onShareAppMessageInit = function () {
    if (tywx.IsWechatPlatform()) {
        wx.onShareAppMessage(function (result) {});
    };
};

tywx.onShareAppMessageInit();

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
        //# sourceMappingURL=ShareInterface.js.map
        