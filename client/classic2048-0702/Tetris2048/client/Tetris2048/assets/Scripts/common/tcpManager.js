tcpManager = {};

tcpManager.websocket = {
    //初始化
    init: function () {
        //登录成功回调 
        tywx.NotificationCenter.listen(tywx.EventType.SDK_LOGIN_SUCCESS, tcpManager.websocket.sdkLoginSuccess, null);
        //websocket已打开
        tywx.NotificationCenter.listen(tywx.EventType.TCP_OPENED, tcpManager.websocket.tcpConnect, null);
        //心跳回调
        tywx.NotificationCenter.listen(tywx.EventType.SEND_HEART_BEAT, tcpManager.websocket.heartbeat, null);
        //接收消息
        tywx.NotificationCenter.listen(tywx.EventType.TCP_RECEIVE, tcpManager.websocket.receiveData, null);
    },

    //登录成功，启动schedule
    sdkLoginSuccess: function (scope, params) {
        console.log('SDK_LOGIN_SUCCESS');

        tywx.TCPClient.connectStatus = tywx.TCPClient.CONNECT_STATUS_FAIL;
        tywx.TCPClient.timerSchedule();
    },

    //发送用户绑定协议，绑定成功后，开始心跳
    tcpConnect: function (scope, params) {
        console.log('tcpManager.websocket.tcpConnect');
        tcpManager.websocket.bindUser();

        tcpManager.websocket.heartbeat(null, null);
    },

    //心跳侦听
    heartbeat: function (scope, params) {
        //发送用户绑定协议，绑定成功后，开始心跳
        var cmd = {
            'apiVersion': '5.0',
            'namespace': "hall5",
            'cmd': tcpManager.cmdType.heartbeat,
            'params': {
                'userId': tywx.UserInfo.userId,
                'gameId': 9999,
                'intClientId': tywx.SystemInfo.intClientId
            }
        };
        tywx.TCPClient.sendMsg(cmd);
    },

    bindUser: function (scope, params) {
        console.log('tcpManager.websocket.bindUser');
        //发送用户绑定协议，绑定成功后，开始心跳
        var cmd = {
            'apiVersion': '5.0',
            'namespace': "hall5",
            'cmd': tcpManager.cmdType.bind_user5, //"bind_user5",
            'params': {
                'userId': tywx.UserInfo.userId,
                'gameId': 9999,
                'intClientId': tywx.SystemInfo.intClientId,
                "authorCode": tywx.UserInfo.authorCode
            }
        };
        tywx.TCPClient.sendMsg(cmd);
    },

    //发送数据到服务器,数据格式为json格式,需要跟服务器商量好接口
    sendData: function (data) {
        if (!data) {
            return;
        }
        tywx.TCPClient.sendMsg(data);
    },

    //接收数据,处理业务逻辑
    receiveData: function (params) {
        console.log('receiveData', params, params.cmd);
        var cmd = params.cmd;
        if (cmd == tcpManager.cmdType.user_info5) {
            //hall5相关的业务数据，绑定用户成功
            tywx.NotificationCenter.trigger(tcpManager.gameEvent.BIND_USER_SUCCESS);
        } else {
            tcpManager.receiveCmd.process(params);
        }
    },
}