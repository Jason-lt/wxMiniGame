(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Scripts/CommonFrame/OpenDataContextUtil.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '340caOLadJI+4UGPKFM4zCK', 'OpenDataContextUtil', __filename);
// Scripts/CommonFrame/OpenDataContextUtil.js

"use strict";

/**
 * Created by xiaochuntian on 2018/5/28.
 */

tywx.OpenDataContextUtil = {
    methodIndex: 0,
    methodCallDic: {},
    isOnTimer: false,
    /**
     * 开启检查定时器
     */
    initCheckTimer: function initCheckTimer() {
        if (this.isOnTimer) return;
        this.isOnTimer = true;
        var cb = function cb() {
            tywx.OpenDataContextUtil.checkOpenDataContextStat();
        };
        tywx.Timer.setTimer(cc.director, cb, 1 / 10, cc.macro.REPEAT_FOREVER, 0);
    },

    /**
     * 根据请求发出的列表,检查子域数据获取情况,结果分为成功|失败|超时三种,进行回调和事件通知
     */
    checkOpenDataContextStat: function checkOpenDataContextStat() {
        var openDataContext = wx.getOpenDataContext();
        var sharedCanvas = openDataContext.canvas;
        var context = sharedCanvas.getContext("2d");
        for (var key in this.methodCallDic) {
            tywx.LOGD("开始检查:" + key, "abcd");
            if (context[key]) {
                if (context[key]["status"] == true) {
                    //成功,有回调调回调,同时trigger事件出去
                    tywx.LOGD("success_callback:" + key, JSON.stringify(context[key]));
                    this.methodCallDic[key]["success_callback"] && this.methodCallDic[key]["success_callback"](context[key]["data"]);
                    tywx.NotificationCenter.trigger(tywx.EventType.GET_OPEN_DATA_RESULT_SUCCESS, [key, context[key]["data"]]);
                } else {
                    //失败,
                    tywx.LOGD("success_callback:" + key, JSON.stringify(context[key]));
                    this.methodCallDic[key]["fail_callback"] && this.methodCallDic[key]["fail_callback"](context[key]["data"]);
                    tywx.NotificationCenter.trigger(tywx.EventType.GET_OPEN_DATA_RESULT_FAIL, [key, context[key]["data"]]);
                }
                delete context[key];
                delete this.methodCallDic[key];
            } else {
                if (new Date().valueOf() - this.methodCallDic[key]["time"] > 2000) {
                    //两秒都没返回
                    //超时
                    tywx.NotificationCenter.trigger(tywx.EventType.GET_OPEN_DATA_RESULT_TIMEOUT, [key]);
                    delete context[key];
                    delete this.methodCallDic[key];
                }
            }
        }
    },

    /**
     * 向子域请求获取用户信息
     * @param successCallBack
     * @param failCallBack
     * @returns {string}
     */
    getUserInfo: function getUserInfo(successCallBack, failCallBack) {
        var methodName = "getUserInfo";
        var methodId = methodName + this.methodIndex;
        var openDataContext = wx.getOpenDataContext();
        openDataContext.postMessage({
            method: methodName,
            data: {
                method_id: methodId
            }
        });
        this.methodIndex++;
        this.methodCallDic[methodId] = {
            time: new Date().valueOf(),
            success_callback: successCallBack,
            fail_callback: failCallBack
        };
        return methodId;
    },

    /**
     * 更新上报信息,更新内容由调用者传入,格式为{key1:value1,key2:value2}
     * @param data
     * @returns {string}
     */
    updateRankData: function updateRankData(data) {
        var methodName = "updateRankData";
        var methodId = methodName + this.methodIndex;
        var kv = [];
        for (var key in data) {
            var item = {
                "key": key.toString(),
                "value": data[key].toString()
            };
            kv.push(item);
        }
        var openDataContext = wx.getOpenDataContext();
        openDataContext.postMessage({
            method: methodName,
            data: {
                method_id: methodId,
                kvDataList: kv
            }
        });
        this.methodIndex++;
        return methodId;
    },

    /**
     * 向子域请求好友排行榜信息
     * @param keyList
     * @param successCallBack
     * @param failCallBack
     * @returns {string}
     */
    getFriendRankData: function getFriendRankData(keyList, successCallBack, failCallBack) {
        var methodName = "getFriendRankData";
        var methodId = methodName + this.methodIndex;
        var baseList = ["avatarUrl", "nickName"];
        for (var key in baseList) {
            if (keyList.indexOf(baseList[key]) < 0) {
                keyList.push(baseList[key].toString());
            }
        }
        var openDataContext = wx.getOpenDataContext();
        openDataContext.postMessage({
            method: 'getFriendRankData',
            data: {
                method_id: methodId,
                keyList: keyList
            }
        });
        this.methodCallDic[methodId] = {
            time: new Date().valueOf(),
            success_callback: successCallBack,
            fail_callback: failCallBack
        };
        return methodId;
    },

    /**
     * 向子域请求获取群排行榜信息
     * @param keyList
     * @param shareTicket
     * @param successCallBack
     * @param failCallBack
     * @returns {string}
     */
    getGroupRankData: function getGroupRankData(keyList, shareTicket, successCallBack, failCallBack) {
        var methodName = "getFriendRankData";
        var methodId = methodName + this.methodIndex;
        var baseList = ["avatarUrl", "nickName"];
        for (var key in baseList) {
            if (keyList.indexOf(baseList[key]) < 0) {
                keyList.push(baseList[key].toString());
            }
        }
        var openDataContext = wx.getOpenDataContext();
        openDataContext.postMessage({
            method: 'getGroupRankData',
            data: {
                method_id: methodId,
                shareTicket: shareTicket,
                keyList: keyList
            }
        });
        this.methodCallDic[methodId] = {
            time: new Date().valueOf(),
            success_callback: successCallBack,
            fail_callback: failCallBack
        };
        return methodId;
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
        //# sourceMappingURL=OpenDataContextUtil.js.map
        