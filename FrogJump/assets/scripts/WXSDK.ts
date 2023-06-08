import WXCloud from "./WXCloud";

const wx = window["wx"];

export default class WXSdk {
    public static data: any = null;

    public static getUserName(): string {
        if (WXSdk.data == null) {
            return "某高人";
        }
        else {
            return WXSdk.data.userInfo.nickName;
        }
    }
    public static getAvatarURL(): string {
        if (WXSdk.data == null) {
            return "";
        }
        else {
            return WXSdk.data.userInfo.avatarUrl;
        }
    }


    public static Login(callBack: Function): void {
        let sysInfo = wx.getSystemInfoSync();
        let width = sysInfo.screenWidth;
        let height = sysInfo.screenHeight;
        wx.getSetting({
            success(res) {
                if (res.authSetting["scope.userInfo"]) {
                    console.log("用户已授权");
                    wx.getUserInfo({
                        success(res) {
                            WXSdk.data = res;
                            WXCloud.updateDBUser(WXSdk.getUserName(), WXSdk.getAvatarURL());
                            callBack(WXSdk.getUserName(), WXSdk.getAvatarURL());
                        }
                    });
                }
                else {
                    console.log("用户未授权");
                    //用户未授权的话，全屏覆盖一个按钮，用户点击任意地方都会触发onTap()，弹出授权界面
                    let button = wx.createUserInfoButton({
                        type: 'text',
                        text: '',//不显示文字
                        style: {
                            left: 0,
                            top: 0,
                            width: width,
                            height: height,
                            // lineHeight: 40,
                            backgroundColor: '#00000000',//设置按钮透明
                            color: '#ffffff',
                            textAlign: 'center',
                            fontSize: 16,
                            // borderRadius: 4
                        }
                    });
                    button.onTap(
                        (res) => {
                            if (res.userInfo) {
                                console.log("用户授权成功");
                                WXSdk.data = res;
                                //TODO：others
                                button.destroy();//此时删除按钮
                                WXCloud.updateDBUser(WXSdk.getUserName(), WXSdk.getAvatarURL());
                                callBack(WXSdk.getUserName(), WXSdk.getAvatarURL());
                            }
                            else//说明用户点击 不允许授权的按钮
                            {
                                console.log("用户拒绝授权");
                            }
                        }
                    );
                }
            }
        });
    }
}
