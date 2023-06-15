import { HttpManager } from "./HttpManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RankLayer extends cc.Component {

    @property(cc.Node)
    rankPanel: cc.Node = null;

    @property(cc.Prefab)
    rankItem: cc.Prefab = null;

    inited: boolean = false;
    rankList: any[] = [];

    onLoad() { }

    start() {

    }

    onEnable() {
        if (this.inited) {
            this.initScroll();
            return;
        }
        this.setLayer();
    }

    setLayer() {
        let self = this;
        if (this.rankList.length > 0) {
            for (let i = 0; i < this.rankList.length; i++) {
                let item = cc.instantiate(this.rankItem);
                item.getChildByName("RankId").getComponent(cc.Label).string = "No." + (i + 1);
                item.getChildByName("Name").getComponent(cc.Label).string = this.rankList[i].nickname;
                item.getChildByName("Score").getComponent(cc.Label).string = this.rankList[i].score;

                let imageUrl: string = this.rankList[i].img;

                let avatar = item.getChildByName("Mask").getChildByName("Avatar").getComponent(cc.Sprite);
                if (imageUrl.substring(-1, 8) == "https://") {
                    cc.assetManager.loadRemote(imageUrl, (e, asset: cc.Texture2D) => {
                        if (e) {
                            console.log(e);
                            return;
                        }
                        console.log("加载头像成功:", asset, typeof (asset));
                        let sp = new cc.SpriteFrame(asset);
                        avatar.spriteFrame = sp;
                    })
                }
                item.setParent(this.rankPanel);
            }
            this.inited = true;
        } else {
            HttpManager.getRank((rankList) => {
                self.rankList = rankList;
                console.log("获取排行榜数据:", rankList);
                self.setLayer();
            });
        }
    }

    initScroll() {
        let scrollView = this.node.getChildByName("PanelBg").getChildByName("RankPanel").getComponent(cc.ScrollView);
        scrollView.scrollToOffset(cc.v2(0, 0));
    }
}
