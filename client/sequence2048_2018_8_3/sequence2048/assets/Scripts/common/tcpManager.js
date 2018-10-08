tcpManager = {};

tcpManager.websocket = {
    //初始化
    init: function () {
        if (wxGame.webSocketInit) {
            return
        }
        wxGame.webSocketInit = true;

        tywx.NotificationCenter.ignoreScope(this);
        //登录成功回调
        tywx.NotificationCenter.listen(tywx.EventType.SDK_LOGIN_SUCCESS, tcpManager.websocket.sdkLoginSuccess, this);

        if (tywx.UserInfo.userId) {
            tcpManager.websocket.sdkLoginSuccess();
        }

        //websocket已打开
        tywx.NotificationCenter.listen(tywx.EventType.TCP_OPENED, tcpManager.websocket.tcpConnect, this);
        //心跳回调
        tywx.NotificationCenter.listen(tywx.EventType.SEND_HEART_BEAT, tcpManager.websocket.heartbeat, this);
        //接收消息
        tywx.NotificationCenter.listen(tywx.EventType.TCP_RECEIVE, tcpManager.websocket.receiveData, this);
    },

    //登录成功，启动schedule
    sdkLoginSuccess: function () {
        console.log('SDK_LOGIN_SUCCESS ...');

        tywx.TCPClient.connectStatus = tywx.TCPClient.CONNECT_STATUS_FAIL;
        tywx.TCPClient.timerSchedule();
    },

    //发送用户绑定协议，绑定成功后，开始心跳
    tcpConnect: function (scope, params) {
        // console.log('tcpManager.websocket.tcpConnect');
        tcpManager.websocket.bindUser();

        tcpManager.websocket.heartbeat(null, null);
    },

    //心跳侦听
    heartbeat: function (scope, params) {
        //发送用户绑定协议，绑定成功后，开始心跳
        var cmd = {
            'cmd': tcpManager.cmdType.HEART_BEAT,
            'params': {
                'deviceId': tywx.SystemInfo.deviceId
            }
        };
        tywx.TCPClient.sendMsg(cmd);
    },

    bindUser: function (scope, params) {
        // console.log('tcpManager.websocket.bindUser');
        //发送用户绑定协议，绑定成功后，开始心跳
        var cmd = {
            'cmd': tcpManager.cmdType.CMD_BIND_USER,
            'params': {
                'authorCode': tywx.UserInfo.authorCode
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
        tywx.LOGD('receiveData: ', JSON.stringify(params));
        var cmd = params.cmd;
        if (cmd == tcpManager.cmdType.user_info5) {
            //hall5相关的业务数据，绑定用户成功
            tywx.NotificationCenter.trigger(tcpManager.gameEvent.BIND_USER_SUCCESS);
        } else {
            tcpManager.receiveCmd.process(params);
        }
    },
};