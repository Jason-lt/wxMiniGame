import gamesdk from '../lib_gamesdk/gamesdk';
import EChannelPrefix from '../lib_gamesdk/lib/EChannelPrefix';


let ctx = canvas.getContext('2d')
const screenWidth = window.innerWidth
const screenHeight = window.innerHeight

/**
 * 游戏主函数
 */

export default class Main {
  constructor() {
    this.authorizeBtn = '';
    this.creataLoginBtn()
    this.creataGameBtn()
    this.createSetBtn();
    this.createGetbtn();
    this.initiativeShare();
    this.createPayBtn();
    this.createMapBtn();
    this.createGoldBtn();
    this.pollingGoldBtn();
    this.createCheckMapBtn();
    this.createGoldTextBtn();
    this.createGiftBtn();
    this.createGetJL();
    this.createBannerOpenBtn();
    this.createMysteryBtn();
    this.createGetGiftBtn();
    console.log(wx.getLaunchOptionsSync())
    wx.onShow(info => {
      console.log(info);
      this.info = info
    })
  }

  createGetGiftBtn()
  {
    this.getGiftArea = {
      startX: screenWidth / 2 + 65,
      startY: screenHeight / 2 - 180,
      endX: screenWidth / 2 + 165,
      endY: screenHeight / 2 - 130
    }
    ctx.fillStyle = '#ffb000';
    let width = Math.abs(this.getGiftArea.endX - this.getGiftArea.startX)
    let height = Math.abs(this.getGiftArea.endY - this.getGiftArea.startY)
    ctx.fillRect(this.getGiftArea.startX, this.getGiftArea.startY, width, height)
    ctx.fillStyle = "#ffffff"
    ctx.font = "20px Arial"
    ctx.fillText(
      '获取礼包',
      this.getGiftArea.startX + 10,
      this.getGiftArea.startY + 30
    )
    this.getGiftHandler = this.getGiftEvent.bind(this)
    canvas.addEventListener('touchstart', this.getGiftHandler)
  }

  createMysteryBtn()
  {
    this.mysteryArea = {
      startX: screenWidth / 2 + 65,
      startY: screenHeight / 2 - 250,
      endX: screenWidth / 2 + 165,
      endY: screenHeight / 2 - 200
    }
    ctx.fillStyle = '#ffb000';
    let width = Math.abs(this.mysteryArea.endX - this.mysteryArea.startX)
    let height = Math.abs(this.mysteryArea.endY - this.mysteryArea.startY)
    ctx.fillRect(this.mysteryArea.startX, this.mysteryArea.startY, width, height)
    ctx.fillStyle = "#ffffff"
    ctx.font = "20px Arial"
    ctx.fillText(
      '神秘礼包',
      this.mysteryArea.startX + 10,
      this.mysteryArea.startY + 30
    )
    this.mysteryHandler = this.mysteryEvent.bind(this)
    canvas.addEventListener('touchstart', this.mysteryHandler)
  }

  createBannerOpenBtn()
  {
    this.openBtnArea = {
      startX: screenWidth / 2 - 160,
      startY: screenHeight / 2 + 210,
      endX: screenWidth / 2 - 60,
      endY: screenHeight / 2 + 260
    }
    ctx.fillStyle = '#642100';
    let width = Math.abs(this.openBtnArea.endX - this.openBtnArea.startX)
    let height = Math.abs(this.openBtnArea.endY - this.openBtnArea.startY)
    ctx.fillRect(this.openBtnArea.startX, this.openBtnArea.startY, width, height)
    ctx.fillStyle = "#ffffff"
    ctx.font = "20px Arial"
    ctx.fillText(
      '广告开关',
      this.openBtnArea.startX + 10,
      this.openBtnArea.startY + 30
    )

    this.opHandle = this.bannerOpenEvent.bind(this)
    canvas.addEventListener('touchstart', this.opHandle)
  }

  createGetJL()
  {
    this.jlArea = {
      startX: screenWidth / 2 - 160,
      startY: screenHeight / 2 + 140,
      endX: screenWidth / 2 - 60,
      endY: screenHeight / 2 + 190
    }
    ctx.fillStyle = '#642100';
    let width = Math.abs(this.jlArea.endX - this.jlArea.startX)
    let height = Math.abs(this.jlArea.endY - this.jlArea.startY)
    ctx.fillRect(this.jlArea.startX, this.jlArea.startY, width, height)
    ctx.fillStyle = "#ffffff"
    ctx.font = "20px Arial"
    ctx.fillText(
      '领取奖励',
      this.jlArea.startX + 10,
      this.jlArea.startY + 30
    )

    this.jlHandler = this.rewardEvent.bind(this)
    canvas.addEventListener('touchstart', this.jlHandler)
  }

