/*
 * @Author: LXR 923390756@qq.com
 * @Date: 2023-06-09 01:01:36
 * @LastEditors: LXR 923390756@qq.com
 * @LastEditTime: 2023-07-13 04:10:35
 * @FilePath: \FrogJump\assets\scripts\Loading.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
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
        if (this.barValue >= 99) {
            this.barValue = 100;
            this.unscheduleAllCallbacks();
            this.toIndex = true;
            cc.director.loadScene("Index");
        }
        this.valueLabel.string = this.barValue + "%";
        this.loadingBar.progress = this.barValue / 100;
    }

    changeBarValue() {
        this.schedule(() => {
            this.barValue = Math.floor(this.barValue + Math.random() / 5 * 100 >= 100 ? 100 : this.barValue + Math.random() / 10 * 100);
        }, 0.02);
    }
}
