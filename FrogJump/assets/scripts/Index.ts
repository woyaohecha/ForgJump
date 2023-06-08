import User from "./User";
import WXCloud from "./WXCloud";
import WXSdk from "./WXSDK";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Index extends cc.Component {

    @property(cc.Label)
    scoreLabel: cc.Label = null;

    @property(cc.Label)
    goldLabel: cc.Label = null;

    @property(cc.Node)
    userNode: cc.Node = null;

    user: User = null;

    onLoad() {
        cc.director.preloadScene("Game");
        this.user = User.getInstance();
        this.init();
        this.node.on(cc.Node.EventType.TOUCH_START, () => {
            console.log("touch");
        })
    }

    start() {
        WXSdk.Login((name, imageUrl) => {
            let self = this;
            cc.assetManager.loadRemote(imageUrl, { ext: '.png' }, function (e, texture: cc.Texture2D) {
                // Use texture to create sprite frame
                let spriteFrame = new cc.SpriteFrame(texture);
                self.userNode.getChildByName("Profile").children[0].getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
            this.userNode.getChildByName("Name").getComponent(cc.Label).string = name;
        });
        this.openRank();
    }

    BtnStart() {
        cc.director.loadScene("Game");
    }

    init() {
        this.scoreLabel.string = this.user.getData("historyScore");
        this.goldLabel.string = this.user.getData("gold");
    }

    openRank() {
        WXCloud.getRankTop10(() => {
            console.log("排行数据获取回调");
        });
    }


}