  bannerOpenEvent(e)
  {
    e.preventDefault()
    let x = e.touches[0].clientX
    let y = e.touches[0].clientY
    let area = this.openBtnArea;
    if (x >= area.startX
      && x <= area.endX
      && y >= area.startY
      && y <= area.endY) {
        console.log('openBtn')
        gamesdk.game.checkBannerSwitch(res=>{
          console.log(res);
        },err=>{
          console.log(err);
        })
      }
  }

  pollingGoldBtn()
  {
    this.pgArea = {
      startX: screenWidth / 2 - 160,
      startY: screenHeight / 2 - 100,
      endX: screenWidth / 2 - 60,
      endY: screenHeight / 2 - 50
    }
    ctx.fillStyle = '#ff2d2d';
    let width = Math.abs(this.pgArea.endX - this.pgArea.startX)
    let height = Math.abs(this.pgArea.endY - this.pgArea.startY)
    ctx.fillRect(this.pgArea.startX, this.pgArea.startY, width, height)
    ctx.fillStyle = "#ffffff"
    ctx.font = "20px Arial"
    ctx.fillText(
      '查询金币',
      this.pgArea.startX + 10,
      this.pgArea.startY + 30
    )
    this.pollingGoldHandler = this.pollingGold.bind(this)
    canvas.addEventListener('touchstart', this.pollingGoldHandler)
  }

  createCheckMapBtn(){
    this.checkMapArea = {
      startX: screenWidth / 2 - 160,
      startY: screenHeight / 2 - 250,
      endX: screenWidth / 2 - 60,
      endY: screenHeight / 2 - 200
    }
    ctx.fillStyle = '#ff00ff';
    let width = Math.abs(this.checkMapArea.endX - this.checkMapArea.startX)
    let height = Math.abs(this.checkMapArea.endY - this.checkMapArea.startY)
    ctx.fillRect(this.checkMapArea.startX, this.checkMapArea.startY, width, height)
    ctx.fillStyle = "#ffffff"
    ctx.font = "20px Arial"
    ctx.fillText(
      '检查关联',
      this.checkMapArea.startX + 10,
      this.checkMapArea.startY + 30
    )
    this.checkMapPf = this.checkMapPlatForm.bind(this)
    canvas.addEventListener('touchstart', this.checkMapPf)
  }

  createGoldBtn(){
    this.goldArea = {
      startX: screenWidth / 2 - 160,
      startY: screenHeight / 2 - 180,
      endX: screenWidth / 2 - 60,
      endY: screenHeight / 2 - 130
    }
    ctx.fillStyle = '#00ffff';
    let width = Math.abs(this.goldArea.endX - this.goldArea.startX)
    let height = Math.abs(this.goldArea.endY - this.goldArea.startY)
    ctx.fillRect(this.goldArea.startX, this.goldArea.startY, width, height)
    ctx.fillStyle = "#ffffff"
    ctx.font = "20px Arial"
    ctx.fillText(
      '改变金币',
      this.goldArea.startX + 10,
      this.goldArea.startY + 30
    )
    this.changeGoldHandler = this.changeGold.bind(this)
    canvas.addEventListener('touchstart', this.changeGoldHandler)
  }

   createMapBtn() {
    this.mapArea = {
      startX: screenWidth / 2 - 40,
      startY: screenHeight / 2 - 250,
      endX: screenWidth / 2 + 60,
      endY: screenHeight / 2 - 200
    }
    ctx.fillStyle = '#808040';
    let width = Math.abs(this.mapArea.endX - this.mapArea.startX)
    let height = Math.abs(this.mapArea.endY - this.mapArea.startY)
    ctx.fillRect(this.mapArea.startX, this.mapArea.startY, width, height)
    ctx.fillStyle = "#ffffff"
    ctx.font = "20px Arial"
    ctx.fillText(
      '更多金币',
      this.mapArea.startX + 10,
      this.mapArea.startY + 30
    )
    this.mapHandler = this.mapEvent.bind(this)
    canvas.addEventListener('touchstart', this.mapHandler)
  }

