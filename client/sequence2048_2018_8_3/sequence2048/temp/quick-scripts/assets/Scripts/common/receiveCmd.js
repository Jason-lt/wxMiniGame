(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Scripts/common/receiveCmd.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '055b9l7MfFPy4boMlcNHuA0', 'receiveCmd', __filename);
// Scripts/common/receiveCmd.js

"use strict";

tcpManager.receiveCmd = {
    boot: function boot() {

        this.cmdMap = {};
        this.cmdMap[tcpManager.cmdType.MSG_USER_INFO] = this.onReceiveUserInfo;
        this.cmdMap[tcpManager.cmdType.MSG_GAME] = this.onGame;
        this.cmdMap[tcpManager.cmdType.MSG_DATA_CHANGED] = this.onUpdateChangedData;
        this.cmdMap[tcpManager.cmdType.HALL_SHARE2] = this.onShare2;
        this.cmdMap[tcpManager.cmdType.MSG_BAG_INFO] = this.onReceiveBagInfo;

        tywx.NotificationCenter.listen(tywx.EventType.GET_USER_FEATURE_SUCCESS, this._userFeature, this);
    },

    //收到服务器下发的协议处理
    process: function process(params) {
        var msgCmd = params.cmd;
        var result = params.result;
        if (result) {
            var func = this.cmdMap[msgCmd];
            if (func) {
                func.call(this, params);
            } else {
                wxGame.NotificationCenter.trigger(msgCmd, params);
                wxGame.LOGD(this._TAG, "未注册关于消息 ： " + msgCmd + " 的监听！");
            }
        }
    },

    _userFeature: function _userFeature(val) {
        // var ={
        //     "_id":"1490806",
        //         "bind_wx":"wx:om67ov41A6awFwQ0rQB0RtWFA8NA",
        //         "last_login_time":"2018-05-25 16:44:22",
        //         "last_login_ip":"183.212.187.255",
        //         "last_login_province":"江苏",
        //         "last_login_city":"南京",
        //         "last_login_clientid":"H5_5.1_weixin.weixin.0-hall6.weixin.rich",
        //         "login_counts": {
        //             "2018-05-25":1
        //         },
        //     "create_platform_id":"3",
        //         "create_clientid":"H5_5.1_weixin.weixin.0-hall6.weixin.rich",
        //         "create_subplatform_id":"5",
        //         "create_city":"南京",
        //         "create_channel_id":"104",
        //         "create_ip":"183.212.187.255",
        //         "create_time":"2018-05-25 16:44:22",
        //         "create_province":"江苏",
        //         "create_product_id":"6",
        //         "login_detail": {
        //         "2018-05-25": [
        //             "16:44:22"
        //         ]
        //     }
        // };
        //TODO:TEST
        // if(debugMode){
        //     window.Global.isInBSGS = !debugMode;
        // }
        if (!val.retmsg) {
            return;
        }
        wxGame.Global.featureInfo = val.retmsg;
        wxGame.Global.isInBSGS = wxGame.GlobalFuncs.checkBSGS(wxGame.Global.featureInfo.last_login_city); //是否在北上广深
        wxGame.Global.ip = wxGame.Global.featureInfo.last_login_ip; //上一次登录的IP
        if (wxGame.Global.isBringVersion) {
            wxGame.Global.isInBSGS = true;
        }
    },

    onReceiveUserInfo: function onReceiveUserInfo(params) {
        wxGame.shareManager.load();
        tcpManager.sendCmd.getUserInfoForShot();

        /*****  通用配置  *****/

        var funList = [tcpManager.sendCmd.geBringConfig, tcpManager.sendCmd.getShareConfig, tcpManager.sendCmd.geResurgenceConfig, tcpManager.sendCmd.getGameConfig, tcpManager.sendCmd.getBagInfo, tcpManager.sendCmd.beginGame];

        var runOneFun = function runOneFun() {
            if (funList.length > 0) {
                var func = funList.shift();
                func();
                requestAnimationFrame(runOneFun);
            }
        };

        runOneFun();

        if (params.result && params.result.gameId == 9999) {
            if (wxGame.Global.isOnShare) {
                wxGame.NotificationCenter.trigger(wxGame.EventType.UPDATE_SHARE_STATE);
            }
            wxGame.Global.isOnShare = false;
            wxGame.Global.sharePoint = 0;
        }
    },

    onGame: function onGame(params) {
        switch (params.result.action) {
            case "get_user_info":
                {
                    wxGame.Global.gameInfo.history_score = params.result.playinfo.history_score;
                    wxGame.Global.gameInfo.max_score = params.result.playinfo.max_score;

                    wxGame.NotificationCenter.trigger(wxGame.EventType.UPDATE_USER_INFO);
                    break;
                }
            case "save_score":
                {
                    wxGame.Global.gameInfo.history_score = params.result.playinfo.history_score;
                    wxGame.Global.gameInfo.max_score = params.result.playinfo.max_score;
                    break;
                }
            case "game_begin":
                {
                    wxGame.saveGameInfo = params.result.gameInfo;
                    break;
                }
            case "save_game":
                {
                    wxGame.saveGameInfo = params.result.gameInfo;
                    break;
                }
            case "consume_assets":
                {
                    // {"cmd":"game","result":{"action":"consume_assets","gameId":98,"userId":10184,"success":0}}
                    if (params.result) {
                        wxGame.NotificationCenter.trigger(wxGame.EventType.USE_PROP, params.result);
                    }
                    break;
                }
            case "common_config":
                {
                    // {"cmd":"game","result":{"action":"consume_assets","gameId":98,"userId":10184,"success":0}}
                    this.parseCommonConfig(params.result);
                    break;
                }
        }
    },

    parseCommonConfig: function parseCommonConfig(value) {
        switch (value.configKey) {
            case "bringConfig":
                {
                    // this.saveNormalConfigJson(value.config);
                    if (value && value.config.version == wxGame.Global.version) {
                        wxGame.Global.isBringVersion = true;
                        wxGame.Global.isInBSGS = true;
                    } else {
                        wxGame.Global.isBringVersion = false;
                    }
                    break;
                }
            case "resurgenceConfig":
                {
                    if (wxGame.Global.isInBSGS) {
                        wxGame.resurgenceConfig = value.config.bsgsCity;
                    } else {
                        wxGame.resurgenceConfig = value.config.otherCity;
                    }

                    break;
                }
            case "gameConfig":
                {
                    wxGame.GameConfig = value.config;
                    break;
                }
            case "shareConfig":
                {
                    if (wxGame.Global.isInBSGS) {
                        wxGame.shareConfig = value.config.bsgsCity;
                    } else {
                        wxGame.shareConfig = value.config.otherCity;
                    }
                    break;
                }
        }
    },

    onUpdateChangedData: function onUpdateChangedData(argument) {
        //解析数据
        if (typeof argument != 'undefined') {
            //hall.ME.parseUserInfo(argument[0]);
            var result = argument["result"];
            if (typeof result != 'undefined' && typeof result['changes'] != 'undefined') {
                for (var i = 0; i < result['changes'].length; i++) {
                    var curValue = result["changes"][i];
                    if (typeof curValue == 'undefined') {
                        continue;
                    }
                    if (curValue == 'item') {
                        wxGame.LOGD("update_notify,更新道具");
                        tcpManager.sendCmd.getBagInfo();
                    }
                }
            }
        }
    },

    onShare2: function onShare2(msg) {
        if (msg.result.action == tcpManager.cmdType.GET_REWARD) {
            // {"cmd":"hall_share2","result":{"action":"get_reward","gameId":6,"userId":10008,"rewards":[]}}
            //获得奖励回调
            if (msg.result.rewards.length > 0) {
                if (msg.result.rewards[0].count) {
                    if (msg.result.rewards[0].itemId == "item:1415") {
                        wxGame.GlobalFuncs.getCardProp(2);
                    }
                }
            }
        }
    },

    onReceiveBagInfo: function onReceiveBagInfo(value) {
        if (value) {
            var result = value['result'];
            var bagList = result["normal_list"];

            if (!bagList || typeof bagList == "undefined") {
                return;
            }
            wxGame.Global.gameInfo.changeProp = 0;
            for (var i = 0; i < bagList.length; i++) {
                var bagInfo = bagList[i];
                var bagID = bagInfo["id"];
                // 互换牌道具
                if (bagID == 1415) {
                    wxGame.Global.gameInfo.changeProp = bagInfo["num"];
                }
            }
            wxGame.NotificationCenter.trigger(wxGame.EventType.UPDATE_CHANGE_PROP);
            // ty.NotificationCenter.trigger(ddz.EventType.UPDATE_BAG_INFO);
        }
    },

    formatData: function formatData(data) {
        Global.tcpData.firstLogin = data.firstLogin;
        Global.tcpData.date = data.date;
        Global.tcpData.isClick = data.isClick;
        Global.tcpData.isAmGet = data.isAmGet;
        Global.tcpData.isPmGet = data.isPmGet;
        Global.tcpData.clickUserDict = data.clickUserDict;
        Global.tcpData.remainCount = data.remainCount;
    },

    throwError: function throwError(result) {
        //处理异常报错
        if (result.ok && parseInt(result.ok) <= 0) {
            console.log('处理异常报错');
            if (result.action == tcpManager.cmdType.clickLinkLogin) {
                console.log('点击自己发送的小卡片需要请求normalLogin协议');
                tcpManager.sendCmd.sendLoginData();
                return;
            }
            // Global.game.showDialogPropText('账号数据异常');
            return;
        }
    },

    shut: function shut() {
        this.cmdMap = {};
        tywx.NotificationCenter.ignoreScope(this);
    }
};
tcpManager.receiveCmd.boot();

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
        //# sourceMappingURL=receiveCmd.js.map
        