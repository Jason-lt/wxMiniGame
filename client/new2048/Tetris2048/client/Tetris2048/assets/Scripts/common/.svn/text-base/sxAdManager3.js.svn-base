//三消交叉导流
ctr.sxAdmanager3 = {
    sxAdInfo: null,
    isLoadConfig: false,
    adIcons: [],
    content: null,
    cellwidth: 0,
    cellheight: 0,
    isPull: false,
    mask: null,
    pullSp1: null,
    pullSp2: null,

    show: function () {//, scale) {
        Global.Ad = this;
        try {
            if (this.adIcon) {
                this.adIcon.active = true;
                // if (this.adIcons.length > this.sxAdInfo.viewAdCounts) {
                //     var _act = cc.moveBy(this.sxAdInfo.framesInterval, -cc.winSize.width, 0);
                //     this.content.runAction(cc.repeatForever(_act));
                //     cc.director.getScheduler().schedule(this.callback, this.content, 0, false);
                // }
            } else {
                var callback = () => {
                    if (this.sxAdInfo.switch == 1) {
                        this.adIcon = new cc.Node();
                        this.mask = new cc.Node('mask');

                        this.lastTime = new Date((new Date()).toDateString());
                        let storedata = cc.sys.localStorage.getItem("sxadtime");
                        if (storedata && storedata !== '') {
                            var savedTime = JSON.parse(storedata);
                            if (savedTime.lastTime && (new Date(savedTime.lastTime)).getTime() > this.lastTime.getTime()) {
                                let data = cc.sys.localStorage.getItem("sxad-data");
                                data = '';
                                cc.sys.localStorage.setItem("sxad-data", data);
                            }
                        }
                        var saveData = {
                            lastTime: this.lastTime,
                        };
                        cc.sys.localStorage.setItem("sxadtime", JSON.stringify(saveData));

                        // if (typeof wx !== 'undefined') {

                        this.setAd();

                        cc.game.addPersistRootNode(this.mask);
                        this.mask.addComponent(cc.Button);
                        this.mask.on('click', this.onClickPullBtn, this);

                        cc.game.addPersistRootNode(this.adIcon);
                        this.adIcon.addComponent(cc.Button);
                        this.adIcon.on('click', () => { }, this);

                        // }

                    }
                };
                this.loadConfigFile(callback);
            }
        } catch (error) {
            console.log("sxAdManager3: ", error);

        }
    },

    setAd: function () {

        // //遮罩
        // var view = new cc.Node('view');
        // this.adIcon.addChild(view);
        // view.addComponent(cc.Mask);//.type = cc.Mask.Type.RECT;
        // var scrollview = view.addComponent(cc.ScrollView);

        var content = new cc.Node('content');
        content.anchorX = 0;

        this.content = content;
        this.adIcon.addChild(content);

        var layout = content.addComponent(cc.Layout);
        layout.type = cc.Layout.Type.GRID;
        layout.resizeMode = cc.Layout.ResizeMode.CHILDREN;
        layout.startAxis = cc.Layout.AxisDirection.HORIZONTAL;
        layout.paddingTop = 50;
        // layout.paddingBottom = 5;
        layout.paddingLeft = this.sxAdInfo.grid.paddingLeft;
        layout.paddingRight = this.sxAdInfo.grid.paddingRight;
        layout.spacingX = this.sxAdInfo.grid.spacingX;
        layout.spacingY = this.sxAdInfo.grid.spacingY;

        // var cellwidth = this.sxAdInfo.grid.iconsWidth;// (cc.winSize.width * this.sxAdInfo.bg.width - layout.paddingLeft - layout.paddingRight + layout.spacingX)
        // // / this.sxAdInfo.viewAdCounts - layout.spacingX;
        // var cellheight = this.sxAdInfo.iconsHeight;
        this.cellwidth = this.sxAdInfo.grid.iconsWidth;
        this.cellheight = this.sxAdInfo.grid.iconsHeight;
        layout.cellSize = cc.size(this.sxAdInfo.grid.iconsWidth, this.sxAdInfo.grid.iconsHeight);
        // console.log(cellwidth * 178 / 147);
        this.adIcon.anchorX = 0;
        this.adIcon.width = (this.cellwidth + this.sxAdInfo.grid.spacingX) * this.sxAdInfo.viewAdCounts - this.sxAdInfo.grid.spacingX
            + this.sxAdInfo.grid.paddingLeft + this.sxAdInfo.grid.paddingRight;
        this.adIcon.height = this.sxAdInfo.bg.bottomBlkHeight + Math.ceil(this.sxAdInfo.icons.length / this.sxAdInfo.viewAdCounts) *
            (this.sxAdInfo.grid.iconsHeight+ this.sxAdInfo.grid.spacingY)+ this.sxAdInfo.label.height*this.sxAdInfo.label.scale/2+ this.sxAdInfo.label.yfromtop;
        if (this.sxAdInfo.fromWhere == 0) {
            this.adIcon.x = -this.adIcon.width;
        }
        else if (this.sxAdInfo.fromWhere == 1) {
            this.adIcon.x = cc.winSize.width;
        }
        this.adIcon.y = cc.winSize.height / 2;

        content.anchorX = 0;
        content.width = this.adIcon.width;
        content.height = this.adIcon.height;


        let self = this;

        //加载红点
        cc.loader.load({ url: this.sxAdInfo.reddot }, function (err, texture) {
            if (!err) {
                self.redTex = texture;
            }
            else {
            }
        });
        // 加载黑色遮罩
        cc.loader.load({ url: this.sxAdInfo.mask }, function (err, texture) {
            if (!err) {
                self.mask.addComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                self.mask.width = cc.winSize.width;
                self.mask.height = cc.winSize.height;
                self.mask.x = cc.winSize.width / 2;
                self.mask.y = cc.winSize.height / 2;
                self.mask.active = false;
            }
            else {
            }
        });
        // 创建背景
        cc.loader.load({ url: this.sxAdInfo.bg.imgurl }, function (err, texture) {
            if (!err) {
                self.adIcon.addComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                self.adIcon.width = (self.cellwidth + self.sxAdInfo.grid.spacingX) * self.sxAdInfo.viewAdCounts - self.sxAdInfo.grid.spacingX
                    + self.sxAdInfo.grid.paddingLeft + self.sxAdInfo.grid.paddingRight;
                self.adIcon.height = self.sxAdInfo.bg.bottomBlkHeight + Math.ceil(self.sxAdInfo.icons.length / self.sxAdInfo.viewAdCounts) *
                    (self.sxAdInfo.grid.iconsHeight + self.sxAdInfo.grid.spacingY)+ self.sxAdInfo.label.height*self.sxAdInfo.label.scale/2+ self.sxAdInfo.label.yfromtop;
            }
            else {
            }
        });
        // 添加"更多游戏"字样
        cc.loader.load({ url: this.sxAdInfo.label.imgurl }, function (err, texture) {
            if (!err) {
                var node = new cc.Node('label');
                node.addComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                node.scale = self.sxAdInfo.label.scale;
                node.x = self.adIcon.width / 2;
                node.y = self.adIcon.height / 2 - self.sxAdInfo.label.yfromtop;
                self.adIcon.addChild(node);
                content.y -= node.height;
            }
            else {
            }
        });
        // 添加侧拉按钮
        cc.loader.load({ url: this.sxAdInfo.pull.imgurl0 }, function (err, texture) {
            if (!err) {
                var node = new cc.Node('button');
                self.pullSp1 = new cc.SpriteFrame(texture);
                node.addComponent(cc.Sprite).spriteFrame = self.pullSp1;
                node.anchorX = 0;
                if (self.sxAdInfo.fromWhere == 0) {
                    node.scale = self.sxAdInfo.pull.scale;
                    node.x = self.adIcon.width - self.sxAdInfo.pull.positionX;
                } else if (self.sxAdInfo.fromWhere == 1) {
                    node.scale = -self.sxAdInfo.pull.scale;
                    node.x = self.sxAdInfo.pull.positionX;
                }

                var reddot = new cc.Node('reddot');
                reddot.addComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(self.redTex);
                node.addChild(reddot);
                reddot.x = node.width * 0.8;
                reddot.y = (node.height / 2) * 0.8;
                if (self.sxAdInfo.pull.isredon == 0 || self.isClick(0))
                    reddot.active = false;

                node.y = self.sxAdInfo.pull.positionY * self.adIcon.height - self.adIcon.height / 2;
                self.adIcon.addChild(node);
                node.addComponent(cc.Button);
                node.on('click', self.onClickPullBtn, self);
            }
            else {
            }
        });
        // 添加侧拉按钮图2
        cc.loader.load({ url: this.sxAdInfo.pull.imgurl1 }, function (err, texture) {
            if (!err) {
                self.pullSp2 = new cc.SpriteFrame(texture);
            }
            else {
            }
        });


        this.loadAllAd();
        //添加item
        for (let i = 0; i < this.adIcons.length; i++) {
            var index;
            for (let j = 0; j < this.adIcons.length; j++) {
                if (this.sxAdInfo.icons[j].index == i) {
                    index = j;
                    break;
                }
            }

            content.addChild(this.adIcons[index]);
            this.adIcons[index].addComponent(cc.Button);
            this.adIcons[i].on('click', () => {
                this.onClickAdIconBtn(i)
        }, this);
        }

    },

    hide: function () {
        if (this.adIcon) {
            // if (this.callback) {
            //     cc.director.getScheduler().unschedule(this.callback, this.content);
            //     this.content.stopAllActions();
            // }
            this.adIcon.active = false;
        }

    },

    loadAllAd: function () {

        var callback = (i, newAd) => {
            var text = new cc.Node('text');
            text.y = -this.sxAdInfo.text.yfromIcon;
            // console.log(this.content.getComponent(cc.Layout).spacingY, newAd.height);
            var label = text.addComponent(cc.Label);
            label.string = this.sxAdInfo.icons[i].text;
            text.color = new cc.Color(this.sxAdInfo.text.color[0], this.sxAdInfo.text.color[1], this.sxAdInfo.text.color[2]);
            label.fontSize = this.sxAdInfo.text.size;
            newAd.addChild(text);

            var reddot = new cc.Node('reddot');
            reddot.addComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.redTex);
            newAd.addChild(reddot);
            reddot.x = (this.cellwidth / 2) * 0.8;
            // console.log(this.cellwidth);
            // console.log(newAd.width,newAd.height);
            reddot.y = (this.cellheight / 2) * 0.8;
            if (this.sxAdInfo.icons[i].isredon == 0 || this.isClick(i + 1))
                reddot.active = false;

        };
        for (let i = 0; i < this.sxAdInfo.icons.length; i++) {

            var newAd = new cc.Node();
            if (this.sxAdInfo.icons[i].type == 0) {
                if (newAd.getComponent(cc.Animation)) {//除去动态icon的组件
                    newAd.removeComponent(cc.Animation);
                    newAd.removeComponent(cc.Sprite);
                }
                this.loadStaticImg(this.sxAdInfo.icons[i], newAd, i, callback);
            } else if (this.sxAdInfo.icons[i].type == 1) {
                if (newAd.getComponent(cc.Sprite)) {//除去静态icon的组件
                    newAd.getComponent(cc.Sprite).spriteFrame = null;
                }
                this.loadDynamicImg(this.sxAdInfo.icons[i], newAd, i, callback);
            }

            this.adIcons.push(newAd);
        }
    },

    loadConfigFile: function (callback) {
        try {
            let self = this;
            let xhr = cc.loader.getXMLHttpRequest();
            var timedOut = false;
            var timer = setTimeout(function () {
                timedOut = true;
                xhr.abort();
            }, 3000);
            xhr.open("GET", "https://sanxqn.nalrer.cn/tysanxiao/new2048/configMenuDaoLiu2.json", true);
            xhr.onreadystatechange = function () {
                if (timedOut) {
                    return;
                }

                clearTimeout(timer);
                if (xhr.readyState === 4) {
                    if ((xhr.status >= 200 && xhr.status < 300)) {
                        self.isLoadConfig = true;
                        try {
                            let ret = JSON.parse(xhr.responseText);

                            // 游戏开关
                            self.sxAdInfo = ret;
                            // ctr.sxAdmanager.refreshIconsWeight();
                            callback();

                            //Global.Gameversion = true;
                        } catch (e) {
                            // if (param) {
                            // self.loadIp();
                            // }
                            self.retryConfigFile();
                        }
                    } else {
                        // if (param) {
                        //     self.loadIp();
                        // }
                        self.retryConfigFile();
                    }
                }
                // self.loadIp();
            };

            xhr.onerror = function () {
                clearTimeout(timer);
                // if (param) {
                //     // self.loadIp();
                //     self.retryConfigFile();
                // }
            };

            xhr.send();
        } catch (error) {
            // if (param) {
            //     // self.loadIp();
            //     self.retryConfigFile();
            // }
            console.log(' get config error', error);
        }
    },
    retryConfigFile: function () {
        if (!this.isLoadConfig) {
            setTimeout(() => {
                this.loadConfigFile(false);
        }, 20000);
        }
    },

    //添加导流入口Icon静态图片
    loadStaticImg: function (arr, adNode, i, callback) {
        let link = arr.imgLink;
        let scale = arr.scale;
        let self = this;
        cc.loader.load(link, function (err, tex) {
            try {
                if (adNode.getComponent(cc.Sprite)) {//重新调用时可能是同一个静态icon也可能适另一个静态icon
                    adNode.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(tex);
                }
                else {
                    adNode.addComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(tex);
                }

                setTimeout(() => { callback(i, adNode) }, 100);
            } catch (err) {
                console.log(err);
                adNode.addComponent(cc.Sprite).spriteFrame = null;
            }
        });
    },

    //添加导流入口Icon动画
    loadDynamicImg: function (arr, adNode, i, callback) {
        let link = arr.imgLink.split(',');
        // let scale = arr.scale;
        let self = this;
        var adIconFrames = [];
        var playFrames = () => {


            if (adNode.getComponent(cc.Animation)) {//重新调用时可能是同一个动态icon也可能适另一个动态icon

                var animation = adNode.getComponent(cc.Animation);

                var clip = cc.AnimationClip.createWithSpriteFrames(adIconFrames, 10);
                clip.name = 'anim_frame';
                clip.wrapMode = cc.WrapMode.Loop;
                animation.addClip(clip);
                animation.play('anim_frame');
            }
            else {
                var animation = adNode.addComponent(cc.Animation);
                if (!adNode.getComponent(cc.Sprite))
                    adNode.addComponent(cc.Sprite);

                var clip = cc.AnimationClip.createWithSpriteFrames(adIconFrames, 10);
                clip.name = 'anim_frame';
                clip.wrapMode = cc.WrapMode.Loop;
                animation.addClip(clip);
                animation.play('anim_frame');
            }
            setTimeout(() => { callback(i, adNode) }, 100);
        };
        cc.loader.load(link, function (err, results) {
                // if (err) {
                //     for (var i = 0; i < err.length; i++) {
                //         console.log("sxAdManager: ", 'load Dynamic img failed' + err[i] + ']: ' + results.getError(err[i]));
                //     }
                // }
                // else {
                try {
                    adIconFrames.splice(0, adIconFrames.length);

                    for (let i = 0; i < link.length; i++) {
                        var tex = results.getContent(link[i]);
                        adIconFrames.push(new cc.SpriteFrame(tex));
                    }

                    playFrames();
                } catch (err) {
                    console.log(err);
                    adIconFrames.push(null);
                }
            }
        );
    },

    onClickPullBtn: function () {
        if (!this.isPull) {
            if (this.adIcon.getChildByName('button').getChildByName('reddot').active) {
                this.adIcon.getChildByName('button').getChildByName('reddot').active = false;
                this.save(0);
            }
            var cb = () => { this.mask.active = true };
            if (this.sxAdInfo.fromWhere == 0) {
                var _act = cc.moveBy(0.3, this.adIcon.width, 0);
            } else if (this.sxAdInfo.fromWhere == 1) {
                var _act = cc.moveBy(0.3, -this.adIcon.width, 0);
            }
            this.adIcon.runAction(cc.sequence(_act, cc.callFunc(cb)));
            this.isPull = true;
            this.adIcon.getChildByName('button').getComponent(cc.Sprite).spriteFrame = this.pullSp2;

            if (Global.gridController) {
                this.gridControllerScript = Global.gridController.getComponent("gridController");
                if (!Global.isPaused) {
                    this.gridControllerScript.onPauseGameForOther();
                }
            }
        } else {
            var cb = () => { this.mask.active = false };
            if (this.sxAdInfo.fromWhere == 0) {
                var _act = cc.moveBy(0.3, -this.adIcon.width, 0);
            } else if (this.sxAdInfo.fromWhere == 1) {
                var _act = cc.moveBy(0.3, this.adIcon.width, 0);
            }
            this.adIcon.runAction(cc.sequence(cc.callFunc(cb), _act));
            this.isPull = false;
            this.adIcon.getChildByName('button').getComponent(cc.Sprite).spriteFrame = this.pullSp1;

            if (Global.gridController) {
                this.gridControllerScript = Global.gridController.getComponent("gridController");
                if (Global.isPaused) {
                    this.gridControllerScript.onPauseGameForOther();
                }
            }
        }
    },

    onClickAdIconBtn: function (index) {

        if (typeof wx !== 'undefined') {
            try {
                if (index != -1) {
                    if (this.sxAdInfo.icons[index].openType == 0) {
                        wx.previewImage({
                                // current: ''; // 当前要显示的图片url
                                urls: [this.sxAdInfo.icons[index].openUrl], // 需要预览的图片url列表
                                success: (res) => {
                            },
                            fail: (res) => {
                        },
                        // complete: () => {

                        // }
                    });
                    }
                    else if (this.sxAdInfo.icons[index].openType == 1) {
                        var bi_paramlist = this.sxAdInfo.icons[index].biparam;
                        tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeClickAdBtn, bi_paramlist);
                        wx.navigateToMiniProgram({
                            appId: this.sxAdInfo.icons[index].openUrl,
                            path: this.sxAdInfo.icons[index].topath,
                            envVersion: 'release',
                            extraData: null,
                            success: function (res) {
                                ctr.sxAdmanager3.save(index + 1);
                                ctr.sxAdmanager3.adIcons[index].getChildByName('reddot').active = false;
                                tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeClickDirectToMiniGameSuccess, bi_paramlist);
                            },
                            fail: function (res) {
                                tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeClickDirectToMiniGameFail, bi_paramlist);
                                console.log('wx.navigateToMiniProgram fail');
                                console.log(res);
                            },
                            complete: function (res) {
                                console.log('navigateToMiniProgram ==== complete');
                            }
                        });
                    }

                }

            } catch (error) {
                console.log("sxAdManager: ", error);
            }
        }
    },
    //当前reddot是否被点击过
    isClick: function (index) {
        let storedata = cc.sys.localStorage.getItem("sxad-data");
        if (storedata && storedata !== '' && storedata.indexOf('i' + index + 'i') >= 0) {
            return true;
        }
        return false;
    },

    //reddot点击，保存index到本地,0是侧拉按钮，其余都是item，从1～n
    save: function (index) {
        let storedata = cc.sys.localStorage.getItem("sxad-data");
        if (storedata && storedata !== '') {
            storedata += 'i' + index + 'i' + ',';
        } else {
            storedata = 'i' + index + 'i' + ',';
        }
        cc.sys.localStorage.setItem("sxad-data", storedata);
    }
}