  createGoldTextBtn() {
    this.gtArea = {
      startX: screenWidth / 2 - 160,
      startY: screenHeight / 2 - 20,
      endX: screenWidth / 2 - 60,
      endY: screenHeight / 2 + 30
    }
    ctx.fillStyle = '#1AFD9c';
    let width = Math.abs(this.gtArea.endX - this.gtArea.startX)
    let height = Math.abs(this.gtArea.endY - this.gtArea.startY)
    ctx.fillRect(this.gtArea.startX, this.gtArea.startY, width, height)
    ctx.fillStyle = "#ffffff"
    ctx.font = "20px Arial"
    ctx.fillText(
      '金币文字',
      this.gtArea.startX + 10,
      this.gtArea.startY + 30
    )
    this.gtHandler = this.gtEvent.bind(this)
    canvas.addEventListener('touchstart', this.gtHandler)
  }


  createGetbtn() {
    this.getBtnArea = {
      startX: screenWidth / 2 - 40,
      startY: screenHeight / 2 - 100,
      endX: screenWidth / 2 + 60,
      endY: screenHeight / 2 - 50
    }
    ctx.fillStyle = '#0000FF';
    let width = Math.abs(this.getBtnArea.endX - this.getBtnArea.startX)
    let height = Math.abs(this.getBtnArea.endY - this.getBtnArea.startY)
    ctx.fillRect(this.getBtnArea.startX, this.getBtnArea.startY, width, height)
    ctx.fillStyle = "#ffffff"
    ctx.font = "20px Arial"
    ctx.fillText(
      '获得数据',
      this.getBtnArea.startX + 10,
      this.getBtnArea.startY + 30
    )
    this.getHandler = this.getKVDataHandler.bind(this)
    canvas.addEventListener('touchstart', this.getHandler)
  }

  createSetBtn() {
    this.setBtnArea = {
      startX: screenWidth / 2 - 40,
      startY: screenHeight / 2 - 20,
      endX: screenWidth / 2 + 60,
      endY: screenHeight / 2 + 30
    }
    ctx.fillStyle = '#9932CD';
    let width = Math.abs(this.setBtnArea.endX - this.setBtnArea.startX)
    let height = Math.abs(this.setBtnArea.endY - this.setBtnArea.startY)
    ctx.fillRect(this.setBtnArea.startX, this.setBtnArea.startY, width, height)
    ctx.fillStyle = "#ffffff"
    ctx.font = "20px Arial"
    ctx.fillText(
      '设置数据',
      this.setBtnArea.startX + 10,
      this.setBtnArea.startY + 30
    )
    this.setHandler = this.setKVDataHandler.bind(this)
    canvas.addEventListener('touchstart', this.setHandler)

  }

  createGiftBtn() {
    this.gifArea = {
      startX: screenWidth / 2 - 160,
      startY: screenHeight / 2 + 80,
      endX: screenWidth / 2 - 60,
      endY: screenHeight / 2 + 130
    }
    ctx.fillStyle = '#0000FF';
    let width = Math.abs(this.gifArea.endX - this.gifArea.startX)
    let height = Math.abs(this.gifArea.endY - this.gifArea.startY)
    ctx.fillRect(this.gifArea.startX, this.gifArea.startY, width, height)
    ctx.fillStyle = "#ffffff"
    ctx.font = "20px Arial"
    ctx.fillText(
      '更多游戏',
      this.gifArea.startX + 10,
      this.gifArea.startY + 30
    )

    this.gifHandler = this.createGiftCode.bind(this)
    canvas.addEventListener('touchstart', this.gifHandler)
  }

  creataLoginBtn() {
    this.loginBtnArea = {
      startX: screenWidth / 2 - 40,
      startY: screenHeight / 2 - 100 + 180,
      endX: screenWidth / 2 + 60,
      endY: screenHeight / 2 - 100 + 255
    }
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(this.loginBtnArea.startX, this.loginBtnArea.startY, 100, 50)
    ctx.fillStyle = "#ffffff"
    ctx.font = "20px Arial"
    ctx.fillText(
      '登录按钮',
      this.loginBtnArea.startX + 10,
      this.loginBtnArea.startY + 30
    )

    this.touchHandler = this.loginEventHandler.bind(this)
    canvas.addEventListener('touchstart', this.touchHandler)
  }

