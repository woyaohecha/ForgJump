import { HttpManager } from "./HttpManager";
import Tools from "./Tools";

export const wx = window["wx"];

export class WXManager {

    private static rankBtn: cc.Node = null;
    public static isLogin: boolean = false;

    /*
        rankBtn:排行榜按钮，需要在授权失败时添加点击授权方法
        getSettingSuccess：授权成功回调
        setAvatar:设置头像
        setInfo:设置页面上的数据
    */
    public static wxLogin(rankBtn: cc.Node, getSettingSuccess: Function, setAvatar: Function, setInfo: Function) {
        console.log("进入微信登录");
        if (!wx) {
            console.log("不是微信平台！");
            return;
        }
        this.rankBtn = rankBtn;
        let self = this;
        wx.login({
            success: res => {
                console.log("微信登录成功:", res);
                HttpManager.getOpenId(res.code, () => {
                    self.onGetSetting(getSettingSuccess, setAvatar, setInfo);
                });
            },
            fail: res => {
                console.log("登录失败", res);
            }
        })
    }


    public static onGetSetting(getSettingSuccess: Function, setAvatar: Function, setInfo: Function) {
        wx.getSetting({
            success: res => {
                if (res.authSetting["scope.userInfo"]) {
                    wx.getUserInfo({
                        success: res => {
                            console.log("获取用户信息成功：", res);
                            HttpManager.nickName = res.userInfo.nickName;
                            HttpManager.avatarUrl = res.userInfo.avatarUrl;
                            HttpManager.loadAvatar(setAvatar);
                            HttpManager.saveUserInfo(setInfo);
                            this.isLogin = true;
                        },
                        fail: res => {
                            console.log("获取用户信息失败：", res);
                        }
                    })
                } else {
                    console.log("创建全屏授权按钮");
                    let sysInfo = wx.getSystemInfoSync();
                    let button = wx.createUserInfoButton({
                        lang: "zh_CN",  // 返回信息的展示方式，en:英文类型，zh_CN:简体中文，zh_TW:繁体中文
                        type: "text",
                        text: "",
                        style: {
                            left: 0,
                            top: 0,
                            width: sysInfo.windowWidth,
                            height: sysInfo.windowHeight,
                            backgroundColor: "#00000000",
                            borderColor: "#ffffff",
                            textAlign: "center",
                            fontSize: 16,
                            lineHeight: sysInfo.windowHeight,
                        }
                    })

                    button.onTap(res => {
                        if (res.userInfo) {
                            console.log("全屏按钮授权成功：", res.userInfo);
                            HttpManager.nickName = res.userInfo.nickName;
                            HttpManager.avatarUrl = res.userInfo.avatarUrl;
                            HttpManager.loadAvatar(setAvatar);
                            HttpManager.saveUserInfo(setInfo);
                            this.isLogin = true;
                            button.destroy();
                        } else {
                            console.log("全屏按钮授权失败：", res);
                            this.createRankOnGetUserInfoBtn(getSettingSuccess);
                            button.destroy();
                        }
                    })
                    button.show();
                }
            }
        })
    }

    public static createRankOnGetUserInfoBtn(getSettingSuccess: Function) {
        let btnInfo = this.getBtnRankRect(this.rankBtn);
        console.log("创建排行榜授权按钮:", btnInfo);
        let button = wx.createUserInfoButton({
            lang: "zh_CN",  // 返回信息的展示方式，en:英文类型，zh_CN:简体中文，zh_TW:繁体中文
            type: "text",
            text: "",
            style: {
                left: btnInfo.left,
                top: btnInfo.top,
                width: btnInfo.width,
                height: btnInfo.height,
                backgroundColor: "#00000000",
                borderColor: "#ffffff",
                textAlign: "center",
                fontSize: 16,
                lineHeight: 16,
            }
        })
        console.log("创建排行榜授权按钮成功:", button);
        button.onTap(res => {
            if (res.userInfo) {
                console.log("排行榜授权成功：", res);
                button.destroy();
                getSettingSuccess();
            } else {
                console.log("排行榜授权失败：", res);
                wx.showModal({
                    title: "温馨提示",
                    content: "需要您的用户信息才可以查看排行榜！",
                    showCancel: false
                });
            }
        })
        button.show();
    }

    public static wxShare() {
        if (wx) {
            wx.onShareAppMessage(function () {
                return {
                    title: '快救我！'
                }
            })
        }
    }

    public static showShareMenu() {
        if (wx) {
            wx.showShareMenu({
                withShareTicket: true,
                menus: ['shareAppMessage', 'shareTimeline']
            })
        }
    }

    public static getBtnRankRect(btn: cc.Node) {
        // wx.getSystemInfo 的同步版本
        if (!wx) {
            return;
        }
        let sys = wx.getSystemInfoSync();
        let rect = btn.getBoundingBoxToWorld();
        let ratio = cc.view.getDevicePixelRatio();
        let scale = cc.view.getScaleX();
        let factor = scale / ratio;

        let caNode = btn.parent;
        let diffY = caNode.height - cc.view.getDesignResolutionSize().height;
        let left = rect.x * factor;
        let top = sys.screenHeight - (rect.y + rect.height) * factor - diffY / 2 * factor;
        let w = rect.width * factor;
        let h = rect.height * factor;

        // 手机屏幕 的区域 rect
        let srect = { left: left, top: top, width: w, height: h };
        return srect;
    }
}

