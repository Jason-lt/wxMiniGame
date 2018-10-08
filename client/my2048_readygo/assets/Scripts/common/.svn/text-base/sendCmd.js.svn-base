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

    //发送玩家点击链接协议
    sendClickLinkLogin: function () {
        console.log('tcpManager.sendCmd.sendClickLinkLogin WXGlobal.helpInfo:', Global.helpInfo);
        if (!Global.helpInfo) {
            return;
        }
        if (parseInt(Global.helpInfo.inviteCode) <= 0) {
            return;
        }
        var cmd = {
            'apiVersion': '5.0',
            'namespace': "wx",
            'cmd': tcpManager.cmdType.wx,
            'params': {
                'action': tcpManager.cmdType.clickLinkLogin,
                'userId': tywx.UserInfo.userId,
                'gameId': 9997,
                'targetUserId': parseInt(Global.helpInfo.inviteCode),
                'sxGameId': tywx.SystemInfo.gameId,
                'intClientId': tywx.SystemInfo.intClientId
            }
        };
        console.log('sendClickLinkLogin:', cmd);
        tcpManager.sendCmd.sendMsg(cmd);
         //记录登录时的时间
         Global.loginDateStr = (new Date()).toDateString();
    },

    //领取链接被点之后的奖励
    sendFetchClickReward: function (targetUserId) {
        if (parseInt(targetUserId) <= 0) {
            return;
        }
        var cmd = {
            'apiVersion': '5.0',
            'namespace': "wx",
            'cmd': tcpManager.cmdType.wx,
            'params': {
                'action': tcpManager.cmdType.fetchClickReward,
                'userId': tywx.UserInfo.userId,
                'gameId': 9997,
                'targetUserId': parseInt(targetUserId),
                'sxGameId': tywx.SystemInfo.gameId,
                'intClientId': tywx.SystemInfo.intClientId
            }
        };
        console.log('sendFetchClickReward:', cmd);
        tcpManager.sendCmd.sendMsg(cmd);
    },

    //获取点击用户列表
    sendGetClickUserList: function () {
        var cmd = {
            'apiVersion': '5.0',
            'namespace': "wx",
            'cmd': tcpManager.cmdType.wx,
            'params': {
                'action': tcpManager.cmdType.getClickUserList,
                'userId': tywx.UserInfo.userId,
                'gameId': 9997,
                'sxGameId': tywx.SystemInfo.gameId,
                'intClientId': tywx.SystemInfo.intClientId
            }
        };
        console.log('sendGetClickUserList:', cmd);
        tcpManager.sendCmd.sendMsg(cmd);
    },

    //领取每日奖励
    sendFetchDailyReward: function () {
        var cmd = {
            'apiVersion': '5.0',
            'namespace': "wx",
            'cmd': tcpManager.cmdType.wx,
            'params': {
                'action': tcpManager.cmdType.fetchDailyReward,
                'userId': tywx.UserInfo.userId,
                'gameId': 9997,
                'sxGameId': tywx.SystemInfo.gameId,
                'intClientId': tywx.SystemInfo.intClientId
            }
        };
        console.log('sendFetchDailyReward:', cmd);
        tcpManager.sendCmd.sendMsg(cmd);
    },

}