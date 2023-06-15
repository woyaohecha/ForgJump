import { HttpManager } from "./HttpManager";
import { WXManager } from "./WXManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Loading extends cc.Component {

    @property(cc.Label)
    valueLabel: cc.Label = null;

    @property(cc.ProgressBar)
    loadingBar: cc.ProgressBar = null;

    barValue: number = 0;
    toIndex: boolean = false;

    onLoad() {
        WXManager.showShareMenu();
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