  creataGameBtn() {
    this.gameBtn = {
      startX: screenWidth / 2 - 40,
      startY: screenHeight / 2 + 140,
      endX: screenWidth / 2 + 60,
      endY: screenHeight / 2 + 190
    }
    ctx.fillStyle = '#5a5aad';
    ctx.fillRect(this.gameBtn.startX, this.gameBtn.startY, 100, 50)

    ctx.fillStyle = "#ffffff"
    ctx.font = "20px Arial"
    ctx.fillText(
      '游戏提现',
      this.gameBtn.startX + 10,
      this.gameBtn.startY + 30
    )

    this.gameHandler = this.gameEvent.bind(this)
    canvas.addEventListener('touchstart', this.gameHandler)
  }

  createPayBtn() {
    this.payBtn = {
      startX: screenWidth / 2 - 40,
      startY: screenHeight / 2 + 210,
      endX: screenWidth / 2 + 60,
      endY: screenHeight / 2 + 260
    }
    ctx.fillStyle = '#f75000';
    ctx.fillRect(this.payBtn.startX, this.payBtn.startY, 100, 50)

    ctx.fillStyle = "#ffffff"
    ctx.font = "20px Arial"
    ctx.fillText(
      '支付按钮',
      this.payBtn.startX + 10,
      this.payBtn.startY + 30
    )

    this.payHandler = this.payEvent.bind(this)
    canvas.addEventListener('touchstart', this.payHandler)
  }

  createGiftCode(e)
  {
    e.preventDefault()
    let x = e.touches[0].clientX
    let y = e.touches[0].clientY
    if (x >= this.gifArea.startX
      && x <= this.gifArea.endX
      && y >= this.gifArea.startY
      && y <= this.gifArea.endY) {
      gamesdk.dataStatistics.createPFCode( res => {
        console.log(res);
      }, err => {
        console.log(err);
      })
    }
  }

  //改变金币
  changeGold(e)
  {
    e.preventDefault()
    let x = e.touches[0].clientX
    let y = e.touches[0].clientY
    if (x >= this.goldArea.startX
      && x <= this.goldArea.endX
      && y >= this.goldArea.startY
      && y <= this.goldArea.endY) {
      gamesdk.coin.updateGold(100,'share_get_coin','game', res => {
        console.log(res);
      }, err => {
        console.log(err);
      })
    }
  }

  gtEvent(e)
  {
    e.preventDefault()
    let x = e.touches[0].clientX
    let y = e.touches[0].clientY
    if (x >= this.gtArea.startX
      && x <= this.gtArea.endX
      && y >= this.gtArea.startY
      && y <= this.gtArea.endY) {
      gamesdk.coin.getGoldExplain(res=>{
        console.log(res);
      },err=>{
        console.log(err);
      })
    }
  }

  //平台映射
  mapEvent(e) {
    e.preventDefault()
    let x = e.touches[0].clientX
    let y = e.touches[0].clientY
    if (x >= this.mapArea.startX
      && x <= this.mapArea.endX
      && y >= this.mapArea.startY
      && y <= this.mapArea.endY) {
      let gameCoin = 25000;
      let gameName = '拼图来了';
      gamesdk.dataStatistics.goldMap(gameName, gameCoin, res => {
        console.log(res);
      }, err => {
        console.log(err);
      })
    }
  }

  //主动转发
  initiativeShare(e) {
    this.shareArea = {
      startX: screenWidth / 2 - 40,
      startY: screenHeight / 2 - 180,
      endX: screenWidth / 2 + 60,
      endY: screenHeight / 2 - 130
    }
    ctx.fillStyle = '#00A600';
    let width = Math.abs(this.shareArea.endX - this.shareArea.startX)
    let height = Math.abs(this.shareArea.endY - this.shareArea.startY)
    ctx.fillRect(this.shareArea.startX, this.shareArea.startY, width, height)
    ctx.fillStyle = "#ffffff"
    ctx.font = "20px Arial"
    ctx.fillText(
      '主动转发',
      this.shareArea.startX + 10,
      this.shareArea.startY + 30
    )
    this.openShareClick = this.openShare.bind(this)
    canvas.addEventListener('touchstart', this.openShareClick)
  }

  gameEvent(e) {
    e.preventDefault()

    let x = e.touches[0].clientX
    let y = e.touches[0].clientY
    let gameArea = this.gameBtn
    if (x >= gameArea.startX
      && x <= gameArea.endX
      && y >= gameArea.startY
      && y <= gameArea.endY) {
      gamesdk.dataStatistics.withDraw('', res => {
        console.log(res);
      }, err => {
        console.log(err);
      })
    }
  }

