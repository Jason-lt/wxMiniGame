(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Scripts/common/LinkImages.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'b2084Uv/U9J6ILP8+QAi1EV', 'LinkImages', __filename);
// Scripts/common/LinkImages.js

'use strict';

/*
 * file : LinkImages.js
 * brief: This file can link images on different platforms.
 */

var LinkImages = {

    previewImage: function previewImage(url) {
        // WeChat
        if (typeof wx !== 'undefined') {
            wx.previewImage({
                // current: ''; // 当前要显示的图片url
                urls: [url], // 需要预览的图片url列表
                success: function success(res) {
                    console.log('preview success', res);
                },
                fail: function fail(res) {
                    console.log('preview fail', res);
                }
                // complete: () => {

                // }
            });
        }
        // Facebook
        else if (typeof FBInstant !== 'undefined') {}
    }

};

module.exports = LinkImages;

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
        //# sourceMappingURL=LinkImages.js.map
        