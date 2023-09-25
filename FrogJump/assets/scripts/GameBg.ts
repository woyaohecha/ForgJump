import AudioManager from "./AudioManager";
import Tools from "./Tools";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameBg extends cc.Component {

    @property
    moveSpeed: number = 100;

    @property(cc.Prefab)
    stagePrefab: cc.Prefab = null;

    @property(cc.Prefab)
    goldPrefab: cc.Prefab = null;

    eventNode: cc.Node = null;
    frog: cc.Node = null;
    stages: cc.Node = null;
    golds: cc.Node = null;
    waters: cc.Node = null;
    pops: cc.Node = null;
    farBgs: cc.Node = null;
    clouds: cc.Node = null;
    stageCount: number = 0;

    canJudge: boolean = true;


    onLoad() {
        this.eventNode = cc.find("EventNode");
        this.frog = this.node.parent.getChildByName("Frog");
        this.stages = this.node.parent.getChildByName("Stages");
        this.golds = this.node.parent.getChildByName("Golds");

        this.waters = this.node.getChildByName("Waters");
        this.pops = this.node.getChildByName("Pops");
        this.farBgs = this.node.getChildByName("FarBgs");
        this.clouds = this.node.getChildByName("Clouds");
    }

    start() {
    }

    update(dt) {
        //移动之后再进行判断
        if (!this.canJudge)
            return;

        //更新水的位置
        for (let i = 0; i < this.waters.children.length; i++) {
            this.waters.children[i].x -= this.moveSpeed * dt;
            if (this.waters.children[i].x <= -2668) {
                let tempX = this.waters.children[0].x;
                for (let j = 1; j < this.waters.children.length; j++) {
                    if (this.waters.children[j].x > tempX) {
                        tempX = this.waters.children[j].x;
                    }
                }
                this.waters.children[i].x = tempX + this.waters.children[i].width;
            }
        }
        //更新水中气泡的位置
        for (let i = 0; i < this.pops.children.length; i++) {
            this.pops.children[i].x -= this.moveSpeed * dt * 0.5;
            if (this.pops.children[i].x <= -1300) {
                this.pops.children[i].x = 1300;
                this.pops.children[i].y = Tools.getRandomNum(-100, -300);
            }
        }
        //更新云的位置
        for (let i = 0; i < this.clouds.children.length; i++) {
            this.clouds.children[i].x -= this.moveSpeed * dt * 0.2;
            if (this.clouds.children[i].x <= -1300) {
                this.clouds.children[i].x = 1300;
            }
        }
        //更新远景的位置
        for (let i = 0; i < this.farBgs.children.length; i++) {
            if (this.farBgs.children[i].x <= -2666) {
                let tempX = this.farBgs.children[0].x;
                for (let j = 1; j < this.farBgs.children.length; j++) {
                    if (this.farBgs.children[j].x > tempX) {
                        tempX = this.farBgs.children[j].x;
                    }
                }
                this.farBgs.children[i].x = tempX + this.farBgs.children[i].width - 1;
            }
        }

        //超出边界的金币直接移除
        for (let i = 0; i < this.golds.children.length; i++) {
            if (this.golds.children[i].x <= -1500) {
                this.golds.children[i].destroy();
            }
        }

        //更新舞台（叶子）的位置
        for (let i = 0; i < this.stages.children.length; i++) {
            //需要更新超出范围的叶子位置
            if (this.stages.children[i].x <= -1500) {
                //找到当前最右侧的叶子位置
                let tempX = this.stages.children[0].x;
                for (let j = 1; j < this.stages.children.length; j++) {
                    if (this.stages.children[j].x > tempX) {
                        tempX = this.stages.children[j].x;
                    }
                }
                //在最右侧叶子位置的基础上增加随机数值
                let minX = 300;
                let maxX = 400 + Math.floor(this.stageCount / 3) * 50;
                this.stages.children[i].x = Tools.getRandomNum(minX, maxX > 700 ? 700 : maxX) + tempX;
                let minY = -280;
                let maxY = -175 + Math.floor(this.stageCount / 10) * 30;
                this.stages.children[i].y = Tools.getRandomNum(minY, maxY > 150 ? 150 : maxY);

                this.stages.children[i].getChildByName("Tips").getComponent(cc.Label).string = "";

                //实例化金币
                let gold = cc.instantiate(this.goldPrefab);
                gold.setParent(this.golds);
                let posX = (this.stages.children[i].x + tempX) / 2;
                let tempY = 100 + Math.floor(this.stageCount / 3) * 20;
                let posY = Tools.getRandomNum(-100, tempY > 260 ? 260 : tempY);
                gold.setPosition(posX, posY);
                break;
            }
        }
    }


    move(value: number, stageCount: number) {
        this.canJudge = false;
        this.stageCount += stageCount;
        value = -value;
        let time = Math.abs(value / 500);

        for (let i = 0; i < this.waters.children.length; i++) {
            cc.tween(this.waters.children[i])
                .by(time, { x: value })
                .start();
        }

        for (let i = 0; i < this.pops.children.length; i++) {
            cc.tween(this.pops.children[i])
                .by(time, { x: value })
                .start();
        }
        for (let i = 0; i < this.clouds.children.length; i++) {
            cc.tween(this.clouds.children[i])
                .by(time, { x: value * 0.2 })
                .start();
        }

        for (let i = 0; i < this.farBgs.children.length; i++) {
            cc.tween(this.farBgs.children[i])
                .by(time, { x: value * 0.5 })
                .start();
        }
        for (let i = 0; i < this.stages.children.length; i++) {
            cc.tween(this.stages.children[i])
                .by(time, { x: value })
                .start();
        }
        for (let i = 0; i < this.golds.children.length; i++) {
            cc.tween(this.golds.children[i])
                .by(time, { x: value })
                .start();
        }

        cc.tween(this.frog)
            .by(time, { x: value })
            .call(() => {
                this.eventNode.emit("BgMoveCompleted");
                this.canJudge = true;
                this.eventNode.emit("canTouchMove");
            }, this)
            .start();

    }

    init() {
        this.stages.removeAllChildren();
        this.golds.removeAllChildren();
        this.eventNode.on("move", this.move, this);
        this.stageCount = 0;

        //初始叶子的位置
        let pos = cc.v2(-380, -175);

        //初始化青蛙位置：第一片叶子上
        this.frog.setPosition(pos);
        this.frog.getChildByName("Frog").active = true;

        while (pos.x <= 3000) {
            let stage = cc.instantiate(this.stagePrefab);
            stage.setParent(this.stages);
            stage.height = cc.winSize.height / 2;
            stage.setPosition(pos);
            stage.getChildByName("Tips").getComponent(cc.Label).string = "";
            // if (this.stageCount % 5 == 0) {
            //     let temp = Math.floor(this.stageCount * 100 + Math.random() * 100);
            //     stage.getChildByName("Tips").getComponent(cc.Label).string = "超越" + temp + "名玩家";
            //     console.log("stageCount", this.stageCount, temp)
            // } else {
            //     stage.getChildByName("Tips").getComponent(cc.Label).string = "";
            // }

            //两片叶子中间随机生成金币
            if (this.stageCount > 0) {
                let gold = cc.instantiate(this.goldPrefab);
                gold.setParent(this.golds);
                let posX = (this.stages.children[this.stageCount].x + this.stages.children[this.stageCount - 1].x) / 2;
                let tempY = 100 + Math.floor(this.stageCount / 3) * 20;
                let posY = Tools.getRandomNum(-100, tempY > 260 ? 260 : tempY);
                gold.setPosition(posX, posY);
            }
            //下一个叶子位置更新
            let minX = 300;
            let maxX = 400 + Math.floor(this.stageCount / 3) * 50;
            pos.x += Tools.getRandomNum(minX, maxX > 700 ? 700 : maxX);
            let minY = -280;
            let maxY = -175 + Math.floor(this.stageCount / 10) * 30;
            pos.y = Tools.getRandomNum(minY, maxY > 150 ? 150 : maxY);
            this.stageCount++;
        }
    }


}
