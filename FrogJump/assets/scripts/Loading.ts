import User from "./User";
import WXCloud from "./WXCloud";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Loading extends cc.Component {

    @property(cc.Label)
    valueLabel: cc.Label = null;

    @property(cc.ProgressBar)
    loadingBar: cc.ProgressBar = null;

    barValue: number = 0;
    toIndex: boolean = false;
    user: User = null;

    onLoad() {
        //初始化云服务器
        WXCloud.init();
        // cc.sys.localStorage.clear();
        this.user = User.getInstance();
    }

    start() {
        this.changeBarValue();
    }

    update(dt) {
        if (this.toIndex) {
            return;
        }
        this.valueLabel.string = this.barValue + "%";
        this.loadingBar.progress = this.barValue / 100;
        if (this.barValue >= 99) {
            this.unscheduleAllCallbacks();
            this.toIndex = true;
            cc.director.loadScene("Index");
        }
    }

    changeBarValue() {
        this.schedule(() => {
            this.barValue = Math.floor(this.barValue + Math.random() / 5 * 100 >= 100 ? 100 : this.barValue + Math.random() / 10 * 100);
        }, 0.02);
    }
}
