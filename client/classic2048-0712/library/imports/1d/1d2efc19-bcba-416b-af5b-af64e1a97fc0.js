"use strict";
cc._RF.push(module, '1d2efwZvLpBa69br2ThqX/A', 'biManager');
// Scripts/common/biManager.js

"use strict";

var biManager = {
    loadGame: 100001, //  加载游戏
    enterGame: 100002, //	成功进入游戏
    startGame: 100003, //  点击开始游戏
    useClearProp: 100004, //使用消除锤锤道具
    useSuperProp: 100005, //使用万能道具
    reviveSuccess: 100006, //	死亡后复活成功
    dead2: 100007, //	死亡后跳过
    entershare: 100008, //	进入结算界面
    restar: 100009, //  结算界面点击重新开始
    rank: 100010, //  进入排行界面
    skin: 100011, //	进入皮肤界面
    buyskin: 100012, //  购买皮肤
    dailyRank: 100013, //进入每日排行
    useBomb: 100014, //点击炸按钮的次数

    addShare: 200001, //游戏首页点击+号并分享成功
    dailyShare: 200002, //游戏首页点击每日挑战并分享成功
    groupShare: 200003, //游戏首页点击查看群排行并分享成功
    shareToWX: 200004, //游戏首页点击分享到微信群并分享成功
    clearToShare: 200005, //游戏界面点击锤锤分享并成功
    superToShare: 200006, //游戏界面点击万能数字分享并成功
    chestShare: 200007, //游戏过程中通过宝箱分享成功
    reviveShare: 200008, //游戏过程中复活分享并分享成功
    storeShare: 200009, //结算界面通过送钻石分享成功
    rewardShare: 200010, //游戏首页福利界面分享
    bombShareSuccess: 200011, //炸分享成功

    bilog: function bilog(eventid, params) {
        //console.log('++++++++++++++bilog:', eventid, params);
        tywx.BiLog.clickStat(eventid, params);
    }
};
module.exports = biManager;

cc._RF.pop();