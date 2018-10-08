"use strict";
cc._RF.push(module, 'aefdfV0CZtL5Zn3hTz5Xtlw', 'gamesdk.config');
// Scripts/common/gamesdk/gamesdk.config.js

'use strict';

var config = {
    //测试用内网，上线用外网
    //api:"https://gamewss-local.kuaiyugo.com/",  //请求统一域名(内网)

    //api:"https://jialan.kuaiyugo.com/",  //外网测试服
    // api: "https://192.168.1.35/",

    api: "https://h5game-websocket.gametall.com/", //请求统一域名(外网)

    //appKey:"", //自己生成的appKey，非微信功能产品
    //appKey:"89418c70-67eb-11e8-adad-639eb01a1819", //自己生成的appKey，非微信功能产品
    appId: 'wxb5bbc7baaf5460c3', //小程序的appid或小游戏appId

    version: '1.0.0'
};

module.exports = config;

cc._RF.pop();