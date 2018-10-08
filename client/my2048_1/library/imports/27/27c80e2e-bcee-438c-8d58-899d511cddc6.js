"use strict";
cc._RF.push(module, '27c804uvO5DjI1YiZ1RHN3G', 'HttpUtil');
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
                method: 'POST',
                dataType: 'json',
                success: function success(res) {
                    console.log('tywx.HttpUtil.httpPost success', res);
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
                    tywx.LOGD('ty.HttpUtil.httpPost', 'post error! ' + cfgObj.url);
                }
            });
        }
    },

    httpGet: function httpGet(cfgObj, successcb, failcb) {
        if (tywx.IsWechatPlatform()) {
            tywx.LOGD('ty.HttpUtil.httpGet', 'url:' + cfgObj.url);
            wx.request({
                url: cfgObj.url,
                method: 'GET',
                success: function success(res) {
                    if (res.statusCode == 200) {
                        tywx.LOGD('ty.HttpUtil.httpGet', 'res:' + JSON.stringify(res.data));
                        if (successcb) {
                            successcb(res.data);
                        }
                    } else {
                        tywx.LOGD('ty.HttpUtil.httpGet', 'statusCode:' + res.statusCode);
                    }
                },
                fail: function fail(res) {
                    tywx.LOGD('ty.HttpUtil.httpGet', 'post error! ' + cfgObj.url);
                    if (failcb) {
                        failcb(res);
                    }
                }
            });
        }
    }
};

cc._RF.pop();