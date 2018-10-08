"use strict";
cc._RF.push(module, 'd60a4qJ+JRMhbuRZF5NMHVS', 'GlobalInit');
// Scripts/CommonFrame/GlobalInit.js

'use strict';

/**
 * Created by xiaochuntian on 2018/5/2.
 */
//基础状态信息
tywx.StateInfo = {
    debugMode: false,
    networkConnected: true, //网络状态
    networkType: 'none', //网络类型
    isOnForeground: true //当前是否是在前台
};

//应用系统信息
tywx.SystemInfo = {
    clientId: 'H5_2.0_weixin.weixin.0-hall302.weixin.sx2048',
    intClientId: 23142,
    cloudId: 30, //休闲游戏统一用30，区分每个独服的标识
    version: 2.0,
    webSocketUrl: 'ws://192.168.10.88/',
    loginUrl: 'https://xyxsx.nalrer.cn/', //韩二辉提供
    deviceId: 'wechatGame',
    wxAppId: 'wxf811feddef45fc13', //旅行小西瓜wxAPPid
    appId: 10902,
    gameId: 302,
    cdnPath: "https://richqn.nalrer.cn/dizhu/",
    remotePackPath: "remote_res/res.zip",
    biLogServer: "https://cbi.touch4.me/api/bilog5/text",
    errorLogServer: "https://clienterr.touch4.me/api/bilog5/clientlog"
};

tywx.UserInfo = {
    userId: 0,
    userName: 'TuWechatGame',
    userPic: '',
    authorCode: '',
    systemType: 0, //1:苹果非iPhone X  2:iPhone X 3、安卓
    wechatType: "6.6.1", //微信版本号
    model: "未知设备",
    system: "iOS 10.0.1",
    loc: '',
    scene_id: "",
    scene_param: "",
    invite_id: 0,
    wxgame_session_key: ""
};

/**
 * 日志相关方法,若不符合项目组标准,可自行进行扩展
 */
tywx.LOGD = function (tag, msg) {
    if (!tywx.debugNode) {
        return;
    }
    tag = tag || "tywx";
    var logStr = tag + ' : ' + msg;
    console.log(logStr);
};

tywx.LOGE = function (tag, msg) {
    if (!tywx.debugNode) {
        return;
    }
    tag = tag || "tywx";
    var logStr = tag + ' : ' + msg;
    console.error(logStr);
};

tywx.IsWechatPlatform = function () {
    try {
        wx;
        wx.showShareMenu();
        return true;
    } catch (e) {
        return false;
    }
};

cc._RF.pop();