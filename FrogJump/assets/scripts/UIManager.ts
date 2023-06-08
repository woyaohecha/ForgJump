import GameBg from "./GameBg";
import PlayerCtrl from "./PlayerCtrl";
import User from "./User";

const { ccclass, property } = cc._decorator;

@ccclass
export default class UIManager extends cc.Component {

    @property(cc.Label)
    settleScoreLabel: cc.Label = null;

    @property(cc.Label)
    settleGoldLabel: cc.Label = null;

    @property(cc.Label)
    reliveNumLabel: cc.Label = null;

    eventNode: cc.Node = null;
    gameBg: GameBg = null;
    palyerCtrl: PlayerCtrl = null;

    scoreLabel: cc.Label = null;
    goldLabel: cc.Label = null;
    settlePanel: cc.Node = null;
    propHelpPanel: cc.Node = null;
    propRelivePanel: cc.Node = null;
    user: User = null;

    onLoad() {
        this.eventNode = cc.find("EventNode");
        this.user = User.getInstance();
        this.gameBg = this.node.parent.getChildByName("GameBg").getComponent("GameBg");
        this.palyerCtrl = this.node.parent.getChildByName("PlayerCtrl").getComponent("PlayerCtrl");
        this.scoreLabel = this.node.getChildByName("GameUI").getChildByName("Score").getComponent(cc.Label);
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

        this.eventNode.on("score", (value) => {
            this.scoreLabel.string = "分数：" + value;
        });
        this.eventNode.on("gold", (value) => {
            this.goldLabel.string = "金币：" + value;
        })
        this.eventNode.on("openPropRelive", this.openPropRelive, this);
        this.settlePanel.active = false;
        this.propHelpPanel.active = false;
        this.propRelivePanel.active = false;
    }

    getPropHelp() {
        let btn = this.propHelpPanel.getChildByName("Btn");
        if (this.user.getData("gold") >= 10) {
            btn.getChildByName("Gold").active = true;
            btn.getChildByName("Video").active = false;
        } else {
            btn.getChildByName("Gold").active = false;
            btn.getChildByName("Video").active = true;
        }
        this.propHelpPanel.active = true;
    }

    propHelpGold() {
        let value = this.user.getData("gold") - 10;
        this.user.setData("gold", value);
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
            if (this.user.getData("todayShare") == 0) {
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
        console.log("分享成功");
        this.user.setData("todayShare", 1);
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
        let score = this.palyerCtrl.getSettleData().score;
        let gold = this.palyerCtrl.getSettleData().gold;
        this.settleScoreLabel.string = String(score);
        this.settleGoldLabel.string = String(gold);

        let userGold = this.user.getData("gold") + gold;
        this.user.setData("gold", userGold);
        if (score > this.user.getData("historyScore")) {
            this.user.setData("historyScore", score);
        }

        this.settlePanel.active = true;
    }

    back() {
        cc.director.loadScene("Index");
    }

    refreshLabel(name: string, value: number) {

    }
}
