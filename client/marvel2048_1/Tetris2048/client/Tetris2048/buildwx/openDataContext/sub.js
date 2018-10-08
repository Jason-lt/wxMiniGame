// "openDataContext": "src/openDataContext"
// console.log(' load openData');
let sharedCanvas = wx.getSharedCanvas()
let openData = {
    getUserData: function (callback) {
        return wx.getUserCloudStorage({
            keyList: ['maxscore',
                'name',
                'gender',
                'avatarUrl',
                'iv',
                'signature'
            ],
            success: function (result) {
                //result : {KVDataList :[key:string,value:string]}
                console.log('getUserCloudStorage success');
                callback(result)
            },
            failed: function () {

            },
            complete: function () {

            }
        });
    },

    /*
    获取用户好友中玩过该游戏的用户信息
    参数格式:
    {
        keyList: ['maxscore',
                'name',
                'gender',
                'avatarUrl',
                'iv',
                'signature'], 必须
        success: function () {},
        failed: function () {},
        comlete: function () {},
    }
    返回值:
    {
        data: [
            {
                avatarUrl: string,
                nickName: string,
                openId: string,
                KVList:[ key: string, value: string]
            }
        ]
    }
    kvdata的key和value必须为string
    */
    getFriendCloudStorage: function (obj) {
        if (typeof wx !== 'undefined') {
            console.log('getFriendCloudStorage params:', obj);
            wx.getFriendCloudStorage(obj);
        }
    },

    /*
    获取用户分享群中玩过该游戏的用户信息
    参数格式:
    {
        shareTicket: string 必须 //群分享对应的 shareTicket
        keyList: ['maxscore',
                'name',
                'gender',
                'avatarUrl',
                'iv',
                'signature'], 必须
        success: function () {},
        failed: function () {},
        comlete: function () {},
    }
    返回值:
    {
        data: [
            {
                avatarUrl: string,
                nickName: string,
                openId: string,
                KVList:[ key: string, value: string]
            }
        ]
    }
    kvdata的key和value必须为string
    */
    getGroupCloudStorage: function (obj) {
        if (typeof wx !== 'undefined') {
            console.log('getGroupCloudStorage params:', obj);
            wx.getGroupCloudStorage(obj);
        }
    },

    getRankListAndDraw: function (data, w, h) {
        for (let i = data.length - 1; i >= 0; i--) {
            const player = data[i];
            if (!parseInt(this.UGetValueByKeyFromKVDataList(player.KVDataList, 'maxscore'))) {
                console.log('删除无效数据:', data)
                data.splice(i, 1);
            }
        }
        // let sortData = []
        // data.forEach(userData => {
        //     sortData.push(sortData)
        // });
        data.forEach((a, i) => {
            console.log(i, a)
        });
        data.sort((a, b) => {
            return parseInt(this.UGetValueByKeyFromKVDataList(b.KVDataList, 'maxscore')) - parseInt(this.UGetValueByKeyFromKVDataList(a.KVDataList, 'maxscore'))
        })

        // data = data.sort((a, b) => {
        //   return parseInt(b.nickname.length) - parseInt(a.nickname.length);
        // })
        console.log('get sorted RankData: ');
        console.log(data);
        this.drawRankList(data, w, h);
        this.rankData = data;


        //处理自己的排名
        this.getUserData((data) => {
            wx.getUserInfo({
                openIdList: ['selfOpenId'],
                lang: 'zh_CN',
                success: (res) => {
                    console.log('getUserInfo success', res.data)
                    data.name = res.data[0].nickName;
                    data.avatarUrl = res.data[0].avatarUrl;
                    this.drawSelfRank(data);
                },
                fail: (res) => {
                    console.log('getUserInfo reject', res.data)
                    reject(res)
                    data.name = '我';
                    data.avatarUrl = image.src = 'res/raw-assets/resources/texture/tri2s.png';
                    this.drawSelfRank(data.KVDataList);
                }
            })
        })
    },

    cleanCanvas: function () {
        let context = sharedCanvas.getContext('2d')
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    },

    drawRankList: function (data, w, h) {
        let context = sharedCanvas.getContext('2d');
        context.canvas.width = w;
        // h = 105 * data.length
        // 增加100高度用于绘制自己的排名信息
        context.canvas.height = h + 100;
        context.clearRect(0, 0, w, h + 100);

        //自己的排名信息绘制在最上方100像素,此处预留100像素向下绘制
        //在显示主排行时,转成texture2d后需使用tiled或mask将最上方100像素裁切掉
        //在显示自己排名时,只显示最上方100像素
        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            if (i < 20) {
                this.drawARankItem(context, item, i + 1);
            } else {
                break
            }
        }
    },

    drawARankItem: function (context, item, index) {
        let h = (index + 1) * 95;
        context.fillStyle = '#7d5d48';
        context.font = "42px STHeiti Bold";
        var rankYOffset = index < 4 ? 32 : 38;

        context.fillText(index, 73 - context.measureText(index).width * 0.5, h - rankYOffset);

        context.fillStyle = '#7d5d48';
        context.font = "28px PingFang SC";
        let image = wx.createImage();
        image.onload = () => {
            // console.log('draw image', index, image, typeof image);
            context.drawImage(image, 130, h - 84, 64, 64);
        }
        // image.src = 'res/raw-assets/resources/texture/tri2s.f5ed5.png';
        image.src = item.avatarUrl;
        image.width = 64;
        image.height = 64;
        let name = item.nickname;
        if (name.length > 7) {
            name = name.substring(0, 7) + '...';
        }
        context.fillText(name, 230, h - 42);
        context.fillText(this.UGetValueByKeyFromKVDataList(item.KVDataList, 'maxscore'), 460, h - 42);
    },


    //绘制自己的排行数据
    drawSelfRank: function (data) {
        console.log('drawSelfRank', data);

        let context = sharedCanvas.getContext('2d');

        context.fillStyle = '#CCAD2F';
        context.font = "42px STHeiti Bold";
        let h = 105;
        let myrank = this.getMyRank(this.UGetValueByKeyFromKVDataList(data.KVDataList, 'maxscore'));
        if (myrank == undefined) {
            context.font = "30px STHeiti Bold";
            context.fillText('未上榜', 73 - context.measureText('未上榜').width * 0.5, h - 40);
        } else {
            context.fillText(myrank, 73 - context.measureText(myrank).width * 0.5, h - 40);
        }

        let image = wx.createImage();
        image.onload = () => {
            context.drawImage(image, 130, h - 84, 64, 64);
        }
        image.src = data.avatarUrl; //this.UGetValueByKeyFromKVDataList(data, 'avatarUrl');
        image.width = 64;
        image.height = 64;
        context.fillStyle = '#7d5d48';
        context.font = "28px PingFang SC";
        let name = data.name;
        if (name.length > 7) {
            name = name.substring(0, 7) + '...';
        }
        context.fillText(name, 230, h - 42);
        //分数值
        var value = (myrank == undefined) ? 0 : this.UGetValueByKeyFromKVDataList(data.KVDataList, 'maxscore');
        context.fillText(value, 460, h - 42);
    },

    getMyRank: function (maxscore) {
        for (let i = 0; i < this.rankData.length; i++) {
            if (maxscore >= parseInt(this.UGetValueByKeyFromKVDataList(this.rankData[i].KVDataList, 'maxscore'))) {
                return i + 1;
            }
        }
    },


    UGetValueByKeyFromKVDataList: function (kvDataList, key) {
        for (let i = 0; i < kvDataList.length; i++) {
            const kvData = kvDataList[i];
            if (kvData.key === key) {
                return kvData.value;
            }
        }
        return null;
    },
}

wx.onMessage(params => {
    console.log('wx.onMessage', params)
    switch (params.type) {
        case 'getFriendRank':
            openData.cleanCanvas();
            openData.getFriendCloudStorage({
                keyList: ['maxscore',
                    'name',
                    'gender',
                    'avatarUrl',
                    'iv',
                    'signature'
                ],
                success: (data) => {

                    openData.getRankListAndDraw(data.data, params.width, params.height);
                },
                failed: () => {},
                comlete: () => {},
            })
            break;
        case 'getGroupRank':
            openData.cleanCanvas();
            openData.getGroupCloudStorage({
                shareTicket: params.shareTicket,
                keyList: ['maxscore',
                    'name',
                    'gender',
                    'avatarUrl',
                    'iv',
                    'signature'
                ],
                success: (data) => {
                    openData.getRankListAndDraw(data.data, params.width, params.height);
                },
                failed: () => {},
                comlete: () => {},
            })
            break;
        default:
            break;
    }
})