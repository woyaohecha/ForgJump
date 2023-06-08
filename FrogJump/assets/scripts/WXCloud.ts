const env = "cloud1-9g8jgmbt28b3740a";
const wx = window["wx"];

export default class WXCloud {

    public static openId: string = "";
    public static collection = null;

    //初始化云服务器
    public static init() {
        wx.cloud.init({
            traceUser: true,
            env: env
        });
        console.log("云服务器初始化成功");
        WXCloud.collection = wx.cloud.database().collection("WorldRank");
        wx.cloud.callFunction({
            name: "getOpenId",
            complete: (res) => {
                WXCloud.openId = res.result.openid;
                console.log("获取openid:", res.result.openid);
            }
        })
    }

    //每次登录时更新或新增用户头像和昵称信息
    public static updateDBUser(nickName: string, avatarUrl: string) {
        WXCloud.collection.where({
            _openid: WXCloud.openId,
        }).get({
            success: (res) => {
                if (res.data.length > 0) {
                    WXCloud.collection.doc(res.data[0]._id).update({
                        data: {
                            nickName: nickName,
                            avatarUrl: avatarUrl
                        },
                        success() {
                            console.log("更新用户信息成功");
                        }
                    })
                } else {
                    WXCloud.collection.add({
                        data: {
                            nickName: nickName,
                            avatarUrl: avatarUrl,
                            score: 0
                        },
                        success: () => {
                            console.log("新增用户成功");
                        }
                    })
                }
            }
        })
    }

    //获取排行榜前10信息
    public static getRankTop10(callBack: Function) {
        wx.cloud.callFunction({
            name: "queryWorldRank",
            complete: (res) => {
                console.log("获取排行数据:", res);
                callBack();
            }
        })
    }

    //更新用户历史最高分
    public static updateDBSocre(score: number) {
        WXCloud.collection.where({
            _openid: WXCloud.openId
        }).update({
            data: {
                score: score
            },
            success: (res) => {
                console.log("分数更新成功");
            }
        })
    }
}