  payEvent(e) {
    e.preventDefault()
    let x = e.touches[0].clientX
    let y = e.touches[0].clientY
    let payArea = this.payBtn
    if (x >= payArea.startX
      && x <= payArea.endX
      && y >= payArea.startY
      && y <= payArea.endY) {
      gamesdk.game.pay(10, 100, '钻石', '我需要的字符串', res => {
        console.log('success有回调',res);
        if (res.code == 10400) {
          console.log('支付成功，到账可能延迟')
        } else if (res.code == 10401) {
          console.log('支付成功')
        }
      }, err => {
        console.log('fail有回调',err);
        if (err.code == 10102) {
          console.log('服务器报错');
        } else if (err.code == 10403) {
          console.log('服务器返回支付失败')
        } else if (err.code == 10402) {
          console.log('订单被取消')
        } else if (err.code == 10406) {
          console.log('当前暂不支持充值')
        } else if (err.code == 10411) {
          console.log('限制在支付成功后轮询成功前不允许重复下单支付 midasPay')
        } else if(err.code == 10407){
          console.log('米大师支付失败');
          //具体原因请查看err.nativeCode
        }
      })
    }
  }

  //获取用户keyvalue
  getKVDataHandler(e) {
    e.preventDefault()
    let thiz = this;
    let x = e.touches[0].clientX
    let y = e.touches[0].clientY

    let area = this.getBtnArea;
    if (x >= area.startX
      && x <= area.endX
      && y >= area.startY
      && y <= area.endY) {
      gamesdk.dataStatistics.getKVUserData(res => {
        // console.log(res);
      }, err => {
        // console.log(err);
      })
    }
  }

  //获取用户keyvalue
  setKVDataHandler(e) {
    e.preventDefault()
    let thiz = this;
    let x = e.touches[0].clientX
    let y = e.touches[0].clientY
    let setData = 'set data 123123';
    let area = this.setBtnArea;
    if (x >= area.startX
      && x <= area.endX
      && y >= area.startY
      && y <= area.endY) {
      gamesdk.dataStatistics.setKVUserData(setData, res => {
        // console.log(res);
      }, err => {
        // console.log(err);
      })
    }
  }

  /* 函数:检查玩家是否同步到平台 */
  checkMapPlatForm(e)
  {
    e.preventDefault()
    let thiz = this;
    let x = e.touches[0].clientX
    let y = e.touches[0].clientY
    let area = this.checkMapArea
    if (x >= area.startX
      && x <= area.endX
      && y >= area.startY
      && y <= area.endY) {
        gamesdk.coin.checkSynchronized(res=>{
          console.log(res);
        },err=>{
          console.log(err);
        },'gold')
      }
  }

  mysteryEvent(e)
  {
    e.preventDefault()
    let thiz = this;
    let x = e.touches[0].clientX
    let y = e.touches[0].clientY
    let area = this.mysteryArea
    if (x >= area.startX
      && x <= area.endX
      && y >= area.startY
      && y <= area.endY) {
        gamesdk.dataStatistics.mysteryCode('拼图来了',res=>{
          console.log(res);
        },err=>{
          console.log(err);
        })
      }
  }

  /* 函数:查询金币 */
  pollingGold(e)
  {
    e.preventDefault()
    let thiz = this;
    let x = e.touches[0].clientX
    let y = e.touches[0].clientY
    let area = this.pgArea
    if (x >= area.startX
      && x <= area.endX
      && y >= area.startY
      && y <= area.endY) {
        gamesdk.coin.getGameGoldBalance(res=>{
          console.log(res);
        },err=>{
          console.log(err);
        })
      }
  }

  openShare(e) {
    e.preventDefault()
    let thiz = this;
    let x = e.touches[0].clientX
    let y = e.touches[0].clientY

    let area = this.shareArea
    if (x >= area.startX
      && x <= area.endX
      && y >= area.startY
      && y <= area.endY) {
      gamesdk.dataStatistics.getShareInfo('wangquan', res => {
        console.log(res, '分享数据')
        let data = res.data.data;
        let shareObj = {
          title: data.title,
          imageUrl: data.image,
          query: 'val=val分享数据',
          success: (info) => {
            console.log('被动转发 成功：', info);
            let shareType = 'initiative'
            gamesdk.dataStatistics.shareSuccess(shareType)
          },
          fail: (info) => { },
          complet: info => {
            console.log("被动转发完成：", info)
          }
        }
        gamesdk.dataStatistics.shareAppMsg(shareObj)
      }, err => {

      }, '1002', '', '', '','')

    }
  }

