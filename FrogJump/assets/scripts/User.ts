import WXCloud from "./WXCloud";

const { ccclass, property } = cc._decorator;



@ccclass
export default class User {

    private static _instance: User;

    private historyScore: number = 0;
    private gold: number = 0;
    private todayShare: number = 0;
    private lastLogin: {};

    private constructor() {
        //获取上次登录时间
        //判定是否老用户当天登录；若是则需要刷新玩家部分数据
        let date = new Date();
        let nowDate = {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate()
        };
        let lastLogin = cc.sys.localStorage.getItem("lastLogin");

        if (lastLogin) {
            lastLogin = JSON.parse(lastLogin);
            if (!(nowDate.year == lastLogin.year && nowDate.month == lastLogin.month && nowDate.day == lastLogin.day))
                //如果能拿到登录数据
                //需要判断是否非当天登录
                //如果不是当天登录，则需要刷新：当天分享次数
                this.todayShare = 0;
        } else {
            this.todayShare = Number(cc.sys.localStorage.getItem("todayShare"));
        }
        this.lastLogin = JSON.stringify(nowDate);
        this.historyScore = cc.sys.localStorage.getItem("historyScore") ? Number(cc.sys.localStorage.getItem("historyScore")) : 0;
        this.gold = cc.sys.localStorage.getItem("gold") ? Number(cc.sys.localStorage.getItem("gold")) : 0;

        cc.sys.localStorage.setItem("historyScore", this.historyScore);
        cc.sys.localStorage.setItem("gold", this.gold);
        cc.sys.localStorage.setItem("todayShare", this.todayShare);
        cc.sys.localStorage.setItem("lastLogin", this.lastLogin);
    }


    public static getInstance() {
        if (!User._instance) {
            User._instance = new User();
        }
        return User._instance;
    }

    public getData(name: string) {
        return this[name];
    }

    public setData(name: string, value: number) {
        this[name] = value;
        cc.sys.localStorage.setItem(name, value);
        if (name == "historyScore") {
            if (this.historyScore >= value) {
                return;
            }
            WXCloud.updateDBSocre(value);
        }
    }
}
