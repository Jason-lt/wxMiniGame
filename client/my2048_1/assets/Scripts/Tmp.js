var loadAtlas = require("./common/loadAtlas");
let ThirdAPI = require('./common/ThirdAPI')

cc.Class({
    extends: cc.Component,

    properties: {
        propBtns: {
            default: null,
            type: cc.Node
        },
        propBtnBg1: {
            default: null,
            type: cc.Node
        },
        propBtnBg2: {
            default: null,
            type: cc.Node
        },
        propBtnBg3: {
            default: null,
            type: cc.Node
        },

        // 这个属性引用了小球预制资源
        ballPrefab: {
            default: null,
            type: cc.Prefab
        },
        // 这个属性引用了砖块预制资源
        brickPrefab: {
            default: null,
            type: cc.Prefab
        },
        // 这个属性引用了道具预制资源
        propPrefab: {
            default: null,
            type: cc.Prefab
        },
        // 上边框
        TopEdge: {
            default: null,
            type: cc.Node
        },
        // 分数标签
        score: {
            default: null,
            type: cc.Label
        },
        // 分数图标
        scoreIcon: {
            default: null,
            type: cc.Node
        },
        // 道具分数
        starScore: {
            default: null,
            type: cc.Label
        },
        // 道具分数图标
        starScoreIcon: {
            default: null,
            type: cc.Node
        },
        // 这个属性引用了挡板预制资源
        paddlePrefab: {
            default: null,
            type: cc.Prefab
        },
        // 这个属性引用了WarningTip预制资源
        warningtipPrefab: {
            default: null,
            type: cc.Prefab
        },
        // 这个属性引用了Star预制资源
        starPrefab: {
            default: null,
            type: cc.Prefab
        },
        // WarningTip 节点
        warningTip: {
            default: null,
            type: cc.Node
        },
        // paddle 节点
        paddle: {
            default: null,
            type: cc.Node
        },
        // doublingScore 节点
        doublingScore: {
            default: null,
            type: cc.Label
        },
        // balls 节点
        balls: {
            default: null,
            type: cc.Node
        },
        // layer 节点
        layer: {
            default: null,
            type: cc.Node
        },

        //
        prop1: false,
        prop2: false,
        prop3: false,
        prop4: false,

        ballPool: [],
        brickPool: [],

        // 画笔
        g: cc.Graphics,

        // 是否结束
        isOver: false,
        // 是待复活状态
        isWait: false,

        arrMs: [],

        // tip 节点
        tip: {
            default: null,
            type: cc.Node
        },

        // 对局类型提示精灵
        gameTypeSprite: {
            default: null,
            type: cc.Sprite
        },

        // 本局复活次数
        reviveTimes: 0,

        // 本局种类
        gameType: 0,
        // 道具1概率
        prop1Chances: 0,
        // 道具2概率
        prop2Chances: 0,
        // 道具3概率
        prop3Chances: 0,

        ballVel: cc.p(0, 0),

        audioTick: 0,
        brickRowCount: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    // start () {},

    onLoad() {
        this.fitIphoneX();

        // 初始化对象池
        this.initGameObjectPool();

        this.initPropButtonState();

        // 生成配色方案
        this.generateColorArray();

        // 道具分数
        this.starScore.string = Global.numStarScore;
        this.score.string = 0;

        this.brickRowCount = 0;

        this.layer = new cc.Node('layer');
        this.layer.setPosition(0, 0);
        this.node.addChild(this.layer);

        this.balls.setLocalZOrder(1000);

        //
        this.doublingScore.node._sgNode.setVisible(false);

        // 生成挡板
        var newPaddle = cc.instantiate(this.paddlePrefab);
        if (Global.skinPaddle) {
            newPaddle.getComponent(cc.Sprite).spriteFrame = Global.skinPaddle;
        }
        this.node.addChild(newPaddle, 100);
        Global.paddleX = 0;
        Global.paddleY = Global.platformData.paddlePosY;
        newPaddle.setPosition(Global.paddleX, Global.paddleY);
        this.paddle = newPaddle.getComponent('Paddle');

        Global.paddleWidth = Global.platformData.paddleBeginWidth;
        this.paddle.node.width = Global.platformData.paddleBeginWidth;
        //console.log('the paddle width', this.paddle.node.width);

        // 生成警告信息
        this.warningTip = cc.instantiate(this.warningtipPrefab);
        this.node.addChild(this.warningTip);
        this.warningTip.setPosition(cc.p(0, Global.platformData.warningTipPosY));
        this.warningTip._sgNode.setVisible(false);

        // 生成此局类型
        this.initGameType();

        // 创建初始小球
        this.newBalls();
        // 创建砖块
        this.newBricks(5);

        this.arrMs = [];

        this.updateCount = 0;
        this.updateCount1 = 0;
        //this.newMapInfo(Global.brickUnit);

        this.isWudi = false;
        this.tip.opacity = 255;
        var _self = this;
        this.node.on('touchstart', function (event) {
            console.log('touch start');

            _self.paddle.clearState();
            _self.paddle.becomeWidth(Global.platformData.paddleBeginWidth);

            _self.tip.runAction(cc.repeat(cc.sequence(cc.fadeIn(0.5), cc.fadeOut(0.5)), 5));

            if (Global.ball && Global.ball.motionNode)
                Global.ball.motionNode.getComponent(cc.MotionStreak).reset();

            var vel_x = (cc.random0To1() > 0.5 ? -1 : 1) * (3 + 3 * cc.random0To1());
            Global.ball.velocity = cc.p(vel_x, 3 + 1 * cc.random0To1()); //(cc.p(-5, 6));

            _self.ballVel = Global.ball.velocity;
            //console.log("chushi", _self.ballVel);

            cc.director.getScheduler().schedule(_self.updateGame, _self, Global.brickDeltaTime, false);
            cc.director.getScheduler().schedule(_self.updateGame1, _self, /*Global.platformData.BrickTimeT*/ 30, false);

            // 产生新的小球
            //_self.newBall(cc.p(Global.paddleX, Global.paddleY + 30),
            //    Global.util.calculateVelocity(Global.ball.velocity, -3.1415926 / 18), Global.util.generateColorStrip3(0), true, true);
            //_self.newBall(cc.p(Global.paddleX, Global.paddleY + 30),
            //    Global.util.calculateVelocity(Global.ball.velocity, 3.1415926 / 18), Global.util.generateColorStrip3(0), true, true);
            if (Global.gameinfo.shareBallCount > 1) {
                for (let i = 0; i < Global.gameinfo.shareBallCount - 1; i++) {
                    let index = i - (Global.gameinfo.shareBallCount - 1) / 2;

                    if (index == 0) {
                        index = 1;
                    }
                    // 产生新的小球
                    _self.newBall(cc.p(Global.paddleX, Global.paddleY + 30),
                        Global.util.calculateVelocity(Global.ball.velocity, 3.1415926 / 36 * index),
                        Global.util.generateColorStrip3(0), true, true);
                }
            }

            Global.platformData.isfirst = false;
            if (Global.gameinfo.shareBallCount < 10 && !Global.platformData.isfirst) {
                Global.gameinfo.shareBallCount++;
                ThirdAPI.saveInfo(Global.gameinfo);
            }
            //Global.platformData.isfirst = false;

            _self.propBtns.active = true;

            _self.node.off('touchstart');
        });
    },

    initPropButtonState: function () {

        this.propBtns.active = false;
        this.propBtns.setLocalZOrder(2000);

        this.isBtn1 = true;
        this.isBtn2 = true;
        this.isBtn3 = true;

        this.propBtnBg1.active = true;
        this.propBtnBg2.active = true;
        this.propBtnBg2.active = true;
        this.propBtnBg1.runAction(cc.repeatForever(cc.sequence(cc.fadeOut(0.5), cc.fadeIn(0.5))));
        this.propBtnBg2.runAction(cc.repeatForever(cc.sequence(cc.fadeOut(0.5), cc.fadeIn(0.5))));
        this.propBtnBg3.runAction(cc.repeatForever(cc.sequence(cc.fadeOut(0.5), cc.fadeIn(0.5))));
    },

    // 适配iphoneX
    fitIphoneX: function () {
        if (Global.fitIphoneX) {
            console.log('适配iphoneX');
            this.TopEdge.height = 120;
            this.score.node.getComponent(cc.Widget).top = 60;
            this.scoreIcon.getComponent(cc.Widget).top = 60;
            this.starScore.node.getComponent(cc.Widget).top = 60;
            this.starScoreIcon.getComponent(cc.Widget).top = 60;
            this.doublingScore.node.getComponent(cc.Widget).top = 55;
        }
    },

    // 初始化对局类型
    initGameType: function () {
        var randnum = cc.random0To1() * 100;
        if (randnum >= 0 && randnum < 10) {
            this.gameType = 1;
            this.gameTypeSprite.spriteFrame = loadAtlas.getSpriteFrameFromName('icon-long');
        } else if (randnum >= 10 && randnum < 20) {
            this.gameType = 2;
            this.gameTypeSprite.spriteFrame = loadAtlas.getSpriteFrameFromName('icon-3');
        } else if (randnum >= 20 && randnum < 30) {
            this.gameType = 3;
            this.gameTypeSprite.spriteFrame = loadAtlas.getSpriteFrameFromName('icon-X2');
        } else {
            this.gameType = 0;
        }

        if (this.gameType == 0) { //普通局
            this.prop1Chances = 3;
            this.prop2Chances = 3;
            this.prop3Chances = 3;
        } else if (this.gameType == 1) { // 道具1局
            this.prop1Chances = 7;
            this.prop2Chances = 1;
            this.prop3Chances = 1;
        } else if (this.gameType == 2) { // 道具2局
            this.prop1Chances = 1;
            this.prop2Chances = 7;
            this.prop3Chances = 1;
        } else if (this.gameType == 3) { // 道具3局
            this.prop1Chances = 1;
            this.prop2Chances = 1;
            this.prop3Chances = 7;
        }

        console.log('道具概率：', this.gameType, this.prop1Chances, this.prop2Chances, this.prop3Chances);
    },

    // 初始化对象池
    initGameObjectPool: function () {
        // 初始化小球对象池
        this.ballPool = [];
        let initCount = 100;
        for (let i = 0; i < initCount; ++i) {
            let ball = cc.instantiate(this.ballPrefab);
            this.ballPool.push(ball);
            this.balls.addChild(ball);
            //ball.active = false;
            ball.setScale(0, 0);
        }

        // 初始化砖块对象池
        this.brickPool = [];
        let initCountBrick = 400;
        for (let i = 0; i < initCountBrick; ++i) {
            let ball = cc.instantiate(this.brickPrefab);
            this.brickPool.push(ball);
            this.node.addChild(ball);
            //ball.active = false;
            ball.setScale(0, 0);
        }
    },

    update(dt) {
        if (this.isWait) {
            //console.log('等待复活');
            return;
        }

        // 如果小球消失，游戏结束
        if (Global.arrBall.length <= 0) {
            //console.log('游戏结束a', Global.ball);
            this.waitRevive();
            return;
        }

        this.audioTick++;

        //if (this.isOver) return;

        this.collision(dt);

        for (var i = 0; i < Global.arrProp.length; i++) {
            var prop = Global.arrProp[i];
            if (!prop) continue;

            prop.node.setPositionY(prop.node.position.y - 6);

            if (!this.isOver && prop.collision() == 2) {
                Global.main.playPropSound();

                if (prop.propType == 1) {
                    if (!this.prop1) {
                        this.prop1 = true;
                        /*
                        var vel = Global.ball.velocity;
                        setTimeout(() => {
                            this.prop1 = false;
                            if (Global.ball)
                            {
                                Global.ball.setVelocity(vel);
                                if (Global.ball.velocity.y <0) {
                                    Global.ball.velocity.y *=-1;
                                }
                            }
                                
                        }, 5000);
                        Global.ball.setVelocity(cc.p(24, 14));
                        */
                    }
                } else if (prop.propType == 2 && Global.paddleWidth <= Global.platformData.paddleBeginWidth) {
                    //if (!this.prop2) {
                    this.prop2 = true;
                    this.paddle.clearState();
                    this.paddle.becomeWidth(Global.platformData.paddleBeginWidth);
                    //}
                } else if (prop.propType == 3) {
                    for (let i = 0; i < Global.platformData.maxProp2Balls; i++) {
                        // 产生新的小球
                        this.newBall(cc.p(this.paddle.node.position.x, this.paddle.node.position.y + Global.brickUnit),
                            cc.p(i - Global.platformData.maxProp2Balls / 2, 10), Global.util.generateColorStrip3(0), true, true);
                    }
                } else if (prop.propType == 4) {
                    if (!this.prop4) {
                        this.prop4 = true;
                        //console.log('道具4');
                        Global.unitScore = 2;
                        this.doublingScore.node._sgNode.setVisible(true);
                        this.doublingScore.node.runAction(cc.repeat(cc.sequence(cc.fadeIn(1), cc.fadeOut(1)), 5));
                        setTimeout(() => {
                            this.prop4 = false;
                            Global.unitScore = 2;
                        }, 10000);
                    }
                } else if (prop.propType == 5) {
                    //console.log('道具5');
                    // 产生新的小球
                    //this.newBalls();

                    this.newBall(
                        Global.ball.node.position,
                        Global.util.calculateVelocity(Global.ball.velocity, -3.1415926 / 6),
                        Global.util.generateColorStrip3(0),
                        true, true);
                    this.newBall(
                        Global.ball.node.position,
                        Global.util.calculateVelocity(Global.ball.velocity, 3.1415926 / 6),
                        Global.util.generateColorStrip3(0),
                        true, true);
                }
            }
        }

        /*
        if (this.prop1) {
            this.paddle.node.setPositionX(Global.ball.node.position.x);
        }
        */

        if (Global.ball != null) {
            if (Global.ball.velocity.x < Global.ballSpeedMax.x && Global.ball.velocity.y < Global.ballSpeedMax.y) {
                Global.ball.velocity.x += Global.ball.velocity.x * 0.0001;
                Global.ball.velocity.y += Global.ball.velocity.y * 0.0001;
                if (Global.ball.velocity.x > 0 || Global.ball.velocity.y > 0) {
                    this.ballVel = Global.ball.velocity;
                    //console.log("加速中", this.ballVel);

                }
            } else {
                //console.log("停止加速", Global.ball.velocity);
            }
        }

        // 绘制场景中所有小球的拖尾
        //this.g.clear();
        //this.drawTail();
        //console.log("the balls count is : %d", Global.arrBall.length);
        Global.main.labelLog.getComponent(cc.Label).string = "the balls count is : " + Global.arrBall.length;
    },

    // 进入复活界面
    waitRevive: function () {

        if (this.paddle) {
            this.paddle.clearState();
        }

        if (this.reviveTimes >= 1 || (this.reviveTimes > 1 && Global.numStarScore < 10)) {
            this.gameOver();
        } else {
            // 暂停所有
            this.isWait = true;
            cc.director.getScheduler().unschedule(this.updateGame, this);
            cc.director.getScheduler().unschedule(this.updateGame1, this);

            // 进入复活界面
            Global.main.showUIRevive();
        }
    },

    // 复活
    onRevive: function () {

        // 创建初始小球
        if (Global.ball) {
            Global.ball.PickSelf();
            Global.ball = null;
        }
        this.newBalls();

        var _self = this;
        // 消除砖块
        let col = Global.brickCol;
        if (Global.brickRow > 3) {
            for (var i = 0; i < Global.brickRow - 3; i++) {
                for (var j = 0; j < col; j++) {
                    if (Global.arrBrick[i] && Global.arrBrick[i][j]) {
                        let row = Global.arrBrick[i][j].i;
                        let col = Global.arrBrick[i][j].j;

                        if (Global.mapInfo[row])
                            Global.mapInfo[row][col] = 0;
                        if (Global.mapBricks[row])
                            Global.mapBricks[row][col] = null;

                        Global.arrBrick[i][j].runAction(cc.sequence(cc.blink(1, 4), cc.callFunc(function (node) {
                            //console.log('index', i, j, node);
                            if (node) {
                                node.getComponent("Brick").resetState();
                                node.setScale(0, 0);
                                _self.brickPool.push(node);
                            }
                        }, Global.arrBrick[i][j])));
                        Global.arrBrick[i][j] = null;
                    }
                }
            }
        }

        //setTimeout(() => {
        this.reviveTimes++;
        this.isWait = false;
        this.tip.opacity = 255;
        this.starScore.string = Global.numStarScore;
        //cc.director.getScheduler().schedule(this.updateGame, this, Global.brickDeltaTime, false);

        this.propBtns.active = false;

        Global.paddleWidth = Global.platformData.paddleBeginWidth;
        this.paddle.node.width = Global.platformData.paddleBeginWidth;
        //console.log('the paddle width', this.paddle.node.width);   
        //}, 1000);

        var _self = this;
        this.node.on('touchstart', function (event) {
            console.log('touch start1');

            _self.paddle.becomeWidth(Global.platformData.paddleBeginWidth);

            _self.tip.runAction(cc.repeat(cc.sequence(cc.fadeIn(0.5), cc.fadeOut(0.5)), 5));

            if (Global.ball && Global.ball.motionNode)
                Global.ball.motionNode.getComponent(cc.MotionStreak).reset();

            var vel_x = (cc.random0To1() > 0.5 ? -1 : 1) * (3 + 3 * cc.random0To1());
            //Global.ball.velocity = _self.ballVel;//cc.p(vel_x, 3 + 1 * cc.random0To1());//(cc.p(-5, 6));
            Global.ball.velocity.x = _self.ballVel.x; //cc.p(vel_x, 3 + 1 * cc.random0To1());//(cc.p(-5, 6));
            Global.ball.velocity.y = Math.abs(_self.ballVel.y);
            //console.log("开始", _self.ballVel);

            _self.newBricks(1);
            cc.director.getScheduler().schedule(_self.updateGame, _self, Global.brickDeltaTime, false);

            // 下次连续出现的间隔时间
            if (Global.platformData.BrickTimeB > Global.platformData.BrickTimeMin) {
                Global.platformData.BrickTimeT -= 2;
                Global.platformData.BrickTimeB -= 1;
            }
            var deltaTime = cc.random0To1() * (Global.platformData.BrickTimeT - Global.platformData.BrickTimeB) + Global.platformData.BrickTimeB;
            cc.director.getScheduler().schedule(_self.updateGame1, _self, /*deltaTime*/ 30, false);

            _self.propBtns.active = true;

            _self.node.off('touchstart');
        });
    },

    // 游戏结束
    gameOver: function () {
        let col = Global.brickCol;

        this.propBtns.active = false;

        this.isWait = false;
        this.isOver = true;
        cc.director.getScheduler().unschedule(this.updateGame, this);
        cc.director.getScheduler().unschedule(this.updateGame1, this);

        for (var i = 0; i < Global.brickRow; i++) {
            for (var j = 0; j < col; j++) {
                if (Global.arrBrick[i] && Global.arrBrick[i][j]) {
                    // 产生新的小球
                    this.newBall(
                        Global.arrBrick[i][j].position,
                        cc.p(0, -2),
                        Global.arrBrick[i][j].color, false, false);

                    if (Global.mapInfo[i])
                        Global.mapInfo[i][j] = 0;

                    //Global.arrBrick[i][j].active = false;
                    Global.arrBrick[i][j].setScale(0, 0);
                    this.brickPool.push(Global.arrBrick[i][j]);
                    Global.arrBrick[i][j] = null;
                }
            }
        }

        setTimeout(() => {
            Global.main.gameOver();
        }, 3000);
    },

    // 碰撞检测
    collision: function (dt) {
        if (!Global.arrBall || !Global.arrBall.length) return;
        this.updateCount++;
        //if (this.updateCount % 2 == 0)  return;
        for (var i = 0; i < Global.arrBall.length; i++) {
            var ball = Global.arrBall[i];
            if (!ball) continue;
            //if (this.updateCount % 2 == 0) {
            //if (i%2 == 0) continue;
            //}
            //else {
            //if (i%2 == 1) continue;
            //}

            //console.log('tick');
            ball.x += ball.velocity.x;
            ball.y += ball.velocity.y;
            ball.node.setPosition(ball.x, ball.y);
            //if (this.arrMs[i])    
            //this.arrMs[i].setPosition(ball.x, ball.y);
            if (ball.motionNode)
                ball.motionNode.setPosition(ball.x, ball.y);
            //if (this.updateCount % 5 == 0)
            if (!Global.platformData.isMotionStreak) {
                ball.savePath();
                //console.log(ball.node.position);
            }
            if (!ball.isRebound) {
                ball.collisionWhenNoRebound();
                ball.velocity.y -= 0.05;
            } else {
                ball.collision();

                if (this.isOver) continue;
                //continue;

                var posX = Global.zoneSize.width / 2 + ball.x;
                var posY = Global.zoneSize.height / 2 + ball.y;

                if (posY % Global.brickUnit > Global.brickUnit * 0.8 ||
                    posX % Global.brickUnit > Global.brickUnit * 0.7) {
                    //console.log("continue");
                    continue;
                }

                var row = Math.floor(posY / Global.brickUnit);
                var col = Math.floor(posX / Global.brickUnit);

                if (!Global.mapInfo[row] || !Global.mapInfo[row][col]) continue;
                if (Global.mapInfo[row][col] == 1) {
                    //ball.collisionWithBrick();
                    if (Global.ball == ball && this.isWudi) {

                    } else {
                        ball.velocity.y *= -1;
                        ball.isCollision = true;
                    }

                    if (Global.mapBricks[row][col].getComponent("Brick").isProp) {
                        this.newProp(Global.mapBricks[row][col].getComponent('Brick').propType, Global.mapBricks[row][col].position);
                    } else if (Global.mapBricks[row][col].getComponent("Brick").isStar) {

                        let newStar = cc.instantiate(this.starPrefab);
                        this.node.addChild(newStar);
                        newStar.setPosition(Global.mapBricks[row][col].position);
                        var _self = this;
                        var destination = cc.p(-280, 528);
                        newStar.runAction(
                            cc.sequence(cc.moveTo(destination.mag() / 400 * 1, destination),
                                cc.callFunc(function () {
                                    _self.starScore.string = ++Global.numStarScore;
                                    Global.main.saveStarScore();
                                }, this),
                                cc.removeSelf()));
                    } else {
                        if (Global.arrBall.length < Global.platformData.maxBalls) {
                            // 产生新的小球
                            this.newBall(
                                ball.node.position,
                                cc.p(ball.velocity.x > 0 ? 0.5 + 2 * cc.random0To1() : -0.5 - 2 * cc.random0To1(), 0),
                                Global.mapBricks[row][col].color, true, false);
                        }
                    }

                    Global.mapInfo[row][col] = 0;

                    let i = Global.mapBricks[row][col].i;
                    let j = Global.mapBricks[row][col].j;
                    Global.arrBrick[i][j] = null;

                    Global.mapBricks[row][col].getComponent("Brick").resetState();
                    //Global.mapBricks[row][col].active = false;
                    Global.mapBricks[row][col].setScale(0, 0);
                    this.brickPool.push(Global.mapBricks[row][col]);
                    Global.mapBricks[row][col] = null;

                    if (this.audioTick > 10) {
                        //console.log('play audio');
                        Global.main.playEffectSound(2);
                        this.audioTick = 0;
                    }

                    //this.continueBricks();
                }
            }
        }
    },

    continueBricks: function () {
        let isContinue = true;
        let col = Global.brickCol;
        for (var i = 0; i < Global.brickRow; i++) {
            for (var j = 0; j < col; j++) {
                if (Global.arrBrick[i] && Global.arrBrick[i][j]) {
                    isContinue = false;
                    break;
                }
            }
        }

        if (isContinue) {

            console.log('砖块继续下降');
            this.newBricks(1);
            cc.director.getScheduler().schedule(this.updateGame, this, Global.brickDeltaTime, false);

            // 下次连续出现的间隔时间
            if (Global.platformData.BrickTimeB > Global.platformData.BrickTimeMin) {
                Global.platformData.BrickTimeT -= 2;
                Global.platformData.BrickTimeB -= 1;
            }
            var deltaTime = cc.random0To1() * (Global.platformData.BrickTimeT - Global.platformData.BrickTimeB) + Global.platformData.BrickTimeB;
            cc.director.getScheduler().schedule(this.updateGame1, this, 30, false);

        }
    },

    // 游戏定时产生砖块
    updateGame: function (dt) {
        //console.log('tick per 5 seconds!');
        this.newBricks(1);

        /*
        if (this.brickRowCount % 10 == 0) {
            console.log('砖块暂停下降');
            cc.director.getScheduler().unschedule(this.updateGame, this);
            cc.director.getScheduler().unschedule(this.updateGame1, this);
        }*/

        //if (Global.brickDeltaTime > Global.brickDeltaTimeMin) {
        //cc.director.getScheduler().schedule(this.updateGame, this, Global.brickDeltaTime -= 0.05, false);
        //}
    },

    // 游戏定时产生砖块
    updateGame1: function (dt) {
        //console.log('tick per 5 seconds!');
        this.newBricks(1);
        if (!this.isWait && !this.isOver) {
            this.newBricks(1);
        }

        if (!this.isWait && !this.isOver) {
            console.log('isWait 1', this.isWait);
            setTimeout(() => {
                this.newBricks(1);
                if (!this.isWait && !this.isOver) {
                    this.newBricks(1);
                }
                if (!this.isWait && !this.isOver) {
                    console.log('isWait 2', this.isWait);
                    setTimeout(() => {
                        this.newBricks(1);
                        if (!this.isWait && !this.isOver) {
                            this.newBricks(1);
                        }
                    }, 500);

                    // 下次连续出现的间隔时间
                    //if (Global.platformData.BrickTimeB > Global.platformData.BrickTimeMin) {
                    //    Global.platformData.BrickTimeT -= 2;
                    //    Global.platformData.BrickTimeB -= 1;
                    //}
                    //var deltaTime = cc.random0To1() * (Global.platformData.BrickTimeT - Global.platformData.BrickTimeB) + Global.platformData.BrickTimeB;
                    //cc.director.getScheduler().schedule(this.updateGame1, this, deltaTime, false);
                }
            }, 500);
        }
    },


    onPropButton1: function () {
        console.log('点击道具1');
        Global.main.playTouchSound();

        if (this.isBtn1) {
            for (let i = 0; i < Global.platformData.maxProp2Balls; i++) {
                // 产生新的小球
                this.newBall(cc.p(this.paddle.node.position.x, this.paddle.node.position.y + Global.brickUnit),
                    cc.p(i - Global.platformData.maxProp2Balls / 2, 10), Global.util.generateColorStrip3(0), true, true);
            }

            this.isBtn1 = false;
            this.propBtnBg1.stopAllActions();
            this.propBtnBg1.active = false;
        } else {
            // 分享复活
            if (typeof FBInstant !== 'undefined') {
                ThirdAPI.shareGame(this.getImgBase64(), this.onBtn1ShareSuccess.bind(this), this.onBtn1ShareFailed.bind(this));
            } else if (typeof wx !== 'undefined') {
                ThirdAPI.shareGame(null, this.onBtn1ShareSuccess.bind(this), this.onBtn1ShareFailed.bind(this), '003');
            } else {
                this.onBtn1ShareSuccess();
            }
        }
    },

    onBtn1ShareSuccess: function (openGId) {
        console.log('求助成功');

        if (!Global.shareOpen) {
            console.log('游戏版本无分享获得道具');
            return;
        }

        if (!openGId) {
            console.log('分享的不是群');
            Global.main.showDialogText('分享到群才能获得获得道具');
            return;
        }

        if (Global.gameinfo.shareData4.arrOpenGId.indexOf(openGId) != -1) {
            console.log('该群已经分享过', openGId);
            Global.main.showDialogText('该群本日已经分享过无法获得道具');
            return;
        } else {
            console.log('该群未分享过', openGId);
            Global.gameinfo.shareData4.arrOpenGId.push(openGId);
            ThirdAPI.saveInfo(Global.gameinfo);
        }

        this.isBtn1 = true;
        this.propBtnBg1.active = true;
        this.propBtnBg1.runAction(cc.repeatForever(cc.sequence(cc.fadeOut(0.5), cc.fadeIn(0.5))));
    },

    onBtn1ShareFailed: function () {
        console.log('求助失败');
        console.log('1.分享取消，2.分享的不是群');

        if (!Global.shareOpen) {
            console.log('游戏版本无分享获得道具');
            return;
        }

        Global.main.showDialogText('分享到群才能获得获得道具');
    },

    onPropButton2: function () {
        console.log('点击道具2');
        Global.main.playTouchSound();

        if (this.isBtn2) {
            this.paddle.clearState();
            this.paddle.becomeWidth(Global.zoneSize.width);

            this.isBtn2 = false;
            this.propBtnBg2.stopAllActions();
            this.propBtnBg2.active = false;
        } else {
            // 分享复活
            if (typeof FBInstant !== 'undefined') {
                ThirdAPI.shareGame(this.getImgBase64(), this.onBtn2ShareSuccess.bind(this), this.onBtn2ShareFailed.bind(this));
            } else if (typeof wx !== 'undefined') {
                ThirdAPI.shareGame(null, this.onBtn2ShareSuccess.bind(this), this.onBtn2ShareFailed.bind(this), '003');
            } else {
                this.onBtn1ShareSuccess();
            }
        }
    },

    onBtn2ShareSuccess: function (openGId) {
        console.log('求助成功');

        if (!Global.shareOpen) {
            console.log('游戏版本无分享获得道具');
            return;
        }

        if (!openGId) {
            console.log('分享的不是群');
            Global.main.showDialogText('分享到群才能获得获得道具');
            return;
        }

        if (Global.gameinfo.shareData4.arrOpenGId.indexOf(openGId) != -1) {
            console.log('该群已经分享过', openGId);
            Global.main.showDialogText('该群本日已经分享过无法获得道具');
            return;
        } else {
            console.log('该群未分享过', openGId);
            Global.gameinfo.shareData4.arrOpenGId.push(openGId);
            ThirdAPI.saveInfo(Global.gameinfo);
        }

        this.isBtn2 = true;
        this.propBtnBg2.active = true;
        this.propBtnBg2.runAction(cc.repeatForever(cc.sequence(cc.fadeOut(0.5), cc.fadeIn(0.5))));
    },

    onBtn2ShareFailed: function () {
        console.log('求助失败');
        console.log('1.分享取消，2.分享的不是群');

        if (!Global.shareOpen) {
            console.log('游戏版本无分享获得道具');
            return;
        }

        Global.main.showDialogText('分享到群才能获得获得道具');
    },

    onPropButton3: function () {
        console.log('点击道具3');
        Global.main.playTouchSound();

        if (this.isBtn3) {
            this.isWudi = true;
            setTimeout(() => {
                this.isWudi = false;
            }, 10000);

            this.isBtn3 = false;
            this.propBtnBg3.stopAllActions();
            this.propBtnBg3.active = false;
        } else {
            // 分享复活
            if (typeof FBInstant !== 'undefined') {
                ThirdAPI.shareGame(this.getImgBase64(), this.onBtn3ShareSuccess.bind(this), this.onBtn3ShareFailed.bind(this));
            } else if (typeof wx !== 'undefined') {
                ThirdAPI.shareGame(null, this.onBtn3ShareSuccess.bind(this), this.onBtn3ShareFailed.bind(this), '003');
            } else {
                this.onBtn1ShareSuccess();
            }
        }
    },

    onBtn3ShareSuccess: function (openGId) {
        console.log('求助成功');

        if (!Global.shareOpen) {
            console.log('游戏版本无分享获得道具');
            return;
        }

        if (!openGId) {
            console.log('分享的不是群');
            Global.main.showDialogText('分享到群才能获得获得道具');
            return;
        }

        if (Global.gameinfo.shareData4.arrOpenGId.indexOf(openGId) != -1) {
            console.log('该群已经分享过', openGId);
            Global.main.showDialogText('该群本日已经分享过无法获得道具');
            return;
        } else {
            console.log('该群未分享过', openGId);
            Global.gameinfo.shareData4.arrOpenGId.push(openGId);
            ThirdAPI.saveInfo(Global.gameinfo);
        }

        this.isBtn3 = true;
        this.propBtnBg3.active = true;
        this.propBtnBg3.runAction(cc.repeatForever(cc.sequence(cc.fadeOut(0.5), cc.fadeIn(0.5))));
    },

    onBtn3ShareFailed: function () {
        console.log('求助失败');
        console.log('1.分享取消，2.分享的不是群');

        if (!Global.shareOpen) {
            console.log('游戏版本无分享获得道具');
            return;
        }

        Global.main.showDialogText('分享到群才能获得获得道具');
    },

    // 生成地图信息
    newMapInfo: function (unit) {
        Global.mapInfo = [];
        Global.mapBricks = [];

        var row = Math.floor(Global.zoneSize.height / unit);
        var col = Math.floor(Global.zoneSize.width / unit);
        //console.log(row, col);
        for (var i = 0; i < row; i++) {
            if (!Global.mapInfo[i]) Global.mapInfo[i] = [];
            if (!Global.mapBricks[i]) Global.mapBricks[i] = [];

            for (var j = 0; j < col; j++) {
                Global.mapInfo[i][j] = 0; // 0 1
                Global.mapBricks[i][j] = null;
            }
        }
    },

    // 生成砖块
    newBricks: function (n, bricksNoNew) {

        this.brickRowCount += n;
        console.log('砖块行数：', this.brickRowCount);

        bricksNoNew = ((this.brickRowCount % 15) > 9);
        console.log('不产生砖块：', bricksNoNew);

        var winSize = cc.director.getWinSize();
        this.newMapInfo(Global.brickUnit);

        let col = Global.brickCol;
        let row = n;

        let unit = Global.brickUnit;

        if (!Global.arrBrick) {
            Global.arrBrick = [];
        } else {
            for (var i = 0; i < Global.brickRow; i++) {
                for (var j = 0; j < col; j++) {
                    if (Global.arrBrick[i] && Global.arrBrick[i][j]) {
                        Global.arrBrick[i][j].setScale(1, 1);

                        Global.arrBrick[i][j].setPosition(Global.arrBrick[i][j].position.x, Global.arrBrick[i][j].position.y - Global.brickDistance * n);

                        if (Global.mapInfo[Math.floor((Global.zoneSize.height / 2 + Global.arrBrick[i][j].position.y) / unit)]) {
                            Global.mapInfo[Math.floor((Global.zoneSize.height / 2 + Global.arrBrick[i][j].position.y) / unit)][Math.floor((Global.zoneSize.width / 2 + Global.arrBrick[i][j].position.x) / unit)] = 1;
                        }
                        Global.mapBricks[Math.floor((Global.zoneSize.height / 2 + Global.arrBrick[i][j].position.y) / unit)][Math.floor((Global.zoneSize.width / 2 + Global.arrBrick[i][j].position.x) / unit)] = Global.arrBrick[i][j];

                        if (Global.arrBrick[i][j].position.y < 150 + this.warningTip.y) {
                            //console.log(Global.arrBrick[i][j].position.y);
                            if (Global.arrBrick[i][j].position.y < this.warningTip.y - 70) {
                                //Global.ball = null;
                                //console.log('游戏结束b', Global.ball);
                                Global.main.game.waitRevive();
                                return;
                            } else {
                                //console.log("warning");
                                // 显示
                                this.warningTip._sgNode.setVisible(true);
                                this.warningTip.runAction(cc.repeat(cc.sequence(cc.fadeIn(1), cc.fadeOut(1)), 3));
                            }
                        }
                    }
                }
            }
        }

        if (bricksNoNew) return;

        // 生成砖块
        let generateProp = false;
        let generatePropCol = 0;

        let propStep = 2;
        if (this.brickRowCount <= 50) {
            propStep = 2;
        } else if (this.brickRowCount > 50 && this.brickRowCount <= 100) {
            propStep = 3;
        } else if (this.brickRowCount > 100 && this.brickRowCount <= 150) {
            propStep = 4;
        } else if (this.brickRowCount > 150 && this.brickRowCount <= 200) {
            propStep = 5;
        } else if (this.brickRowCount > 200 && this.brickRowCount <= 250) {
            propStep = 6;
        } else if (this.brickRowCount > 250 && this.brickRowCount <= 300) {
            propStep = 7;
        }

        for (var i = 0; i < row; i++) {
            if (!Global.arrBrick[Global.brickRow + i]) {
                Global.arrBrick[Global.brickRow + i] = [];
            }

            if ((Global.brickRow + i) % propStep == 1) {
                generateProp = true;
                generatePropCol = Math.floor(cc.random0To1() * col);
            }

            for (var j = 0; j < col; j++) {
                // 使用给定的模板在场景中生成一个新节点
                var newBrick = null;
                if (this.brickPool.length > 0) {
                    newBrick = this.brickPool.pop();
                    //console.log("从对象池创建砖块");
                } else {
                    newBrick = cc.instantiate(this.brickPrefab);
                    this.node.addChild(newBrick);
                    //console.log("从Prefab创建砖块");
                }

                //this.node.addChild(newBrick);
                //newBrick.active = true;
                newBrick.setScale(1, 1);
                //newBrick.setContentSize(8,8);
                newBrick.setContentSize(Global.brickUnit * 0.8, Global.brickUnit * 0.8);
                newBrick.setPosition(cc.p(j * Global.brickDistance - Global.zoneSize.width / 2 + newBrick.width / 2, Global.zoneSize.height / 2 - (row - i - 1) * Global.brickDistance - Global.topEdge - newBrick.height / 2));
                Global.mapInfo[Math.floor((Global.zoneSize.height / 2 + newBrick.position.y) / unit)][Math.floor((Global.zoneSize.width / 2 + newBrick.position.x) / unit)] = 1;
                Global.mapBricks[Math.floor((Global.zoneSize.height / 2 + newBrick.position.y) / unit)][Math.floor((Global.zoneSize.width / 2 + newBrick.position.x) / unit)] = newBrick;
                //newBrick.color = Global.util.generateColorStrip(j/col);
                //newBrick.color = Global.util.generateColorStrip2(j/Global.brickCol, 1);
                newBrick.color = Global.util.generateColorStrip3(0);
                /*
                if (Global.colorArray && Global.colorArray[Global.colorIndex] && Global.colorArray[Global.colorIndex][j])
                {
                    newBrick.color = Global.colorArray[Global.colorIndex][j];
                }*/
                newBrick.i = i + Global.brickRow;
                newBrick.j = j;
                Global.arrBrick[newBrick.i][newBrick.j] = newBrick;

                // 道具
                if (generateProp && generatePropCol == j) {
                    var randPropNum = cc.random0To1() * 9;
                    //console.log('道具种类', randPropNum);
                    if (randPropNum >= 0 && randPropNum < this.prop1Chances) {
                        newBrick.getComponent("Brick").setProp(2);
                    } else if (randPropNum >= this.prop1Chances && randPropNum < this.prop1Chances + this.prop2Chances) {
                        newBrick.getComponent("Brick").setProp(3);
                    } else if (randPropNum >= this.prop1Chances + this.prop2Chances && randPropNum < this.prop1Chances + this.prop2Chances + this.prop3Chances) {
                        newBrick.getComponent("Brick").setProp(4);
                    }
                    //newBrick.getComponent("Brick").setProp(Math.floor(cc.rand() % 3 + 2));
                    newBrick.color = cc.color(255, 255, 255);
                    generateProp = false;
                }

                if (cc.random0To1() < 0.06) {
                    newBrick.getComponent("Brick").setStar();
                }

                //console.log(Global.arrBrick[Global.brickRow + i]);
            }

            Global.colorIndex++;
            if (Global.colorIndex >= Global.colorArray.length) {
                Global.colorIndex = 0;
            }

            //console.log(Global.arrBrick[Global.brickRow + i]);
        }

        Global.brickRow += n;
    },

    // 生成道具
    newProp: function (n, pos) {
        let newProp = cc.instantiate(this.propPrefab);
        this.node.addChild(newProp);
        newProp.setContentSize(Global.brickUnit, Global.brickUnit);
        newProp.setPosition(pos);
        newProp.getComponent('Prop').setPropType(n);
        Global.arrProp.push(newProp.getComponent('Prop'));
    },

    // 生成小球
    newBalls: function () {
        for (var i = 0; i < 1; i++) {
            let newBall = cc.instantiate(this.ballPrefab);
            this.balls.addChild(newBall);
            if (Global.skinBall) {
                newBall.getComponent(cc.Sprite).spriteFrame = Global.skinBall;
            }
            // 为星星设置一个随机位置
            newBall.setContentSize(Global.brickUnit * 0.8, Global.brickUnit * 0.8);
            newBall.setPosition(cc.p(Global.paddleX, Global.paddleY + Global.paddleHeight / 2 + newBall.height / 2 + 5));
            var vel_x = (cc.random0To1() > 0.5 ? -1 : 1) * (3 + 3 * cc.random0To1());

            var ball = newBall.getComponent('Ball');
            //ball.velocity = cc.p(vel_x, 3 + 1 * cc.random0To1());//(cc.p(-5, 6));
            //console.log(ball.velocity);
            //newBall.color = cc.color(255, 0, 0);
            // 将 Game 组件的实例传入小球组件
            ball.isRebound = true;
            ball.index = Global.arrBall.length;
            ball.x = newBall.position.x;
            ball.y = newBall.position.y;
            ball.width = newBall.width;
            ball.height = newBall.height;
            ball.initStreak(true, newBall.color);
            Global.arrBall.push(ball);
            Global.ball = ball;

            if (Global.platformData.isMotionStreak) {
                if (ball.motionNode == null) {
                    var newMotionStreak = new cc.Node('layer');
                    this.layer.addChild(newMotionStreak);
                    var ms = newMotionStreak.addComponent(cc.MotionStreak);
                    ball.motionNode = newMotionStreak;
                }

                ball.motionNode.getComponent(cc.MotionStreak).enabled = true;
                ball.motionNode.getComponent(cc.MotionStreak).reset();
                ball.motionNode.getComponent(cc.MotionStreak).texture = Global.main.textureBall1;
                if (Global.skinStreak) {
                    ball.motionNode.getComponent(cc.MotionStreak).texture = Global.skinStreak.getTexture();
                }

                ball.motionNode.getComponent(cc.MotionStreak).stroke = newBall.width; //8;
                ball.motionNode.getComponent(cc.MotionStreak).color = newBall.color;
                ball.motionNode.getComponent(cc.MotionStreak).fadeTime = 0.5;
            }
        }
        //Global.ball = newBall.getComponent('Ball');
    },

    // 根据位置、速度、颜色生成小球，第三种方法，对象池
    newBall: function (pos, vel, color, isMotionStreak, isRebound) {
        let newBall = null;
        if (this.ballPool.length > 0) {
            newBall = this.ballPool.pop();
            //console.log("从对象池创建");
        } else {
            newBall = cc.instantiate(this.ballPrefab);
            this.balls.addChild(newBall);
            //console.log("从Prefab创建");
        }

        //this.balls.addChild(newBall);
        newBall.setContentSize(Global.brickUnit * 0.4, Global.brickUnit * 0.4);
        newBall.setPosition(pos);
        var ball = newBall.getComponent('Ball');
        ball.velocity = vel;
        newBall.color = cc.hexToColor(Global.util.lightenDarkenColor(cc.colorToHex(color), -50)); //color;
        ball.isRebound = isRebound;
        ball.index = Global.arrBall.length;
        ball.width = newBall.width;
        ball.height = newBall.height;
        ball.x = pos.x;
        ball.y = pos.y;
        //ball.isStreak = isMotionStreak;
        ball.initStreak(isMotionStreak, newBall.color);
        Global.arrBall.push(ball);

        /*
        if (isMotionStreak) {
            var ms = newBall.addComponent(cc.MotionStreak);
            ms.fadeTime = 0.5;
        }        

        
        if (newBall.getComponent(cc.MotionStreak)) {
            if (isMotionStreak) {
                newBall.getComponent(cc.MotionStreak).enabled = true;
            }
            else {
                newBall.getComponent(cc.MotionStreak).enabled = false;
            }

            if (!Global.motionStreakEnabled) {
                newBall.getComponent(cc.MotionStreak).enabled = false;
            }
            newBall.getComponent(cc.MotionStreak).reset();
            newBall.getComponent(cc.MotionStreak).texture = Global.main.textureBall1;
            newBall.getComponent(cc.MotionStreak).stroke = newBall.width;//8;
            newBall.getComponent(cc.MotionStreak).color = newBall.color;
        }
        */




        if (Global.platformData.isMotionStreak && isMotionStreak) {
            if (ball.motionNode == null) {
                var newMotionStreak = new cc.Node('layer');
                this.layer.addChild(newMotionStreak);
                var ms = newMotionStreak.addComponent(cc.MotionStreak);
                ball.motionNode = newMotionStreak;
            }

            ball.motionNode.getComponent(cc.MotionStreak).enabled = true;
            ball.motionNode.getComponent(cc.MotionStreak).reset();
            ball.motionNode.getComponent(cc.MotionStreak).texture = Global.main.textureBall1;
            ball.motionNode.getComponent(cc.MotionStreak).stroke = newBall.width; //8;
            ball.motionNode.getComponent(cc.MotionStreak).color = newBall.color;
            ball.motionNode.getComponent(cc.MotionStreak).fadeTime = Global.platformData.fadeTime;
            ball.motionNode.getComponent(cc.MotionStreak).fastMode = true;
            ball.motionNode.getComponent(cc.MotionStreak).minSeg = 3;
        } else {
            if (ball.motionNode != null) {
                ball.motionNode.removeComponent(cc.MotionStreak);
                ball.motionNode = null;
            }
        }


        //newBall.active = true;
        newBall.setScale(1, 1);
    },

    // 加入图片像素到颜色方案
    addImageToColorArray: function (imagefile) {
        //console.log("addImageToColorArray");
        // 获取图片像素数据
        var arr1 = Global.main.getImageColorArray(imagefile);
        var colorRow = 0;
        var colorCol = 0;
        if (arr1.length) {
            colorRow = arr1.length;
            if (arr1[0].length) {
                colorCol = arr1[0].length;
            }
        }

        var imageRow = Math.floor(colorRow * Global.brickCol / colorCol);
        //console.log(colorRow, imageRow);
        if (colorCol) {
            for (var i = 0; i < imageRow; i++) {
                if (!Global.colorArray[i + Global.colorIndex]) {
                    Global.colorArray[i + Global.colorIndex] = [];
                }

                for (var j = 0; j < Global.brickCol; j++) {
                    //console.log((imageRow-i-1)*Math.floor(colorRow/imageRow),arr1.length, imageRow, colorRow, colorCol);
                    Global.colorArray[i + Global.colorIndex][j] = arr1[(imageRow - i - 1) * Math.floor(colorRow / imageRow)][j * Math.floor(colorCol / Global.brickCol)];
                }
            }
            Global.colorIndex += imageRow;
            //console.log(Global.colorIndex);
        }
    },

    // 加入颜色条带到颜色方案
    addStripToColorArray: function (stripRow) {
        for (var i = 0; i < stripRow; i++) {
            if (!Global.colorArray[i + Global.colorIndex]) {
                Global.colorArray[i + Global.colorIndex] = [];
            }

            for (var j = 0; j < Global.brickCol; j++) {
                Global.colorArray[i + Global.colorIndex][j] = Global.util.generateColorStrip1(j / Global.brickCol);
            }
        }
        Global.colorIndex += stripRow;
        //console.log(Global.colorIndex);
    },

    // 加入颜色条带到颜色方案1
    addStripToColorArray1: function (stripRow, stripCol, n) {
        for (var i = 0; i < stripRow; i++) {
            if (!Global.colorArray[i + Global.colorIndex]) {
                Global.colorArray[i + Global.colorIndex] = [];
            }
        }

        var colorBrick;
        for (var i = 0; i < Global.brickCol; i++) {
            if (i % 4 == 0) {
                colorBrick = Global.util.generateColorStrip1(i / Global.brickCol, n);
            }

            for (var j = 0; j < stripRow; j++) {
                Global.colorArray[j + Global.colorIndex][i] = colorBrick;
            }
        }

        Global.colorIndex += stripRow;
        //console.log(Global.colorIndex);
    },

    // 生成颜色方案数组
    generateColorArray: function () {
        Global.colorArray = [];
        Global.colorIndex = 0;

        //this.addImageToColorArray("resources/2.png");
        //this.addStripToColorArray(10);
        //this.addImageToColorArray("resources/4.jpg");
        //this.addStripToColorArray(10);
        this.addStripToColorArray1(4, 4, 1);
        this.addStripToColorArray1(4, 4, 2);
        this.addStripToColorArray1(4, 4, 3);
        this.addStripToColorArray1(4, 4, 4);
        this.addStripToColorArray1(4, 4, 5);
        this.addStripToColorArray1(4, 4, 6);
        this.addStripToColorArray1(4, 4, 7);
        this.addStripToColorArray1(4, 4, 8);
        //this.addImageToColorArray("resources/brickbg1.png");

        //console.log(Global.colorArray);
        Global.colorIndex = 0;
    },

    // 绘制点
    drawPoint: function (x, y, color, size) {
        this.g.fillColor = color;
        this.g.circle(x, y, size);
        this.g.fill();
    },

    // 绘制直线
    drawLine: function (pt1, pt2, color, size) {
        this.g.strokeColor = color;
        this.g.lineWidth = size;
        this.g.moveTo(pt1.x, pt1.y);
        this.g.lineTo(pt2.x, pt2.y);
    },

    // 绘制小球拖尾
    drawTail: function () {
        this.g.clear();
        for (var x in Global.arrBall) {
            // 获取小球颜色
            var colorTail = Global.arrBall[x].node.color;
            let colorTailMinValue = colorTail.getR() < colorTail.getG() ? colorTail.getR() : (colorTail.getG() < colorTail.getB() ? colorTail.getG() : colorTail.getB());
            var colorTailHex = cc.colorToHex(colorTail);

            // 获取小球宽度，根据宽度算出20次减到0需要的步长
            var deltaSize = 0;
            if (Global.arrBall[x].arrPoint.length > 0) {
                deltaSize = Global.arrBall[x].node.width / 2 / Global.arrBall[x].arrPoint.length;
            }

            for (var i = 0; i < Global.arrBall[x].arrPoint.length; i++) {
                // 调整颜色亮度
                colorTailHex = Global.util.lightenDarkenColor(colorTailHex, -0.03 * colorTailMinValue);

                this.drawPoint(Global.arrBall[x].arrPoint[i].x, Global.arrBall[x].arrPoint[i].y,
                    cc.hexToColor(colorTailHex),
                    Global.arrBall[x].node.width / 2 - i * deltaSize);
                if (i + 1 < Global.arrBall[x].arrPoint.length) {

                    this.drawPoint((Global.arrBall[x].arrPoint[i].x + Global.arrBall[x].arrPoint[i + 1].x) / 2, (Global.arrBall[x].arrPoint[i].y + Global.arrBall[x].arrPoint[i + 1].y) / 2,
                        cc.hexToColor(colorTailHex),
                        Global.arrBall[x].node.width / 2 - i * deltaSize);
                }
            }
        }
    },

    initPropButtonState1: function () {

        this.propBtns.active = false;
        this.propBtns.setLocalZOrder(2000);

        this.isBtn1 = true;
        this.isBtn2 = true;
        this.isBtn3 = true;

        this.propBtnBg1.active = true;
        this.propBtnBg2.active = true;
        this.propBtnBg2.active = true;
        this.propBtnBg1.runAction(cc.repeatForever(cc.sequence(cc.fadeOut(0.5), cc.fadeIn(0.5))));
        this.propBtnBg2.runAction(cc.repeatForever(cc.sequence(cc.fadeOut(0.5), cc.fadeIn(0.5))));
        this.propBtnBg3.runAction(cc.repeatForever(cc.sequence(cc.fadeOut(0.5), cc.fadeIn(0.5))));
    },

    // 适配iphoneX
    fitIphoneX1: function () {
        if (Global.fitIphoneX) {
            console.log('适配iphoneX');
            this.TopEdge.height = 120;
            this.score.node.getComponent(cc.Widget).top = 60;
            this.scoreIcon.getComponent(cc.Widget).top = 60;
            this.starScore.node.getComponent(cc.Widget).top = 60;
            this.starScoreIcon.getComponent(cc.Widget).top = 60;
            this.doublingScore.node.getComponent(cc.Widget).top = 55;
        }
    },

    // 初始化对局类型
    initGameType1: function () {
        var randnum = cc.random0To1() * 100;
        if (randnum >= 0 && randnum < 10) {
            this.gameType = 1;
            this.gameTypeSprite.spriteFrame = loadAtlas.getSpriteFrameFromName('icon-long');
        } else if (randnum >= 10 && randnum < 20) {
            this.gameType = 2;
            this.gameTypeSprite.spriteFrame = loadAtlas.getSpriteFrameFromName('icon-3');
        } else if (randnum >= 20 && randnum < 30) {
            this.gameType = 3;
            this.gameTypeSprite.spriteFrame = loadAtlas.getSpriteFrameFromName('icon-X2');
        } else {
            this.gameType = 0;
        }

        if (this.gameType == 0) { //普通局
            this.prop1Chances = 3;
            this.prop2Chances = 3;
            this.prop3Chances = 3;
        } else if (this.gameType == 1) { // 道具1局
            this.prop1Chances = 7;
            this.prop2Chances = 1;
            this.prop3Chances = 1;
        } else if (this.gameType == 2) { // 道具2局
            this.prop1Chances = 1;
            this.prop2Chances = 7;
            this.prop3Chances = 1;
        } else if (this.gameType == 3) { // 道具3局
            this.prop1Chances = 1;
            this.prop2Chances = 1;
            this.prop3Chances = 7;
        }

        console.log('道具概率：', this.gameType, this.prop1Chances, this.prop2Chances, this.prop3Chances);
    },

    // 初始化对象池
    initGameObjectPool1: function () {
        // 初始化小球对象池
        this.ballPool = [];
        let initCount = 100;
        for (let i = 0; i < initCount; ++i) {
            let ball = cc.instantiate(this.ballPrefab);
            this.ballPool.push(ball);
            this.balls.addChild(ball);
            //ball.active = false;
            ball.setScale(0, 0);
        }

        // 初始化砖块对象池
        this.brickPool = [];
        let initCountBrick = 400;
        for (let i = 0; i < initCountBrick; ++i) {
            let ball = cc.instantiate(this.brickPrefab);
            this.brickPool.push(ball);
            this.node.addChild(ball);
            //ball.active = false;
            ball.setScale(0, 0);
        }
    },

    initGameObjectPool2: function () {
        if (this.isWait) {
            //console.log('等待复活');
            return;
        }

        // 如果小球消失，游戏结束
        if (Global.arrBall.length <= 0) {
            //console.log('游戏结束a', Global.ball);
            this.waitRevive();
            return;
        }

        this.audioTick++;

        //if (this.isOver) return;

        this.collision(dt);

        for (var i = 0; i < Global.arrProp.length; i++) {
            var prop = Global.arrProp[i];
            if (!prop) continue;

            prop.node.setPositionY(prop.node.position.y - 6);

            if (!this.isOver && prop.collision() == 2) {
                Global.main.playPropSound();

                if (prop.propType == 1) {
                    if (!this.prop1) {
                        this.prop1 = true;
                        /*
                        var vel = Global.ball.velocity;
                        setTimeout(() => {
                            this.prop1 = false;
                            if (Global.ball)
                            {
                                Global.ball.setVelocity(vel);
                                if (Global.ball.velocity.y <0) {
                                    Global.ball.velocity.y *=-1;
                                }
                            }
                                
                        }, 5000);
                        Global.ball.setVelocity(cc.p(24, 14));
                        */
                    }
                } else if (prop.propType == 2 && Global.paddleWidth <= Global.platformData.paddleBeginWidth) {
                    //if (!this.prop2) {
                    this.prop2 = true;
                    this.paddle.clearState();
                    this.paddle.becomeWidth(Global.platformData.paddleBeginWidth);
                    //}
                } else if (prop.propType == 3) {
                    for (let i = 0; i < Global.platformData.maxProp2Balls; i++) {
                        // 产生新的小球
                        this.newBall(cc.p(this.paddle.node.position.x, this.paddle.node.position.y + Global.brickUnit),
                            cc.p(i - Global.platformData.maxProp2Balls / 2, 10), Global.util.generateColorStrip3(0), true, true);
                    }
                } else if (prop.propType == 4) {
                    if (!this.prop4) {
                        this.prop4 = true;
                        //console.log('道具4');
                        Global.unitScore = 2;
                        this.doublingScore.node._sgNode.setVisible(true);
                        this.doublingScore.node.runAction(cc.repeat(cc.sequence(cc.fadeIn(1), cc.fadeOut(1)), 5));
                        setTimeout(() => {
                            this.prop4 = false;
                            Global.unitScore = 2;
                        }, 10000);
                    }
                } else if (prop.propType == 5) {
                    //console.log('道具5');
                    // 产生新的小球
                    //this.newBalls();

                    this.newBall(
                        Global.ball.node.position,
                        Global.util.calculateVelocity(Global.ball.velocity, -3.1415926 / 6),
                        Global.util.generateColorStrip3(0),
                        true, true);
                    this.newBall(
                        Global.ball.node.position,
                        Global.util.calculateVelocity(Global.ball.velocity, 3.1415926 / 6),
                        Global.util.generateColorStrip3(0),
                        true, true);
                }
            }
        }

        /*
        if (this.prop1) {
            this.paddle.node.setPositionX(Global.ball.node.position.x);
        }
        */

        if (Global.ball != null) {
            if (Global.ball.velocity.x < Global.ballSpeedMax.x && Global.ball.velocity.y < Global.ballSpeedMax.y) {
                Global.ball.velocity.x += Global.ball.velocity.x * 0.0001;
                Global.ball.velocity.y += Global.ball.velocity.y * 0.0001;
                if (Global.ball.velocity.x > 0 || Global.ball.velocity.y > 0) {
                    this.ballVel = Global.ball.velocity;
                    //console.log("加速中", this.ballVel);

                }
            } else {
                //console.log("停止加速", Global.ball.velocity);
            }
        }

        // 绘制场景中所有小球的拖尾
        //this.g.clear();
        //this.drawTail();
        //console.log("the balls count is : %d", Global.arrBall.length);
        Global.main.labelLog.getComponent(cc.Label).string = "the balls count is : " + Global.arrBall.length;
    },

    // 进入复活界面
    waitRevive1: function () {

        if (this.paddle) {
            this.paddle.clearState();
        }

        if (this.reviveTimes >= 1 || (this.reviveTimes > 1 && Global.numStarScore < 10)) {
            this.gameOver();
        } else {
            // 暂停所有
            this.isWait = true;
            cc.director.getScheduler().unschedule(this.updateGame, this);
            cc.director.getScheduler().unschedule(this.updateGame1, this);

            // 进入复活界面
            Global.main.showUIRevive();
        }
    },

    // 复活
    onRevive1: function () {

        // 创建初始小球
        if (Global.ball) {
            Global.ball.PickSelf();
            Global.ball = null;
        }
        this.newBalls();

        var _self = this;
        // 消除砖块
        let col = Global.brickCol;
        if (Global.brickRow > 3) {
            for (var i = 0; i < Global.brickRow - 3; i++) {
                for (var j = 0; j < col; j++) {
                    if (Global.arrBrick[i] && Global.arrBrick[i][j]) {
                        let row = Global.arrBrick[i][j].i;
                        let col = Global.arrBrick[i][j].j;

                        if (Global.mapInfo[row])
                            Global.mapInfo[row][col] = 0;
                        if (Global.mapBricks[row])
                            Global.mapBricks[row][col] = null;

                        Global.arrBrick[i][j].runAction(cc.sequence(cc.blink(1, 4), cc.callFunc(function (node) {
                            //console.log('index', i, j, node);
                            if (node) {
                                node.getComponent("Brick").resetState();
                                node.setScale(0, 0);
                                _self.brickPool.push(node);
                            }
                        }, Global.arrBrick[i][j])));
                        Global.arrBrick[i][j] = null;
                    }
                }
            }
        }

        //setTimeout(() => {
        this.reviveTimes++;
        this.isWait = false;
        this.tip.opacity = 255;
        this.starScore.string = Global.numStarScore;
        //cc.director.getScheduler().schedule(this.updateGame, this, Global.brickDeltaTime, false);

        this.propBtns.active = false;

        Global.paddleWidth = Global.platformData.paddleBeginWidth;
        this.paddle.node.width = Global.platformData.paddleBeginWidth;
        //console.log('the paddle width', this.paddle.node.width);   
        //}, 1000);

        var _self = this;
        this.node.on('touchstart', function (event) {
            console.log('touch start1');

            _self.paddle.becomeWidth(Global.platformData.paddleBeginWidth);

            _self.tip.runAction(cc.repeat(cc.sequence(cc.fadeIn(0.5), cc.fadeOut(0.5)), 5));

            if (Global.ball && Global.ball.motionNode)
                Global.ball.motionNode.getComponent(cc.MotionStreak).reset();

            var vel_x = (cc.random0To1() > 0.5 ? -1 : 1) * (3 + 3 * cc.random0To1());
            //Global.ball.velocity = _self.ballVel;//cc.p(vel_x, 3 + 1 * cc.random0To1());//(cc.p(-5, 6));
            Global.ball.velocity.x = _self.ballVel.x; //cc.p(vel_x, 3 + 1 * cc.random0To1());//(cc.p(-5, 6));
            Global.ball.velocity.y = Math.abs(_self.ballVel.y);
            //console.log("开始", _self.ballVel);

            _self.newBricks(1);
            cc.director.getScheduler().schedule(_self.updateGame, _self, Global.brickDeltaTime, false);

            // 下次连续出现的间隔时间
            if (Global.platformData.BrickTimeB > Global.platformData.BrickTimeMin) {
                Global.platformData.BrickTimeT -= 2;
                Global.platformData.BrickTimeB -= 1;
            }
            var deltaTime = cc.random0To1() * (Global.platformData.BrickTimeT - Global.platformData.BrickTimeB) + Global.platformData.BrickTimeB;
            cc.director.getScheduler().schedule(_self.updateGame1, _self, /*deltaTime*/ 30, false);

            _self.propBtns.active = true;

            _self.node.off('touchstart');
        });
    },

    // 游戏结束
    gameOver1: function () {
        let col = Global.brickCol;

        this.propBtns.active = false;

        this.isWait = false;
        this.isOver = true;
        cc.director.getScheduler().unschedule(this.updateGame, this);
        cc.director.getScheduler().unschedule(this.updateGame1, this);

        for (var i = 0; i < Global.brickRow; i++) {
            for (var j = 0; j < col; j++) {
                if (Global.arrBrick[i] && Global.arrBrick[i][j]) {
                    // 产生新的小球
                    this.newBall(
                        Global.arrBrick[i][j].position,
                        cc.p(0, -2),
                        Global.arrBrick[i][j].color, false, false);

                    if (Global.mapInfo[i])
                        Global.mapInfo[i][j] = 0;

                    //Global.arrBrick[i][j].active = false;
                    Global.arrBrick[i][j].setScale(0, 0);
                    this.brickPool.push(Global.arrBrick[i][j]);
                    Global.arrBrick[i][j] = null;
                }
            }
        }

        setTimeout(() => {
            Global.main.gameOver();
        }, 3000);
    },

    // 碰撞检测
    collision1: function (dt) {
        if (!Global.arrBall || !Global.arrBall.length) return;
        this.updateCount++;
        //if (this.updateCount % 2 == 0)  return;
        for (var i = 0; i < Global.arrBall.length; i++) {
            var ball = Global.arrBall[i];
            if (!ball) continue;
            //if (this.updateCount % 2 == 0) {
            //if (i%2 == 0) continue;
            //}
            //else {
            //if (i%2 == 1) continue;
            //}

            //console.log('tick');
            ball.x += ball.velocity.x;
            ball.y += ball.velocity.y;
            ball.node.setPosition(ball.x, ball.y);
            //if (this.arrMs[i])    
            //this.arrMs[i].setPosition(ball.x, ball.y);
            if (ball.motionNode)
                ball.motionNode.setPosition(ball.x, ball.y);
            //if (this.updateCount % 5 == 0)
            if (!Global.platformData.isMotionStreak) {
                ball.savePath();
                //console.log(ball.node.position);
            }
            if (!ball.isRebound) {
                ball.collisionWhenNoRebound();
                ball.velocity.y -= 0.05;
            } else {
                ball.collision();

                if (this.isOver) continue;
                //continue;

                var posX = Global.zoneSize.width / 2 + ball.x;
                var posY = Global.zoneSize.height / 2 + ball.y;

                if (posY % Global.brickUnit > Global.brickUnit * 0.8 ||
                    posX % Global.brickUnit > Global.brickUnit * 0.7) {
                    //console.log("continue");
                    continue;
                }

                var row = Math.floor(posY / Global.brickUnit);
                var col = Math.floor(posX / Global.brickUnit);

                if (!Global.mapInfo[row] || !Global.mapInfo[row][col]) continue;
                if (Global.mapInfo[row][col] == 1) {
                    //ball.collisionWithBrick();
                    if (Global.ball == ball && this.isWudi) {

                    } else {
                        ball.velocity.y *= -1;
                        ball.isCollision = true;
                    }

                    if (Global.mapBricks[row][col].getComponent("Brick").isProp) {
                        this.newProp(Global.mapBricks[row][col].getComponent('Brick').propType, Global.mapBricks[row][col].position);
                    } else if (Global.mapBricks[row][col].getComponent("Brick").isStar) {

                        let newStar = cc.instantiate(this.starPrefab);
                        this.node.addChild(newStar);
                        newStar.setPosition(Global.mapBricks[row][col].position);
                        var _self = this;
                        var destination = cc.p(-280, 528);
                        newStar.runAction(
                            cc.sequence(cc.moveTo(destination.mag() / 400 * 1, destination),
                                cc.callFunc(function () {
                                    _self.starScore.string = ++Global.numStarScore;
                                    Global.main.saveStarScore();
                                }, this),
                                cc.removeSelf()));
                    } else {
                        if (Global.arrBall.length < Global.platformData.maxBalls) {
                            // 产生新的小球
                            this.newBall(
                                ball.node.position,
                                cc.p(ball.velocity.x > 0 ? 0.5 + 2 * cc.random0To1() : -0.5 - 2 * cc.random0To1(), 0),
                                Global.mapBricks[row][col].color, true, false);
                        }
                    }

                    Global.mapInfo[row][col] = 0;

                    let i = Global.mapBricks[row][col].i;
                    let j = Global.mapBricks[row][col].j;
                    Global.arrBrick[i][j] = null;

                    Global.mapBricks[row][col].getComponent("Brick").resetState();
                    //Global.mapBricks[row][col].active = false;
                    Global.mapBricks[row][col].setScale(0, 0);
                    this.brickPool.push(Global.mapBricks[row][col]);
                    Global.mapBricks[row][col] = null;

                    if (this.audioTick > 10) {
                        //console.log('play audio');
                        Global.main.playEffectSound(2);
                        this.audioTick = 0;
                    }

                    //this.continueBricks();
                }
            }
        }
    },

    continueBricks1: function () {
        let isContinue = true;
        let col = Global.brickCol;
        for (var i = 0; i < Global.brickRow; i++) {
            for (var j = 0; j < col; j++) {
                if (Global.arrBrick[i] && Global.arrBrick[i][j]) {
                    isContinue = false;
                    break;
                }
            }
        }

        if (isContinue) {

            console.log('砖块继续下降');
            this.newBricks(1);
            cc.director.getScheduler().schedule(this.updateGame, this, Global.brickDeltaTime, false);

            // 下次连续出现的间隔时间
            if (Global.platformData.BrickTimeB > Global.platformData.BrickTimeMin) {
                Global.platformData.BrickTimeT -= 2;
                Global.platformData.BrickTimeB -= 1;
            }
            var deltaTime = cc.random0To1() * (Global.platformData.BrickTimeT - Global.platformData.BrickTimeB) + Global.platformData.BrickTimeB;
            cc.director.getScheduler().schedule(this.updateGame1, this, 30, false);

        }
    },

    // 游戏定时产生砖块
    updateGame1: function (dt) {
        //console.log('tick per 5 seconds!');
        this.newBricks(1);

        /*
        if (this.brickRowCount % 10 == 0) {
            console.log('砖块暂停下降');
            cc.director.getScheduler().unschedule(this.updateGame, this);
            cc.director.getScheduler().unschedule(this.updateGame1, this);
        }*/

        //if (Global.brickDeltaTime > Global.brickDeltaTimeMin) {
        //cc.director.getScheduler().schedule(this.updateGame, this, Global.brickDeltaTime -= 0.05, false);
        //}
    },

    // 游戏定时产生砖块
    updateGame12: function (dt) {
        //console.log('tick per 5 seconds!');
        this.newBricks(1);
        if (!this.isWait && !this.isOver) {
            this.newBricks(1);
        }

        if (!this.isWait && !this.isOver) {
            console.log('isWait 1', this.isWait);
            setTimeout(() => {
                this.newBricks(1);
                if (!this.isWait && !this.isOver) {
                    this.newBricks(1);
                }
                if (!this.isWait && !this.isOver) {
                    console.log('isWait 2', this.isWait);
                    setTimeout(() => {
                        this.newBricks(1);
                        if (!this.isWait && !this.isOver) {
                            this.newBricks(1);
                        }
                    }, 500);

                    // 下次连续出现的间隔时间
                    //if (Global.platformData.BrickTimeB > Global.platformData.BrickTimeMin) {
                    //    Global.platformData.BrickTimeT -= 2;
                    //    Global.platformData.BrickTimeB -= 1;
                    //}
                    //var deltaTime = cc.random0To1() * (Global.platformData.BrickTimeT - Global.platformData.BrickTimeB) + Global.platformData.BrickTimeB;
                    //cc.director.getScheduler().schedule(this.updateGame1, this, deltaTime, false);
                }
            }, 500);
        }
    },


    onPropButton11: function () {
        console.log('点击道具1');
        Global.main.playTouchSound();

        if (this.isBtn1) {
            for (let i = 0; i < Global.platformData.maxProp2Balls; i++) {
                // 产生新的小球
                this.newBall(cc.p(this.paddle.node.position.x, this.paddle.node.position.y + Global.brickUnit),
                    cc.p(i - Global.platformData.maxProp2Balls / 2, 10), Global.util.generateColorStrip3(0), true, true);
            }

            this.isBtn1 = false;
            this.propBtnBg1.stopAllActions();
            this.propBtnBg1.active = false;
        } else {
            // 分享复活
            if (typeof FBInstant !== 'undefined') {
                ThirdAPI.shareGame(this.getImgBase64(), this.onBtn1ShareSuccess.bind(this), this.onBtn1ShareFailed.bind(this));
            } else if (typeof wx !== 'undefined') {
                ThirdAPI.shareGame(null, this.onBtn1ShareSuccess.bind(this), this.onBtn1ShareFailed.bind(this), '003');
            } else {
                this.onBtn1ShareSuccess();
            }
        }
    },

    onBtn1ShareSuccess1: function (openGId) {
        console.log('求助成功');

        if (!Global.shareOpen) {
            console.log('游戏版本无分享获得道具');
            return;
        }

        if (!openGId) {
            console.log('分享的不是群');
            Global.main.showDialogText('分享到群才能获得获得道具');
            return;
        }

        if (Global.gameinfo.shareData4.arrOpenGId.indexOf(openGId) != -1) {
            console.log('该群已经分享过', openGId);
            Global.main.showDialogText('该群本日已经分享过无法获得道具');
            return;
        } else {
            console.log('该群未分享过', openGId);
            Global.gameinfo.shareData4.arrOpenGId.push(openGId);
            ThirdAPI.saveInfo(Global.gameinfo);
        }

        this.isBtn1 = true;
        this.propBtnBg1.active = true;
        this.propBtnBg1.runAction(cc.repeatForever(cc.sequence(cc.fadeOut(0.5), cc.fadeIn(0.5))));
    },

    onBtn1ShareFailed1: function () {
        console.log('求助失败');
        console.log('1.分享取消，2.分享的不是群');

        if (!Global.shareOpen) {
            console.log('游戏版本无分享获得道具');
            return;
        }

        Global.main.showDialogText('分享到群才能获得获得道具');
    },

    onPropButton21: function () {
        console.log('点击道具2');
        Global.main.playTouchSound();

        if (this.isBtn2) {
            this.paddle.clearState();
            this.paddle.becomeWidth(Global.zoneSize.width);

            this.isBtn2 = false;
            this.propBtnBg2.stopAllActions();
            this.propBtnBg2.active = false;
        } else {
            // 分享复活
            if (typeof FBInstant !== 'undefined') {
                ThirdAPI.shareGame(this.getImgBase64(), this.onBtn2ShareSuccess.bind(this), this.onBtn2ShareFailed.bind(this));
            } else if (typeof wx !== 'undefined') {
                ThirdAPI.shareGame(null, this.onBtn2ShareSuccess.bind(this), this.onBtn2ShareFailed.bind(this), '003');
            } else {
                this.onBtn1ShareSuccess();
            }
        }
    },

    onBtn2ShareSuccess1: function (openGId) {
        console.log('求助成功');

        if (!Global.shareOpen) {
            console.log('游戏版本无分享获得道具');
            return;
        }

        if (!openGId) {
            console.log('分享的不是群');
            Global.main.showDialogText('分享到群才能获得获得道具');
            return;
        }

        if (Global.gameinfo.shareData4.arrOpenGId.indexOf(openGId) != -1) {
            console.log('该群已经分享过', openGId);
            Global.main.showDialogText('该群本日已经分享过无法获得道具');
            return;
        } else {
            console.log('该群未分享过', openGId);
            Global.gameinfo.shareData4.arrOpenGId.push(openGId);
            ThirdAPI.saveInfo(Global.gameinfo);
        }

        this.isBtn2 = true;
        this.propBtnBg2.active = true;
        this.propBtnBg2.runAction(cc.repeatForever(cc.sequence(cc.fadeOut(0.5), cc.fadeIn(0.5))));
    },

    onBtn2ShareFailed1: function () {
        console.log('求助失败');
        console.log('1.分享取消，2.分享的不是群');

        if (!Global.shareOpen) {
            console.log('游戏版本无分享获得道具');
            return;
        }

        Global.main.showDialogText('分享到群才能获得获得道具');
    },

    onPropButton31: function () {
        console.log('点击道具3');
        Global.main.playTouchSound();

        if (this.isBtn3) {
            this.isWudi = true;
            setTimeout(() => {
                this.isWudi = false;
            }, 10000);

            this.isBtn3 = false;
            this.propBtnBg3.stopAllActions();
            this.propBtnBg3.active = false;
        } else {
            // 分享复活
            if (typeof FBInstant !== 'undefined') {
                ThirdAPI.shareGame(this.getImgBase64(), this.onBtn3ShareSuccess.bind(this), this.onBtn3ShareFailed.bind(this));
            } else if (typeof wx !== 'undefined') {
                ThirdAPI.shareGame(null, this.onBtn3ShareSuccess.bind(this), this.onBtn3ShareFailed.bind(this), '003');
            } else {
                this.onBtn1ShareSuccess();
            }
        }
    },

    onBtn3ShareSuccess1: function (openGId) {
        console.log('求助成功');

        if (!Global.shareOpen) {
            console.log('游戏版本无分享获得道具');
            return;
        }

        if (!openGId) {
            console.log('分享的不是群');
            Global.main.showDialogText('分享到群才能获得获得道具');
            return;
        }

        if (Global.gameinfo.shareData4.arrOpenGId.indexOf(openGId) != -1) {
            console.log('该群已经分享过', openGId);
            Global.main.showDialogText('该群本日已经分享过无法获得道具');
            return;
        } else {
            console.log('该群未分享过', openGId);
            Global.gameinfo.shareData4.arrOpenGId.push(openGId);
            ThirdAPI.saveInfo(Global.gameinfo);
        }

        this.isBtn3 = true;
        this.propBtnBg3.active = true;
        this.propBtnBg3.runAction(cc.repeatForever(cc.sequence(cc.fadeOut(0.5), cc.fadeIn(0.5))));
    },

    onBtn3ShareFailed1: function () {
        console.log('求助失败');
        console.log('1.分享取消，2.分享的不是群');

        if (!Global.shareOpen) {
            console.log('游戏版本无分享获得道具');
            return;
        }

        Global.main.showDialogText('分享到群才能获得获得道具');
    },

    // 生成地图信息
    newMapInfo1: function (unit) {
        Global.mapInfo = [];
        Global.mapBricks = [];

        var row = Math.floor(Global.zoneSize.height / unit);
        var col = Math.floor(Global.zoneSize.width / unit);
        //console.log(row, col);
        for (var i = 0; i < row; i++) {
            if (!Global.mapInfo[i]) Global.mapInfo[i] = [];
            if (!Global.mapBricks[i]) Global.mapBricks[i] = [];

            for (var j = 0; j < col; j++) {
                Global.mapInfo[i][j] = 0; // 0 1
                Global.mapBricks[i][j] = null;
            }
        }
    },

    // 生成砖块
    newBricks1: function (n, bricksNoNew) {

        this.brickRowCount += n;
        console.log('砖块行数：', this.brickRowCount);

        bricksNoNew = ((this.brickRowCount % 15) > 9);
        console.log('不产生砖块：', bricksNoNew);

        var winSize = cc.director.getWinSize();
        this.newMapInfo(Global.brickUnit);

        let col = Global.brickCol;
        let row = n;

        let unit = Global.brickUnit;

        if (!Global.arrBrick) {
            Global.arrBrick = [];
        } else {
            for (var i = 0; i < Global.brickRow; i++) {
                for (var j = 0; j < col; j++) {
                    if (Global.arrBrick[i] && Global.arrBrick[i][j]) {
                        Global.arrBrick[i][j].setScale(1, 1);

                        Global.arrBrick[i][j].setPosition(Global.arrBrick[i][j].position.x, Global.arrBrick[i][j].position.y - Global.brickDistance * n);

                        if (Global.mapInfo[Math.floor((Global.zoneSize.height / 2 + Global.arrBrick[i][j].position.y) / unit)]) {
                            Global.mapInfo[Math.floor((Global.zoneSize.height / 2 + Global.arrBrick[i][j].position.y) / unit)][Math.floor((Global.zoneSize.width / 2 + Global.arrBrick[i][j].position.x) / unit)] = 1;
                        }
                        Global.mapBricks[Math.floor((Global.zoneSize.height / 2 + Global.arrBrick[i][j].position.y) / unit)][Math.floor((Global.zoneSize.width / 2 + Global.arrBrick[i][j].position.x) / unit)] = Global.arrBrick[i][j];

                        if (Global.arrBrick[i][j].position.y < 150 + this.warningTip.y) {
                            //console.log(Global.arrBrick[i][j].position.y);
                            if (Global.arrBrick[i][j].position.y < this.warningTip.y - 70) {
                                //Global.ball = null;
                                //console.log('游戏结束b', Global.ball);
                                Global.main.game.waitRevive();
                                return;
                            } else {
                                //console.log("warning");
                                // 显示
                                this.warningTip._sgNode.setVisible(true);
                                this.warningTip.runAction(cc.repeat(cc.sequence(cc.fadeIn(1), cc.fadeOut(1)), 3));
                            }
                        }
                    }
                }
            }
        }

        if (bricksNoNew) return;

        // 生成砖块
        let generateProp = false;
        let generatePropCol = 0;

        let propStep = 2;
        if (this.brickRowCount <= 50) {
            propStep = 2;
        } else if (this.brickRowCount > 50 && this.brickRowCount <= 100) {
            propStep = 3;
        } else if (this.brickRowCount > 100 && this.brickRowCount <= 150) {
            propStep = 4;
        } else if (this.brickRowCount > 150 && this.brickRowCount <= 200) {
            propStep = 5;
        } else if (this.brickRowCount > 200 && this.brickRowCount <= 250) {
            propStep = 6;
        } else if (this.brickRowCount > 250 && this.brickRowCount <= 300) {
            propStep = 7;
        }

        for (var i = 0; i < row; i++) {
            if (!Global.arrBrick[Global.brickRow + i]) {
                Global.arrBrick[Global.brickRow + i] = [];
            }

            if ((Global.brickRow + i) % propStep == 1) {
                generateProp = true;
                generatePropCol = Math.floor(cc.random0To1() * col);
            }

            for (var j = 0; j < col; j++) {
                // 使用给定的模板在场景中生成一个新节点
                var newBrick = null;
                if (this.brickPool.length > 0) {
                    newBrick = this.brickPool.pop();
                    //console.log("从对象池创建砖块");
                } else {
                    newBrick = cc.instantiate(this.brickPrefab);
                    this.node.addChild(newBrick);
                    //console.log("从Prefab创建砖块");
                }

                //this.node.addChild(newBrick);
                //newBrick.active = true;
                newBrick.setScale(1, 1);
                //newBrick.setContentSize(8,8);
                newBrick.setContentSize(Global.brickUnit * 0.8, Global.brickUnit * 0.8);
                newBrick.setPosition(cc.p(j * Global.brickDistance - Global.zoneSize.width / 2 + newBrick.width / 2, Global.zoneSize.height / 2 - (row - i - 1) * Global.brickDistance - Global.topEdge - newBrick.height / 2));
                Global.mapInfo[Math.floor((Global.zoneSize.height / 2 + newBrick.position.y) / unit)][Math.floor((Global.zoneSize.width / 2 + newBrick.position.x) / unit)] = 1;
                Global.mapBricks[Math.floor((Global.zoneSize.height / 2 + newBrick.position.y) / unit)][Math.floor((Global.zoneSize.width / 2 + newBrick.position.x) / unit)] = newBrick;
                //newBrick.color = Global.util.generateColorStrip(j/col);
                //newBrick.color = Global.util.generateColorStrip2(j/Global.brickCol, 1);
                newBrick.color = Global.util.generateColorStrip3(0);
                /*
                if (Global.colorArray && Global.colorArray[Global.colorIndex] && Global.colorArray[Global.colorIndex][j])
                {
                    newBrick.color = Global.colorArray[Global.colorIndex][j];
                }*/
                newBrick.i = i + Global.brickRow;
                newBrick.j = j;
                Global.arrBrick[newBrick.i][newBrick.j] = newBrick;

                // 道具
                if (generateProp && generatePropCol == j) {
                    var randPropNum = cc.random0To1() * 9;
                    //console.log('道具种类', randPropNum);
                    if (randPropNum >= 0 && randPropNum < this.prop1Chances) {
                        newBrick.getComponent("Brick").setProp(2);
                    } else if (randPropNum >= this.prop1Chances && randPropNum < this.prop1Chances + this.prop2Chances) {
                        newBrick.getComponent("Brick").setProp(3);
                    } else if (randPropNum >= this.prop1Chances + this.prop2Chances && randPropNum < this.prop1Chances + this.prop2Chances + this.prop3Chances) {
                        newBrick.getComponent("Brick").setProp(4);
                    }
                    //newBrick.getComponent("Brick").setProp(Math.floor(cc.rand() % 3 + 2));
                    newBrick.color = cc.color(255, 255, 255);
                    generateProp = false;
                }

                if (cc.random0To1() < 0.06) {
                    newBrick.getComponent("Brick").setStar();
                }

                //console.log(Global.arrBrick[Global.brickRow + i]);
            }

            Global.colorIndex++;
            if (Global.colorIndex >= Global.colorArray.length) {
                Global.colorIndex = 0;
            }

            //console.log(Global.arrBrick[Global.brickRow + i]);
        }

        Global.brickRow += n;
    },

    // 生成道具
    newProp1: function (n, pos) {
        let newProp = cc.instantiate(this.propPrefab);
        this.node.addChild(newProp);
        newProp.setContentSize(Global.brickUnit, Global.brickUnit);
        newProp.setPosition(pos);
        newProp.getComponent('Prop').setPropType(n);
        Global.arrProp.push(newProp.getComponent('Prop'));
    },

    // 生成小球
    newBalls1: function () {
        for (var i = 0; i < 1; i++) {
            let newBall = cc.instantiate(this.ballPrefab);
            this.balls.addChild(newBall);
            if (Global.skinBall) {
                newBall.getComponent(cc.Sprite).spriteFrame = Global.skinBall;
            }
            // 为星星设置一个随机位置
            newBall.setContentSize(Global.brickUnit * 0.8, Global.brickUnit * 0.8);
            newBall.setPosition(cc.p(Global.paddleX, Global.paddleY + Global.paddleHeight / 2 + newBall.height / 2 + 5));
            var vel_x = (cc.random0To1() > 0.5 ? -1 : 1) * (3 + 3 * cc.random0To1());

            var ball = newBall.getComponent('Ball');
            //ball.velocity = cc.p(vel_x, 3 + 1 * cc.random0To1());//(cc.p(-5, 6));
            //console.log(ball.velocity);
            //newBall.color = cc.color(255, 0, 0);
            // 将 Game 组件的实例传入小球组件
            ball.isRebound = true;
            ball.index = Global.arrBall.length;
            ball.x = newBall.position.x;
            ball.y = newBall.position.y;
            ball.width = newBall.width;
            ball.height = newBall.height;
            ball.initStreak(true, newBall.color);
            Global.arrBall.push(ball);
            Global.ball = ball;

            if (Global.platformData.isMotionStreak) {
                if (ball.motionNode == null) {
                    var newMotionStreak = new cc.Node('layer');
                    this.layer.addChild(newMotionStreak);
                    var ms = newMotionStreak.addComponent(cc.MotionStreak);
                    ball.motionNode = newMotionStreak;
                }

                ball.motionNode.getComponent(cc.MotionStreak).enabled = true;
                ball.motionNode.getComponent(cc.MotionStreak).reset();
                ball.motionNode.getComponent(cc.MotionStreak).texture = Global.main.textureBall1;
                if (Global.skinStreak) {
                    ball.motionNode.getComponent(cc.MotionStreak).texture = Global.skinStreak.getTexture();
                }

                ball.motionNode.getComponent(cc.MotionStreak).stroke = newBall.width; //8;
                ball.motionNode.getComponent(cc.MotionStreak).color = newBall.color;
                ball.motionNode.getComponent(cc.MotionStreak).fadeTime = 0.5;
            }
        }
        //Global.ball = newBall.getComponent('Ball');
    },

    // 根据位置、速度、颜色生成小球，第三种方法，对象池
    newBall1: function (pos, vel, color, isMotionStreak, isRebound) {
        let newBall = null;
        if (this.ballPool.length > 0) {
            newBall = this.ballPool.pop();
            //console.log("从对象池创建");
        } else {
            newBall = cc.instantiate(this.ballPrefab);
            this.balls.addChild(newBall);
            //console.log("从Prefab创建");
        }

        //this.balls.addChild(newBall);
        newBall.setContentSize(Global.brickUnit * 0.4, Global.brickUnit * 0.4);
        newBall.setPosition(pos);
        var ball = newBall.getComponent('Ball');
        ball.velocity = vel;
        newBall.color = cc.hexToColor(Global.util.lightenDarkenColor(cc.colorToHex(color), -50)); //color;
        ball.isRebound = isRebound;
        ball.index = Global.arrBall.length;
        ball.width = newBall.width;
        ball.height = newBall.height;
        ball.x = pos.x;
        ball.y = pos.y;
        //ball.isStreak = isMotionStreak;
        ball.initStreak(isMotionStreak, newBall.color);
        Global.arrBall.push(ball);

        /*
        if (isMotionStreak) {
            var ms = newBall.addComponent(cc.MotionStreak);
            ms.fadeTime = 0.5;
        }        

        
        if (newBall.getComponent(cc.MotionStreak)) {
            if (isMotionStreak) {
                newBall.getComponent(cc.MotionStreak).enabled = true;
            }
            else {
                newBall.getComponent(cc.MotionStreak).enabled = false;
            }

            if (!Global.motionStreakEnabled) {
                newBall.getComponent(cc.MotionStreak).enabled = false;
            }
            newBall.getComponent(cc.MotionStreak).reset();
            newBall.getComponent(cc.MotionStreak).texture = Global.main.textureBall1;
            newBall.getComponent(cc.MotionStreak).stroke = newBall.width;//8;
            newBall.getComponent(cc.MotionStreak).color = newBall.color;
        }
        */




        if (Global.platformData.isMotionStreak && isMotionStreak) {
            if (ball.motionNode == null) {
                var newMotionStreak = new cc.Node('layer');
                this.layer.addChild(newMotionStreak);
                var ms = newMotionStreak.addComponent(cc.MotionStreak);
                ball.motionNode = newMotionStreak;
            }

            ball.motionNode.getComponent(cc.MotionStreak).enabled = true;
            ball.motionNode.getComponent(cc.MotionStreak).reset();
            ball.motionNode.getComponent(cc.MotionStreak).texture = Global.main.textureBall1;
            ball.motionNode.getComponent(cc.MotionStreak).stroke = newBall.width; //8;
            ball.motionNode.getComponent(cc.MotionStreak).color = newBall.color;
            ball.motionNode.getComponent(cc.MotionStreak).fadeTime = Global.platformData.fadeTime;
            ball.motionNode.getComponent(cc.MotionStreak).fastMode = true;
            ball.motionNode.getComponent(cc.MotionStreak).minSeg = 3;
        } else {
            if (ball.motionNode != null) {
                ball.motionNode.removeComponent(cc.MotionStreak);
                ball.motionNode = null;
            }
        }


        //newBall.active = true;
        newBall.setScale(1, 1);
    },

    // 加入图片像素到颜色方案
    addImageToColorArray1: function (imagefile) {
        //console.log("addImageToColorArray");
        // 获取图片像素数据
        var arr1 = Global.main.getImageColorArray(imagefile);
        var colorRow = 0;
        var colorCol = 0;
        if (arr1.length) {
            colorRow = arr1.length;
            if (arr1[0].length) {
                colorCol = arr1[0].length;
            }
        }

        var imageRow = Math.floor(colorRow * Global.brickCol / colorCol);
        //console.log(colorRow, imageRow);
        if (colorCol) {
            for (var i = 0; i < imageRow; i++) {
                if (!Global.colorArray[i + Global.colorIndex]) {
                    Global.colorArray[i + Global.colorIndex] = [];
                }

                for (var j = 0; j < Global.brickCol; j++) {
                    //console.log((imageRow-i-1)*Math.floor(colorRow/imageRow),arr1.length, imageRow, colorRow, colorCol);
                    Global.colorArray[i + Global.colorIndex][j] = arr1[(imageRow - i - 1) * Math.floor(colorRow / imageRow)][j * Math.floor(colorCol / Global.brickCol)];
                }
            }
            Global.colorIndex += imageRow;
            //console.log(Global.colorIndex);
        }
    },

    // 加入颜色条带到颜色方案
    addStripToColorArray11: function (stripRow) {
        for (var i = 0; i < stripRow; i++) {
            if (!Global.colorArray[i + Global.colorIndex]) {
                Global.colorArray[i + Global.colorIndex] = [];
            }

            for (var j = 0; j < Global.brickCol; j++) {
                Global.colorArray[i + Global.colorIndex][j] = Global.util.generateColorStrip1(j / Global.brickCol);
            }
        }
        Global.colorIndex += stripRow;
        //console.log(Global.colorIndex);
    },

    // 加入颜色条带到颜色方案1
    addStripToColorArray11: function (stripRow, stripCol, n) {
        for (var i = 0; i < stripRow; i++) {
            if (!Global.colorArray[i + Global.colorIndex]) {
                Global.colorArray[i + Global.colorIndex] = [];
            }
        }

        var colorBrick;
        for (var i = 0; i < Global.brickCol; i++) {
            if (i % 4 == 0) {
                colorBrick = Global.util.generateColorStrip1(i / Global.brickCol, n);
            }

            for (var j = 0; j < stripRow; j++) {
                Global.colorArray[j + Global.colorIndex][i] = colorBrick;
            }
        }

        Global.colorIndex += stripRow;
        //console.log(Global.colorIndex);
    },

    // 生成颜色方案数组
    generateColorArray111: function () {
        Global.colorArray = [];
        Global.colorIndex = 0;

        //this.addImageToColorArray("resources/2.png");
        //this.addStripToColorArray(10);
        //this.addImageToColorArray("resources/4.jpg");
        //this.addStripToColorArray(10);
        this.addStripToColorArray1(4, 4, 1);
        this.addStripToColorArray1(4, 4, 2);
        this.addStripToColorArray1(4, 4, 3);
        this.addStripToColorArray1(4, 4, 4);
        this.addStripToColorArray1(4, 4, 5);
        this.addStripToColorArray1(4, 4, 6);
        this.addStripToColorArray1(4, 4, 7);
        this.addStripToColorArray1(4, 4, 8);
        //this.addImageToColorArray("resources/brickbg1.png");

        //console.log(Global.colorArray);
        Global.colorIndex = 0;
    },

    // 绘制点
    drawPoint1: function (x, y, color, size) {
        this.g.fillColor = color;
        this.g.circle(x, y, size);
        this.g.fill();
    },

    // 绘制直线
    drawLine1: function (pt1, pt2, color, size) {
        this.g.strokeColor = color;
        this.g.lineWidth = size;
        this.g.moveTo(pt1.x, pt1.y);
        this.g.lineTo(pt2.x, pt2.y);
    },

    // 绘制小球拖尾
    drawTail1: function () {
        this.g.clear();
        for (var x in Global.arrBall) {
            // 获取小球颜色
            var colorTail = Global.arrBall[x].node.color;
            let colorTailMinValue = colorTail.getR() < colorTail.getG() ? colorTail.getR() : (colorTail.getG() < colorTail.getB() ? colorTail.getG() : colorTail.getB());
            var colorTailHex = cc.colorToHex(colorTail);

            // 获取小球宽度，根据宽度算出20次减到0需要的步长
            var deltaSize = 0;
            if (Global.arrBall[x].arrPoint.length > 0) {
                deltaSize = Global.arrBall[x].node.width / 2 / Global.arrBall[x].arrPoint.length;
            }

            for (var i = 0; i < Global.arrBall[x].arrPoint.length; i++) {
                // 调整颜色亮度
                colorTailHex = Global.util.lightenDarkenColor(colorTailHex, -0.03 * colorTailMinValue);

                this.drawPoint(Global.arrBall[x].arrPoint[i].x, Global.arrBall[x].arrPoint[i].y,
                    cc.hexToColor(colorTailHex),
                    Global.arrBall[x].node.width / 2 - i * deltaSize);
                if (i + 1 < Global.arrBall[x].arrPoint.length) {

                    this.drawPoint((Global.arrBall[x].arrPoint[i].x + Global.arrBall[x].arrPoint[i + 1].x) / 2, (Global.arrBall[x].arrPoint[i].y + Global.arrBall[x].arrPoint[i + 1].y) / 2,
                        cc.hexToColor(colorTailHex),
                        Global.arrBall[x].node.width / 2 - i * deltaSize);
                }
            }
        }
    },

});