  /* 函数:奖励点击 */
  rewardEvent(e)
  {
    e.preventDefault()
    let x = e.touches[0].clientX
    let y = e.touches[0].clientY
    let area = this.jlArea;
    if (x >= area.startX
      && x <= area.endX
      && y >= area.startY
      && y <= area.endY) {
        gamesdk.dataStatistics.taskGoldMap('拼图来了',66666,res=>{
          console.log(res)
        },err=>{
          console.log(err);
        })
      }
  }

  /* 函数注释:获取礼包 */
  getGiftEvent(e){
    e.preventDefault()
    let thiz = this;
    let x = e.touches[0].clientX
    let y = e.touches[0].clientY
    let area = this.getGiftArea;
    if (x >= area.startX
      && x <= area.endX
      && y >= area.startY
      && y <= area.endY) {
        gamesdk.game.getMysteryGift(51,res=>{
          console.log(res)
        },err=>{
          console.log(err);
        })
      }
  }

  // 游戏登陆逻辑
  loginEventHandler(e) {
    e.preventDefault()
    let thiz = this;
    let x = e.touches[0].clientX
    let y = e.touches[0].clientY

    let area = this.loginBtnArea
    let shareObj = {
      title: '一起来玩小游戏',
      path: '/pages/index/index',
      imageUrl: 'https://h5game.gametall.com/chatgame/app_res/game_res_upload/2018-05-07/1525696365876.png',
      success: function (res) {
        console.log(res)
      },
      fail: function (res) {
        // 转发失败
        console.log(res)
      }
    }

    if (x >= area.startX
      && x <= area.endX
      && y >= area.startY
      && y <= area.endY) {
      console.log('点击到了')
      //调用gamesdk的登录接口
      gamesdk.game.login(res => {
        console.log(res,'登录数据')
        if (res.data.isNeedUpdateUserInfo) {
          console.log(thiz)
          //创建按钮
            gamesdk.game.createUserInfoBtn('text', '获取用户信息', '', {
              left: 10,
              top: 76,
              width: 200,
              height: 40,
              lineHeight: 40,
              backgroundColor: '#ff0000',
              color: '#ffffff',
              textAlign: 'center',
              fontSize: 16,
              borderRadius: 4
            }, res => {
              console.log(res);
              if (res.code == 1) { //成功获取按钮
                
                thiz.authorizeBtn = res.data;
                thiz.authorizeBtn.onTap(tapInfo => {
                  gamesdk.game.authorize(tapInfo, res => {
                    //授权成功
                    // dosomething...
                    console.log(res)
                    gamesdk.dataStatistics.onShowInfo(thiz.info, res => {
                      console.log(res);
                      thiz.authorizeBtn.hide();
                      gamesdk.coin.addUserOpenidMapping(thiz.info,10000,res=>{
                        console.log(res);
                      },err=>{
                        console.log(err);
                      })
                    }, err => {
                      console.log(err);
                    })
                  }, err => {
                    console.log(err) //打印错误回调
                  })
                })
              } else if (res.code == 0) {  //版本库太低用了getUserInfo
                //授权成功,返回登录信息
                // let userInfo = data.userInfo;
                // let sessionId = data.sessionId;
                // let openId = data.openId;
                gamesdk.dataStatistics.onShowInfo(thiz.info, res => {
                  console.log(res);
                  gamesdk.coin.addUserOpenidMapping(thiz.info,10000,res=>{
                    console.log(res);
                  },err=>{
                    console.log(err);
                  })
                }, err => {
                  console.log(err);
                })
              }
            }, err => {
              
              console.log(err)
            });         
        } else {
          console.log('不需要授权')
          gamesdk.dataStatistics.onShowInfo(thiz.info, res => {
            console.log(res);
            gamesdk.coin.addUserOpenidMapping(thiz.info,10000,res=>{
              console.log(res);
            },err=>{
              console.log(err);
            })
          }, err => {
            console.log(err);
          })
        }
      }, err => {
        console.log(err)
      })

    }

  }

}
