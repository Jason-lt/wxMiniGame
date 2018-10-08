//var ThirdAPI = require('./common/ThirdAPI')
//发送协议
tcpManager.sendCmd = {
    lisiner: function () {
        console.log('监听成功');
        if (tywx.UserInfo.wxgame_session_key != '') {
            tcpManager.sendCmd.initLogin();
        }
        tywx.NotificationCenter.listen(tcpManager.gameEvent.BIND_USER_SUCCESS, tcpManager.sendCmd.initLogin, null);
    },

    //发送协议
    sendMsg: function (params) {
        tcpManager.websocket.sendData(params);
    },

    //初始化登录
    initLogin: function () {
        console.log('Global.helpInfo:', Global.helpInfo);
        if (Global.helpInfo && parseInt(Global.helpInfo.inviteCode) > 0) {
            tcpManager.sendCmd.sendClickLinkLogin();
        } else {
            tcpManager.sendCmd.sendLoginData();
        }
    },

    //不是点链接发送登录协议
    sendLoginData: function () {
        var cmd = {
            'apiVersion': '5.0',
            'namespace': "wx",
            'cmd': tcpManager.cmdType.wx,
            'params': {
                'action': tcpManager.cmdType.normalLogin,
                'userId': tywx.UserInfo.userId,
                'gameId': 9997,
                'sxGameId': tywx.SystemInfo.gameId,
                'intClientId': tywx.SystemInfo.intClientId
            }
        };
        tcpManager.sendCmd.sendMsg(cmd);
         //记录登录时的时间
         Global.loginDateStr = (new Date()).toDateString();
    },

    geBringConfig: function() {
        var params = {
            'cmd': 'game',
            'params': {
                'action' : 'common_config',
                'gameId' : tywx.SystemInfo.gameId,
                'configKey' : 'bringConfig'
            }
        };
        tcpManager.sendCmd.sendMsg(params);
    },

    //
    geResurgenceConfig: function() {
        var params = {
            'cmd': 'game',
            'params': {
                'action' : 'common_config',
                'gameId' : tywx.SystemInfo.gameId,
                'configKey' : 'resurgenceConfig'
            }
        };
        tcpManager.sendCmd.sendMsg(params);
    },

    getGameConfig: function() {
        var params = {
            'cmd': 'game',
            'params': {
                'action' : 'common_config',
                'gameId' : tywx.SystemInfo.gameId,
                'configKey' : 'gameConfig'
            }
        };
        tcpManager.sendCmd.sendMsg(params);
    },

    getShareConfig: function() {
        var params = {
            'cmd': 'game',
            'params': {
                'action' : 'common_config',
                'gameId' : tywx.SystemInfo.gameId,
                'configKey' : 'shareConfig'
            }
        };
        tcpManager.sendCmd.sendMsg(params);
    },

    sendSaveScore:function(){
        var params = {
            'cmd': 'game',
            'params': {
                'action' : 'save_score',
                'gameId' : tywx.SystemInfo.gameId,
                "score": wxGame.Global.gameInfo.score,
                "itemId": "",
                "propertyName": ""
            }
        };

        tcpManager.sendCmd.sendMsg(params);
    },

    //获取用户信息
    getUserInfoForShot: function() {
        var params = {
            'cmd': 'game',
            'params': {
                'action' : 'get_user_info',
                'gameId' : tywx.SystemInfo.gameId
            }
        };
        tcpManager.sendCmd.sendMsg(params);
    },
    /**
     *
     * @param sharePoint 分享点
     */
    shareToGetreward:function (sharePoint) {
        if(!sharePoint || sharePoint == 0){
            return;
        }
        var pars = {
            "cmd":'hall_share2',
            "params": {
                "action": 'get_reward',
                "gameId": tywx.SystemInfo.gameId,
                "pointId": sharePoint || 10700001
            }
        };
        tcpManager.sendCmd.sendMsg(pars);
    },

    //获取背包信息
    getBagInfo: function() {
        var params = {
            'cmd': 'bag',
            'params': {
                'action': 'update'
            }
        };
        tcpManager.sendCmd.sendMsg(params);
    },

    //开始游戏
    beginGame: function() {
        var params = {
            'cmd': 'game',
            'params': {
                'action': 'game_begin',
                "gameId": tywx.SystemInfo.gameId,
            }
        };
        tcpManager.sendCmd.sendMsg(params);
    },

    //存档
    saveRecord: function(gameInfo) {
        var params = {
            'cmd': 'game',
            'params': {
                'action': 'save_game',
                "gameId": tywx.SystemInfo.gameId,
                "gameInfo": gameInfo,
            }
        };
        tcpManager.sendCmd.sendMsg(params);
    },

    //使用道具
    consumeAssets: function (count,item) {
        var params = {
            'cmd': 'game',
            'params': {
                'action': 'consume_assets',
                "itemId": item,
                "count": count,
                'gameId': tywx.SystemInfo.gameId
            }
        };
        tcpManager.sendCmd.sendMsg(params);
    },
};

tcpManager.sendCmd.lisiner();