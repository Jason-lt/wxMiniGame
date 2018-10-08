(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Scripts/sdk_readygo/lib/config.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'f8a73uibbJGlKrgQGwqwY3f', 'config', __filename);
// Scripts/sdk_readygo/lib/config.js

'use strict';

var config = {
    api: 'https://h5game-websocket.gametall.com/', //请求统一域名

    appKey: "89418c70-67eb-11e8-adad-639eb01a1819", //自己生成的appKey，非微信功能产品

    appId: 'wxb5bbc7baaf5460c3', //小程序的appid

    isGetUserInfo: false //控制是否走自动弹授权
};

module.exports = config;

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
        //# sourceMappingURL=config.js.map
        