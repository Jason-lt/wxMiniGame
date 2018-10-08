    // Learn cc.Class:
    //  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
    //  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
    // Learn Attribute:
    //  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
    //  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
    // Learn life-cycle callbacks:
    //  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
    //  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

    var ThirdAPI = require('../common/ThirdAPI')
    cc.Class({
        extends: cc.Component,

        properties: {
            content: {
                default: null,
                type: cc.Node
            },
            rewardItem: {
                default: null,
                type: cc.Prefab
            },
            drwaSprite: {
                default: null,
                type: cc.Node
            },
            dailyLabel: {
                default: null,
                type: cc.Label
            },
            stoneNum: {
                default: null,
                type: cc.Label
            },
            dailyCanTakeBtn: {
                default: null,
                type: cc.Node
            },
            dailyTakedBtn: {
                default: null,
                type: cc.Node
            },
            dailyTime: {
                default: null,
                type: cc.Label
            },
            dailyRewardLabel: {
                default: null,
                type: cc.Label
            },
            itemHeight: 105,
            list: [],
        },

        //奖励界面初始化
        initData: function () {
            this.resetData();
            this.setMyStoneNum(0);
            this.drawMyInfo();
            this.createItem();
            this.setDailyInfo();
            this.setShowTime();
        },

        //创建奖励列表
        createItem: function () {
            this.list = [];
            for (var index = 0; index < Global.rewardConfig.items.length; index++) {
                var item = cc.instantiate(this.rewardItem);
                item.setPosition(cc.p(0, (1 / 2 + index) * -this.itemHeight));
                var rewardScript = item.getComponent('rewardItem');
                var parma = Global.rewardConfig.items[index];
                rewardScript.setInfo(parma);
                this.content.addChild(item);
                this.list.push(item);
            }
            this.content.height = Global.rewardConfig.items.length * this.itemHeight;
        },

        //服务器回调数据，刷新列表显示
        refreshList: function () {
            console.log('开始刷新', Global.tcpData);
            for (var index = 0; index < this.list.length; index++) {
                var item = this.list[index];
                if (item) {
                    var rewardScript = item.getComponent('rewardItem');
                    var parma = Global.rewardConfig.items[index];
                    rewardScript.setInfo(parma);
                }
            }
        },

        //绘制头像和名称
        drawMyInfo: function () {
            this.drawRect = {
                x: 0,
                y: 0,
                width: this.drwaSprite.width,
                height: this.drwaSprite.height
            };

            this.cleanDrwaSprite();
            ThirdAPI.getRank({
                rect: this.drawRect,
                callback: (entries) => {
                    if (typeof entries === 'object') {
                        //this.updateContent(entries);
                        // this.getMyRank();
                    } else if (typeof entries === 'string') {
                        this.updateWxRank = 50;
                    }
                }
            }, 'MyInfo')
        },

        cleanDrwaSprite: function () {
            this.drwaSprite.getComponent(cc.Sprite).spriteFrame = null;
        },
        //设置星星数量
        setMyStoneNum: function (num) {
            this.stoneNum.string = Global.wxGold + num;
        },

        //设置每日领取的信息
        setDailyInfo: function () {
            var progress = 0;
            if (Global.tcpData) {
                console.log('dailyInfo:', Global.tcpData.isAmGet);
                if (Global.tcpData.isAmGet !== undefined) {
                    progress += parseInt(Global.tcpData.isAmGet);
                }
                if (Global.tcpData.isPmGet !== undefined) {
                    progress += parseInt(Global.tcpData.isPmGet);
                }
            }
            this.dailyLabel.string = '每日领奖(' + progress + "/2)";
            this.dailyRewardLabel.string = Global.rewardConfig.dailyRewardNum + "";

            //更新按钮状态
            if (progress >= 2) {
                this.dailyCanTakeBtn.active = false;
                this.dailyTakedBtn.active = true;
            } else {
                this.dailyCanTakeBtn.active = true;
                this.dailyTakedBtn.active = false;
            }
        },

        //设置每日领取的时间段
        setShowTime: function () {
            var myUtil = require('myUtil');
            var time1 = Global.rewardConfig.dailyTime[0];
            var time2 = Global.rewardConfig.dailyTime[1];
            var str = myUtil.getFormatTime(parseInt(time1.startTime)) + '--' + myUtil.getFormatTime(parseInt(time1.endTime));
            str += '\n' + myUtil.getFormatTime(parseInt(time2.startTime)) + '--' + myUtil.getFormatTime(parseInt(time2.endTime));
            this.dailyTime.string = str;
        },

        // 分享功能  intent("INVITE" | "REQUEST" | "CHALLENGE" | "SHARE") 表示分享的意图
        onShareGame: function () {
            Global.game.playSound('btn', 0.1);

            if (typeof FBInstant !== 'undefined') {
                ThirdAPI.shareGame(this.getImgBase64(), null);
            } else if (typeof wx !== 'undefined') {
                ThirdAPI.shareGame('randomImg', this.onShareSuccess.bind(this), null, '244');
            }
        },

        onShareSuccess: function () {
            //游戏好友互助分享成功
            var biManager = require('biManager');
            biManager.bilog(biManager.rewardShare, null);
        },

        //领取每日奖励
        onFetchDailyReward: function () {
            var progress = parseInt(Global.tcpData.isAmGet) + parseInt(Global.tcpData.isPmGet);
            if (progress >= 2) {
                Global.game.showDialogPropText('你已经领取过今日奖励了');
                return;
            }

            var myDate = new Date();
            var currSecondes = myDate.getHours() * 3600 + myDate.getMinutes() * 60 + myDate.getSeconds();
            console.log('currSecondes:', currSecondes);
            //判断上午时间和下午时间
            var time1 = Global.rewardConfig.dailyTime[0];
            var time2 = Global.rewardConfig.dailyTime[1];
            var onAm = (time1.startTime <= currSecondes && currSecondes <= time1.endTime) ? true : false;
            var onPm = (time2.startTime <= currSecondes && currSecondes <= time2.endTime) ? true : false;
            if (onAm || onPm) {
                if (onAm && parseInt(Global.tcpData.isAmGet) > 0) {
                    console.log('上午奖励已经领取过了');
                    Global.game.showDialogPropText('当前时间段的奖励已经领取过了');
                    return;
                }
                if (onPm && parseInt(Global.tcpData.isPmGet) > 0) {
                    console.log('下午奖励已经领取过了');
                    Global.game.showDialogPropText('当前时间段的奖励已经领取过了');
                    return;
                }
            } else {
                Global.game.showDialogPropText('领取时间还没到');
                return;
            }
            //tcpManager.sendCmd.sendFetchDailyReward();
        },

        //已经领取过两次奖励
        takeAllDailyReward: function () {
            var progress = parseInt(Global.tcpData.isAmGet) + parseInt(Global.tcpData.isPmGet);
            if (progress >= 2) {
                Global.game.showDialogPropText('你已经领取过今日奖励了');
            }
        },

        //刷新星星信息
        refreshDailyInfo: function () {
            var msg = '领取每日奖励成功,获得' + Global.rewardConfig.dailyRewardNum + '钻';
            Global.game.showDialogPropText(msg);
            Global.startUI.updateGold(Global.rewardConfig.dailyRewardNum);

            this.setDailyInfo();
            this.setMyStoneNum(0);
        },

        // 按钮回调：关闭
        onClose: function () {
            Global.game.playSound('btn', 0.1);
            if (this.node.parent) {
                this.node.parent.removeChild(this.node);
            }
            ThirdAPI.showGameClub(true);
        },

        resetData: function () {
            for (var index = 0; index < this.list.length; index++) {
                var item = this.list[index];
                if (item.parent) {
                    item.parent.removeChild(item);
                }
            }
        },

        update: function(dt) {
            if (this.updateWxRank && this.updateWxRank > 100) {
                this.updateWxRank = 1;
                try {
                    var openDataContext = wx.getOpenDataContext();
                    var sharedCanvas = openDataContext.canvas;

                    var texture = new cc.Texture2D();
                    texture.initWithElement(sharedCanvas);
                    texture.handleLoadedTexture();
                    var sp = new cc.SpriteFrame(texture);

                    this.drwaSprite.width = texture.width;
                    this.drwaSprite.height = texture.height;
                    this.drwaSprite.getComponent(cc.Sprite).spriteFrame = sp;
                } catch (error) {

                }
            } else {
                this.updateWxRank++;
            }
        },
    });