// "openDataContext": "src/openDataContext"
// console.log(' load openData');
let sharedCanvas = null;
try {
    sharedCanvas = wx.getSharedCanvas();
} catch (error) {
    console.warn("sharedCanvas is null:", error);
}

let openData = {
    isInit: false,
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

    initFriendsRank: function (data) {
        console.log('初始化好友排行信息(超越好友)');

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

        //this.drawRankList(data, w, h);
        this.rankData = data;
        this.myRankData = null;

        //处理自己的排名
        this.getUserData((data) => {
            wx.getUserInfo({
                openIdList: ['selfOpenId'],
                lang: 'zh_CN',
                success: (res) => {
                    console.log('getUserInfo success', res.data)
                    data.name = res.data[0].nickName;
                    data.avatarUrl = res.data[0].avatarUrl;
                    this.myRankData = data;
                    this.isInit = true;
                    console.log("this.myRankData", this.myRankData);
                },
                fail: (res) => {
                    console.log('getUserInfo reject', res.data)
                    reject(res)
                    data.name = '我';
                    data.avatarUrl = image.src = 'res/raw-assets/resources/texture/tri2s.png';
                    this.myRankData = data.KVDataList;
                    this.isInit = true;
                }
            })
        });
    },

    getNextFriendAndDraw: function (score, w, h) {
        console.log('绘制超越好友信息');

        if (!this.isInit) return;
        if (!sharedCanvas) return;

        let context = sharedCanvas.getContext('2d');
        context.canvas.width = w;
        context.canvas.height = h;
        context.clearRect(0, 0, w, h);

        context.fillStyle = '#9A927B';
        context.font = "20px STHeiti Bold";
        let friendData = this.getNextFriendRank(score);
        console.log('即将超越好友的信息:', friendData);

        // 有比自己分高的朋友
        if (friendData) {
            context.fillText('即将超越', 50 - context.measureText('即将超越').width * 0.5, 20);

            let image = wx.createImage();
            image.onload = () => {
                context.drawImage(image, 50 - 32, 30, 64, 64);
            }
            image.src = friendData.avatarUrl; //this.UGetValueByKeyFromKVDataList(data, 'avatarUrl');
            console.log(image.src);
            image.width = 64;
            image.height = 64;
            context.fillStyle = '#9A927B';
            context.font = "16px PingFang SC";
            let name = friendData.nickname;
            if (name.length > 7) {
                name = name.substring(0, 7) + '...';
            }
            context.fillText(name, 50 - context.measureText(name).width * 0.5, 110);

            context.fillStyle = '#9A927B';
            context.font = "18px PingFang SC";
            context.fillText(this.UGetValueByKeyFromKVDataList(friendData.KVDataList, 'maxscore'),
                50 - context.measureText(this.UGetValueByKeyFromKVDataList(friendData.KVDataList, 'maxscore')).width * 0.5, 130);
        }
        // 自己是最高的
        else if (this.myRankData) {
            context.fillText('无人可挡!', 50 - context.measureText('无人可挡!').width * 0.5, 20);

            let image = wx.createImage();
            image.onload = () => {
                context.drawImage(image, 50 - 32, 30, 64, 64);
            }
            image.src = this.myRankData.avatarUrl; //this.UGetValueByKeyFromKVDataList(this.myRankData, 'avatarUrl');
            console.log(image.src);
            image.width = 64;
            image.height = 64;
            context.fillStyle = '#9A927B';
            context.font = "16px PingFang SC";
            let name = this.myRankData.name;
            if (name.length > 7) {
                name = name.substring(0, 7) + '...';
            }
            context.fillText(name, 50 - context.measureText(name).width * 0.5, 110);

            context.fillStyle = '#9A927B';
            context.font = "18px PingFang SC";
            console.log('------------无人可挡-----------------分数：', this.myRankData);
            //context.fillText(this.UGetValueByKeyFromKVDataList(this.myRankData.KVDataList, 'maxscore'),
            //    50 - context.measureText(this.UGetValueByKeyFromKVDataList(this.myRankData.KVDataList, 'maxscore')).width * 0.5, 130);

            context.fillText(score,
                50 - context.measureText(score).width * 0.5, 130);
        }
    },

    getNextFriendRank: function (score) {

        var myMaxScore = parseInt(this.UGetValueByKeyFromKVDataList(this.myRankData.KVDataList, 'maxscore'));
        console.log('自己最高分：', myMaxScore);
        if (myMaxScore) {
            for (let i = this.rankData.length - 1; i >= 0; i--) {
                var scoreI = parseInt(this.UGetValueByKeyFromKVDataList(this.rankData[i].KVDataList, 'maxscore'));

                console.log('排行分数：', scoreI);
                if (score < scoreI && scoreI != myMaxScore) {
                    return this.rankData[i];
                }
            }
        } else {
            for (let i = this.rankData.length - 1; i >= 0; i--) {
                if (score < parseInt(this.UGetValueByKeyFromKVDataList(this.rankData[i].KVDataList, 'maxscore'))) {
                    return this.rankData[i];
                }
            }
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
                    this.myRankData = data;
                },
                fail: (res) => {
                    console.log('getUserInfo reject', res.data)
                    reject(res)
                    data.name = '我';
                    data.avatarUrl = image.src = 'res/raw-assets/resources/texture/tri2s.png';
                    this.drawSelfRank(data.KVDataList);
                    this.myRankData = data.KVDataList;
                }
            })
        })
    },

    cleanCanvas: function () {
        if (sharedCanvas) {
            let context = sharedCanvas.getContext('2d')
            context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        }
    },

    drawRankList: function (data, w, h) {
        if (sharedCanvas) {
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

        if (sharedCanvas) {
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
        }
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
        case 'initFriendRank':
            //openData.cleanCanvas();
            openData.getFriendCloudStorage({
                keyList: [
                    'maxscore',
                    'name',
                    'gender',
                    'avatarUrl',
                    'iv',
                    'signature'
                ],
                success: (data) => {
                    console.log('initFriendRank success!');
                    openData.initFriendsRank(data.data);
                },
                failed: (err) => {
                    console.log('err initFriendRank:', err.errMsg);
                },
                comlete: () => {
                    console.log('complete initFriendRank:');
                },
            })
            break;

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
                complete: () => {},
            })
            break;

        case 'getNextFriend':
            openData.getNextFriendAndDraw(params.score, params.width, params.height);
            break;
        default:
            break;
    }
})