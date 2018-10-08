(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Scripts/common/receiveCmd.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '055b9l7MfFPy4boMlcNHuA0', 'receiveCmd', __filename);
// Scripts/common/receiveCmd.js

'use strict';

tcpManager.receiveCmd = {
    //收到服务器下发的协议处理
    process: function process(params) {
        var result = params.result;

        if (result.action == tcpManager.cmdType.normalLogin) {
            //处理异常报错
            if (result.ok && parseInt(result.ok) <= 0) {
                console.log('处理异常报错');
                if (result.action == tcpManager.cmdType.clickLinkLogin) {
                    console.log('点击自己发送的小卡片需要请求normalLogin协议');
                    tcpManager.sendCmd.sendLoginData();
                    return;
                }
                Global.game.showDialogPropText('账号数据异常');
                return;
            }

            console.log('normalLogin:', result.action);
            Global.tcpData = {};
            tcpManager.receiveCmd.formatData(result.data);
            tcpManager.sendCmd.sendGetClickUserList();

            /* Global.tcpData.firstLogin = result.data.firstLogin;
             Global.tcpData.date = result.data.date;
             Global.tcpData.isAmGet = result.data.isAmGet;
             Global.tcpData.isPmGet = result.data.isPmGet;
             Global.tcpData.clickUserDict = result.data.clickUserDict;
             Global.tcpData.remainCount = result.data.remainCount;*/
        } else if (result.action == tcpManager.cmdType.clickLinkLogin) {
            //处理异常报错
            if (result.ok && parseInt(result.ok) <= 0) {
                console.log('处理异常报错');
                if (result.action == tcpManager.cmdType.clickLinkLogin) {
                    console.log('点击自己发送的小卡片需要请求normalLogin协议');
                    tcpManager.sendCmd.sendLoginData();
                    return;
                }
                Global.game.showDialogPropText('账号数据异常');
                return;
            }
            console.log('clickLinkLogin:', result.data);

            Global.tcpData = {};
            tcpManager.receiveCmd.formatData(result.data);
            tcpManager.sendCmd.sendGetClickUserList();

            if (parseInt(result.data.isClick) <= 0) {
                console.log('是首次点击小卡片，可以领取奖励');
                //本地加钻石奖励
                if (typeof wx !== 'undefined') {
                    var msg = '你已帮助好友获得' + Global.rewardConfig.inviteNum + '钻，你也获得了' + Global.rewardConfig.inviteNum + '钻';
                    Global.game.addStone(Global.rewardConfig.inviteNum, msg);
                }
            } else {
                Global.game.showDialogPropText('你已经帮助过该好友！');
            }
        } else if (result.action == tcpManager.cmdType.fetchDailyReward) {
            //处理异常报错
            if (result.ok && parseInt(result.ok) <= 0) {
                console.log('处理异常报错');
                if (result.action == tcpManager.cmdType.clickLinkLogin) {
                    console.log('点击自己发送的小卡片需要请求normalLogin协议');
                    tcpManager.sendCmd.sendLoginData();
                    return;
                }
                Global.game.showDialogPropText('账号数据异常');
                return;
            }

            console.log('fetchDailyReward:', result.data);
            tcpManager.receiveCmd.formatData(result.data);
            Global.rewardUI.refreshDailyInfo();
            /*
                        if (parseInt(result.data.isAmGet) > 0) {
                            console.log('更新上午的每日奖励信息');
                            Global.rewardUI.refreshDailyInfo();
                            //shuaxin
                            Global.tcpData.isAmGet = parseInt(result.data.isAmGet);
                        }
                        if (parseInt(result.data.isPmGet) > 0) {
                            console.log('更新xia午的每日奖励信息');
                            Global.rewardUI.refreshDailyInfo();
                            //shuaxin
                            Global.tcpData.isPmGet = parseInt(result.data.isPmGet);
                        }*/
        } else if (result.action == tcpManager.cmdType.getClickUserList) {
            //处理异常报错
            if (result.ok && parseInt(result.ok) <= 0) {
                console.log('处理异常报错');
                if (result.action == tcpManager.cmdType.clickLinkLogin) {
                    console.log('点击自己发送的小卡片需要请求normalLogin协议');
                    tcpManager.sendCmd.sendLoginData();
                    return;
                }
                Global.game.showDialogPropText('账号数据异常');
                return;
            }

            console.log('getClickUserList:', result.data);
            Global.tcpData.clickItems = result.data;
        } else if (result.action == tcpManager.cmdType.fetchClickReward) {
            //处理异常报错
            if (result.ok && parseInt(result.ok) <= 0) {
                console.log('处理异常报错');
                if (result.action == tcpManager.cmdType.clickLinkLogin) {
                    console.log('点击自己发送的小卡片需要请求normalLogin协议');
                    tcpManager.sendCmd.sendLoginData();
                    return;
                }
                Global.game.showDialogPropText('账号数据异常');
                return;
            }

            console.log('fetchClickReward:', result.data);

            //本地加钻石奖励
            if (typeof wx !== 'undefined') {
                var msg = '恭喜你获得好友互助奖励';
                Global.game.addStone(Global.rewardConfig.inviteNum, msg);
            }

            if (Global.tcpData.clickItems && result.data && result.data.clickUserDict) {
                for (var index = 0; index < Global.tcpData.clickItems.length; index++) {
                    var element = Global.tcpData.clickItems[index];
                    var userDict = result.data.clickUserDict[element.userId];
                    console.log('--------------', element.userId, userDict);
                    if (userDict) {
                        console.log('修改成功', element.userId);
                        element.isGet = userDict.isGet;
                        element.time = userDict.time;
                    }
                }
            }

            Global.rewardUI.refreshList();
        }
        //console.log('Global.tcpData:', Global.tcpData);
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
            Global.game.showDialogPropText('账号数据异常');
            return;
        }
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
        //# sourceMappingURL=receiveCmd.js.map
        