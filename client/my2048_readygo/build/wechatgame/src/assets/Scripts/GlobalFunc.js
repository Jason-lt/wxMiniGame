wdfk={GlobalFunc:{}},wdfk.GlobalFunc.showShareWindow=function(l){Global.LoadAtlas.loadPrefab("UIRoot",function(o){Global.uiScript||(Global.uiScript=cc.instantiate(o).getComponent("uiRoot")),Global.uiScript.node.parent&&Global.uiScript.node.parent.removeChild(Global.uiScript.node),l.node.addChild(Global.uiScript.node),Global.uiScript.showShareWindow()})},wdfk.GlobalFunc.showRankWindow=function(l,a){Global.LoadAtlas.loadPrefab("rankUI",function(o){Global.rankui||(Global.rankui=cc.instantiate(o).getComponent("rankUI")),Global.rankui.node.parent&&Global.rankui.node.parent.removeChild(Global.rankui.node),l.node.addChild(Global.rankui.node),Global.rankui.initData(a)})},wdfk.GlobalFunc.showGroupRankWindow=function(l,a){Global.LoadAtlas.loadPrefab("rankUI",function(o){Global.rankui||(Global.rankui=cc.instantiate(o).getComponent("rankUI")),Global.rankui.node.parent&&Global.rankui.node.parent.removeChild(Global.rankui.node),l.node.addChild(Global.rankui.node),Global.rankui.initGetGroupRank(a)})},wdfk.GlobalFunc.showStoreWindow=function(l){Global.LoadAtlas.loadPrefab("UIStore",function(o){Global.storeUI||(Global.storeUI=cc.instantiate(o).getComponent("UIStore")),Global.storeUI.node.parent&&Global.storeUI.node.parent.removeChild(Global.storeUI.node),l.node.addChild(Global.storeUI.node),Global.storeUI.initData()})},wdfk.GlobalFunc.showReviveWindow=function(l){Global.LoadAtlas.loadPrefab("reviveUI",function(o){Global.reviveUI||(Global.reviveUI=cc.instantiate(o).getComponent("reviveUI")),Global.reviveUI.node.parent&&Global.reviveUI.node.parent.removeChild(Global.reviveUI.node),l.node.addChild(Global.reviveUI.node),Global.reviveUI.initData()})},wdfk.GlobalFunc.showTitleWindow=function(l){Global.LoadAtlas.loadPrefab("UITitle",function(o){Global.titleUI||(Global.titleUI=cc.instantiate(o).getComponent("UITitle")),Global.titleUI.node.parent&&Global.titleUI.node.parent.removeChild(Global.titleUI.node),l.node.addChild(Global.titleUI.node),Global.titleUI.initData(),Global.titleUI&&Global.titleUI.onClose()})},wdfk.GlobalFunc.showTitleInfoWindow=function(l){Global.LoadAtlas.loadPrefab("UITitleInfo",function(o){Global.titleInfoUI||(Global.titleInfoUI=cc.instantiate(o).getComponent("UITitleInfo")),Global.titleInfoUI.node.parent&&Global.titleInfoUI.node.parent.removeChild(Global.titleInfoUI.node),l.node.addChild(Global.titleInfoUI.node),Global.titleInfoUI.initData()})},wdfk.GlobalFunc.showRewardWindow=function(l){Global.LoadAtlas.loadPrefab("rewardInfo",function(o){Global.rewardUI||(Global.rewardUI=cc.instantiate(o).getComponent("rewardUI")),Global.rewardUI.node.parent&&Global.rewardUI.node.parent.removeChild(Global.rewardUI.node),l.node.addChild(Global.rewardUI.node),Global.rewardUI.initData()})},wdfk.GlobalFunc.showPropDialogWindow=function(l,a,n,e){Global.LoadAtlas.loadPrefab("propInfo",function(o){Global.propInfoUI||(Global.propInfoUI=cc.instantiate(o).getComponent("UIPropInfo")),Global.propInfoUI.node.parent&&Global.propInfoUI.node.parent.removeChild(Global.propInfoUI.node),l.node.addChild(Global.propInfoUI.node),Global.propInfoUI.initData(a,n,e)})},wdfk.GlobalFunc.showAddPropDialogWindow=function(l,a){Global.LoadAtlas.loadPrefab("addPropInfo",function(o){Global.addPropInfoUI||(Global.addPropInfoUI=cc.instantiate(o).getComponent("addPropInfo")),Global.addPropInfoUI.node.parent&&Global.addPropInfoUI.node.parent.removeChild(Global.addPropInfoUI.node),l.node.addChild(Global.addPropInfoUI.node),Global.addPropInfoUI.initData(a)})};