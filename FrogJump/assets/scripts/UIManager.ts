import AudioManager from "./AudioManager";
import GameBg from "./GameBg";
import { HttpManager } from "./HttpManager";
import PlayerCtrl from "./PlayerCtrl";
import { WXManager } from "./WXManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class UIManager extends cc.Component {

    @property(cc.Label)
    settleScoreLabel: cc.Label = null;

    @property(cc.Label)
    settleGoldLabel: cc.Label = null;

    @property(cc.Node)
    tips: cc.Node = null;

    @property(cc.Animation)
    light: cc.Animation = null;

    @property(cc.Label)
    reliveNumLabel: cc.Label = null;

    eventNode: cc.Node = null;
    gameBg: GameBg = null;
    palyerCtrl: PlayerCtrl = null;

    scoreLabel: cc.Label = null;
    goldLabel: cc.Label = null;
    historyLabel: cc.Label = null;
    settlePanel: cc.Node = null;
    propHelpPanel: cc.Node = null;
    propRelivePanel: cc.Node = null;

    onLoad() {
        this.eventNode = cc.find("EventNode");
        this.gameBg = this.node.parent.getChildByName("GameBg").getComponent("GameBg");
        this.palyerCtrl = this.node.parent.getChildByName("PlayerCtrl").getComponent("PlayerCtrl");
        this.scoreLabel = this.node.getChildByName("GameUI").getChildByName("Score").getComponent(cc.Label);
        this.historyLabel = this.node.getChildByName("GameUI").getChildByName("History").getComponent(cc.Label);
        this.goldLabel = this.node.getChildByName("GameUI").getChildByName("Gold").getComponent(cc.Label);
        this.settlePanel = this.node.getChildByName("Settle");
        this.propHelpPanel = this.node.getChildByName("PropHelp");
        this.propRelivePanel = this.node.getChildByName("PropRelive");
    }

    start() {

    }

    // update (dt) {}

    init() {
        this.scoreLabel.string = "分数：" + 0;
        this.goldLabel.string = "金币：" + 0;
        this.historyLabel.string = "历史最佳：" + HttpManager.score;
        this.tips.active = false;
        this.light.node.active = false;
        this.eventNode.on("score", (value) => {
            this.scoreLabel.string = "分数：" + value;
            this.scoreLabel.node.getComponent(cc.Animation).play();
        });
        this.eventNode.on("gold", (value) => {
            this.goldLabel.string = "金币：" + value;
            this.goldLabel.node.getComponent(cc.Animation).play();
        })
        this.eventNode.on("openPropRelive", this.openPropRelive, this);
        this.settlePanel.active = false;
        this.propHelpPanel.active = false;
        this.propRelivePanel.active = false;
    }

    getPropHelp() {
        let btn = this.propHelpPanel.getChildByName("Btn");
        if (HttpManager.gold >= 10) {
            btn.getChildByName("Gold").active = true;
            btn.getChildByName("Video").active = false;
        } else {
            btn.getChildByName("Gold").active = false;
            btn.getChildByName("Video").active = true;
        }
        this.propHelpPanel.active = true;
    }

    propHelpGold() {
        HttpManager.gold -= 10;
        this.eventNode.emit("propHelp");
        this.propHelpPanel.active = false;
    }

    propHelpVideo() {
        console.log("观看了视频");
        this.eventNode.emit("propHelp");
        this.propHelpPanel.active = false;
    }

    closePropHelpPanel() {
        this.propHelpPanel.active = false;
    }

    openPropRelive(reliveNum: number) {
        if (reliveNum >= 3) {
            this.settle();
        } else {
            this.reliveNumLabel.string = "每局可以使用3次（" + reliveNum + "/3）";
            let btn = this.propRelivePanel.getChildByName("Btn");
            if (HttpManager.share == 0) {
                btn.getChildByName("Share").active = true;
                btn.getChildByName("Video").active = false;
            } else {
                btn.getChildByName("Share").active = false;
                btn.getChildByName("Video").active = true;
            }
            this.propRelivePanel.active = true;
        }
    }

    propReliveShare() {
        WXManager.wxShare();
        console.log("分享成功");
        HttpManager.share = 1;
        HttpManager.saveScoreByUid();
        this.eventNode.emit("propRelive");
        this.propRelivePanel.active = false;
    }

    propReliveVideo() {
        console.log("观看了视频");
        this.eventNode.emit("propRelive");
        this.propRelivePanel.active = false;
    }

    closePropRelivePanel() {
        this.propRelivePanel.active = false;
        this.settle();
    }



    settle() {
        AudioManager.stopMusic();
        AudioManager.playSound("lose");
        let score = this.palyerCtrl.getSettleData().score;
        let gold = this.palyerCtrl.getSettleData().gold;
        this.settleScoreLabel.string = String(score);
        this.settleGoldLabel.string = String(gold);

        HttpManager.gold += gold;
        if (score > HttpManager.score) {
            this.tips.active = true;
            this.light.node.active = true;
            this.light.play();
            HttpManager.score = score;
            HttpManager.saveScoreByUid();
        } else {
            this.tips.active = false;
            this.light.node.active = false;
        }
        this.settlePanel.active = true;
    }

    back() {
        cc.director.loadScene("Index");
    }

    refreshLabel(name: string, value: number) {

    }
}
