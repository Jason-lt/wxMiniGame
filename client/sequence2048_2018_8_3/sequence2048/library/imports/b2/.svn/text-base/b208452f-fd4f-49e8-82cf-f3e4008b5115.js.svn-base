"use strict";
cc._RF.push(module, 'b2084Uv/U9J6ILP8+QAi1EV', 'LinkImages');
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