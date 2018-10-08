
wdfk = {};
wdfk.GlobalFunc = {};

//显示分享界面
wdfk.GlobalFunc.showShareWindow = function (self) {
    Global.LoadAtlas.loadPrefab('UIRoot', function(uiRootPrefab) {
        if (!Global.uiScript) {
            Global.uiScript = cc.instantiate(uiRootPrefab).getComponent("uiRoot");
        }
        //如果有父节点则删除自身节点
        if (Global.uiScript.node.parent) {
            Global.uiScript.node.parent.removeChild(Global.uiScript.node);
        }
        self.node.addChild(Global.uiScript.node);
        Global.uiScript.showShareWindow();
    });
};

//显示排行榜界面
wdfk.GlobalFunc.showRankWindow = function (self,canShowGameClub) {
    Global.LoadAtlas.loadPrefab('rankUI', function(rankPrefab) {
        if (!Global.rankui) {
            Global.rankui = cc.instantiate(rankPrefab).getComponent("rankUI");
        }
        if (Global.rankui.node.parent) {
            Global.rankui.node.parent.removeChild(Global.rankui.node);
        }
        self.node.addChild(Global.rankui.node);
        Global.rankui.initData(canShowGameClub);
    });
};

wdfk.GlobalFunc.showGroupRankWindow = function (self,canShowGameClub) {
    Global.LoadAtlas.loadPrefab('rankUI', function(rankPrefab) {
        if (!Global.rankui) {
            Global.rankui = cc.instantiate(rankPrefab).getComponent("rankUI");
        }
        if (Global.rankui.node.parent) {
            Global.rankui.node.parent.removeChild(Global.rankui.node);
        }
        self.node.addChild(Global.rankui.node);
        Global.rankui.initGetGroupRank(canShowGameClub);
    });
};

//显示商店界面
wdfk.GlobalFunc.showStoreWindow = function (self) {
    Global.LoadAtlas.loadPrefab('UIStore', function(storePrefab) {
        if (!Global.storeUI) {
            Global.storeUI = cc.instantiate(storePrefab).getComponent("UIStore");
        }
        if (Global.storeUI.node.parent) {
            Global.storeUI.node.parent.removeChild(Global.storeUI.node);
        }
        self.node.addChild(Global.storeUI.node);
        Global.storeUI.initData();
        //记载成功进入皮肤打点
        // var biManager = require('biManager');
        // biManager.bilog(biManager.skin, null);
    });
};

//显示复活界面
wdfk.GlobalFunc.showReviveWindow = function (self) {
    Global.LoadAtlas.loadPrefab('reviveUI', function(revivePrefab) {
        if (!Global.reviveUI) {
            Global.reviveUI = cc.instantiate(revivePrefab).getComponent("reviveUI");
        }
        if (Global.reviveUI.node.parent) {
            Global.reviveUI.node.parent.removeChild(Global.reviveUI.node);
        }
        self.node.addChild(Global.reviveUI.node);
        Global.reviveUI.initData();
    });
};

//显示成就界面
wdfk.GlobalFunc.showTitleWindow = function (self) {
    Global.LoadAtlas.loadPrefab('UITitle', function(titlePrefab) {
        if (!Global.titleUI) {
            Global.titleUI = cc.instantiate(titlePrefab).getComponent("UITitle");
        }
        if (Global.titleUI.node.parent) {
            Global.titleUI.node.parent.removeChild(Global.titleUI.node);
        }
        self.node.addChild(Global.titleUI.node);
        Global.titleUI.initData();
        if (Global.titleUI) {
            Global.titleUI.onClose();
        }
    });
};

//显示成就查看界面
wdfk.GlobalFunc.showTitleInfoWindow = function (self) {
    Global.LoadAtlas.loadPrefab('UITitleInfo', function(titleInfoPrefab) {
        if (!Global.titleInfoUI) {
            Global.titleInfoUI = cc.instantiate(titleInfoPrefab).getComponent("UITitleInfo");
        }
        if (Global.titleInfoUI.node.parent) {
            Global.titleInfoUI.node.parent.removeChild(Global.titleInfoUI.node);
        }
        self.node.addChild(Global.titleInfoUI.node);
        Global.titleInfoUI.initData();
    });
};

//弹出好友互助奖励界面
wdfk.GlobalFunc.showRewardWindow = function (self) {
    Global.LoadAtlas.loadPrefab('rewardInfo', function(rewardPrefab) {
        if (!Global.rewardUI) {
            Global.rewardUI = cc.instantiate(rewardPrefab).getComponent("rewardUI");
        }
        if (Global.rewardUI.node.parent) {
            Global.rewardUI.node.parent.removeChild(Global.rewardUI.node);
        }
        self.node.addChild(Global.rewardUI.node);
        Global.rewardUI.initData();
    });
};

//显示道具分享弹框
wdfk.GlobalFunc.showPropDialogWindow = function (self,isChest, showText, parmaIndex) {
    Global.LoadAtlas.loadPrefab('propInfo', function(propInfoPrefab) {
        if (!Global.propInfoUI) {
            Global.propInfoUI = cc.instantiate(propInfoPrefab).getComponent("UIPropInfo");
        }
        if (Global.propInfoUI.node.parent) {
            Global.propInfoUI.node.parent.removeChild(Global.propInfoUI.node);
        }
        self.node.addChild(Global.propInfoUI.node);
        Global.propInfoUI.initData(isChest, showText, parmaIndex);
    });
};

//显示道具数量不足，拉起分享界面
wdfk.GlobalFunc.showAddPropDialogWindow = function (self,parma) {
    Global.LoadAtlas.loadPrefab('addPropInfo', function(addPropInfoPrefab) {
        if (!Global.addPropInfoUI) {
            Global.addPropInfoUI = cc.instantiate(addPropInfoPrefab).getComponent("addPropInfo");
        }
        if (Global.addPropInfoUI.node.parent) {
            Global.addPropInfoUI.node.parent.removeChild(Global.addPropInfoUI.node);
        }
        self.node.addChild(Global.addPropInfoUI.node);
        Global.addPropInfoUI.initData(parma);
    });
};