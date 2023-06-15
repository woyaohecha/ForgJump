import { AppConfig } from "./AppConfig";

const httpUrl = "https://frog-game.sxycykj.net/api/app/clientAPI/";
const getOpenId = "getOpenId/?";  //获取openid（即为uid）接口
const saveUserInfo = "saveUserInfo/?";  //保存用户数据（头像，昵称）接口
const saveScoreByUid = "saveScoreByUid/?";//保存用户记录（关卡，对应时间，需要判断是否需要更新）
const getRank = "getRank"; //获取用户排行榜数据

/*流程
-------------------微信登录
-------------------通过code从服务器获取openid(uid)
-------------------存用户头像等数据
-------------------显示用户头像、昵称
*/
export class HttpManager {
    public static uid: number = 20230609;
    public static nickName: string = "username";
    public static avatar: cc.SpriteFrame = null;
    public static avatarUrl: string = null;
    public static score: number = 0;
    public static gold: number = 0;
    public static share: number = 0;

    //通用get请求
    private static httpRequest(apiUrl: string, data, completed: Function) {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                completed(xhr.responseText);
            }
        };
        let url = httpUrl + apiUrl + data;
        xhr.open("GET", url, true);
        xhr.send();
    }

    //微信登录后从服务端获取openid，存本地
    public static getOpenId(code, success: Function) {
        let data = "appid=" + AppConfig.appid + "&secret=" + AppConfig.secret + "&js_code=" + code;
        this.httpRequest(getOpenId, data, (res) => {
            console.log("getOpenId:", res);
            if (JSON.parse(res).data) {
                this.uid = JSON.parse(res).data.openid;
                success();
            }
        })
    }

    //根据uid保存用户头像，昵称等信息
    //返回用户分数，金币,分享等数据
    public static saveUserInfo(success: Function) {
        if (this.nickName && this.avatarUrl) {
            let data = "uid=" + this.uid + "&nickname=" + this.nickName + "&img=" + this.avatarUrl;
            this.httpRequest(saveUserInfo, data, (res) => {
                console.log("saveUserInfo:", res);
                this.score = Number(JSON.parse(res).data[0].score);
                this.gold = Number(JSON.parse(res).data[0].gold);
                this.share = Number(JSON.parse(res).data[0].share);
                success();
            })
        }
    }

    public static loadAvatar(success: Function) {
        if (this.avatarUrl) {
            cc.assetManager.loadRemote(this.avatarUrl, { ext: '.png' }, (e, texture: cc.Texture2D) => {
                if (e) {
                    console.log(e);
                    return;
                }
                let sp = new cc.SpriteFrame(texture);
                this.avatar = sp;
                success();
            })
        }
    }

    //根据uid保存用户数据
    public static saveScoreByUid() {
        let data = "uid=" + this.uid + "&score=" + this.score + "&gold=" + this.gold + "&share=" + this.share;
        this.httpRequest(saveScoreByUid, data, (res) => {
            console.log("saveScoreByUid:", res);
        })
    }

    //获取排行榜数据
    public static getRank(completed: Function) {
        this.httpRequest(getRank, "", (res) => {
            console.log("getRank:", res);
            let rankList = JSON.parse(res).data.rankList;
            completed(rankList);
        });
    }
}

