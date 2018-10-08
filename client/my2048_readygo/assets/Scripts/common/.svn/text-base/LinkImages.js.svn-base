/*
 * file : LinkImages.js
 * brief: This file can link images on different platforms.
 */

var LinkImages = {

    previewImage: function (url) {
            // WeChat
            if (typeof wx !== 'undefined') {
                wx.previewImage({
                    // current: ''; // 当前要显示的图片url
                    urls: [url], // 需要预览的图片url列表
                    success: (res) => {
                        console.log('preview success', res);
                    },
                    fail: (res) => {
                        console.log('preview fail', res);
                    },
                    // complete: () => {
    
                    // }
                });
            } 
            // Facebook
            else if (typeof FBInstant !== 'undefined') {
    
            }
    },

}

module.exports = LinkImages;