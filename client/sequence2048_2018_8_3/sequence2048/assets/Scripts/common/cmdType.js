//前后端通信协议类型
tcpManager.cmdType = {
    //hall5发送相关的协议类型
    heartbeat: 'heartbeat',
    bind_user5: 'bind_user5',
    //hall5接收相关的协议类型
    hall_ui5: 'hall_ui5',
    user_info5: 'user_info5',
    game_data5: 'game_data5',
    goto_table5: 'goto_table5',
    update_notify5: 'update_notify5',

    //业务公用发送指令接口
    wx: 'wx',



    //业务公用接收指令接口
    normalLogin: "normalLogin", //微信用户登陆，初始化数据
    clickLinkLogin: 'clickLinkLogin', //玩家点击链接 进入游戏
    useRemainCount: 'useRemainCount', //小游戏用户扣减次数 或星星数量
    fetchClickReward: 'fetchClickReward', //领取自己链接被点之后的奖励
    getClickUserList: 'getClickUserList', //获取点击用户列表
    getDailyReward: 'getDailyReward', //获取当日领取奖励信息
    fetchDailyReward: 'fetchDailyReward', //领取每日奖励


    HEART_BEAT: 'heart_beat', //  心跳
    CMD_BIND_USER : 'bind_user', // 返回user_info
    MSG_USER_INFO: 'user_info', // 返回userInfo
    MSG_GAME: 'game', //
    MSG_DATA_CHANGED: 'update_notify',
    HALL_SHARE2: 'hall_share2', //
    GET_REWARD : 'get_reward',
    MSG_BAG_INFO: 'bag',

}