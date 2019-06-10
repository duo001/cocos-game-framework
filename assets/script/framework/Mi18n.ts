import { en } from "../data/en";
import { zh } from "../data/zh";
import { G } from "./G";
import { L } from "./L";
import { MLog } from "./MLog";
import { MVersion } from "./MVersion";

const { ccclass, property, requireComponent, menu } = cc._decorator
const C = {
    LANGUAGE: {
        "english": en,  // 英文
        "chinese": zh,  // 中文
    },
    EDITOR_TYPE: "english",     // 编辑器语言
    DEFAULT_KEY: "enter-a-key", // 默认key
}

/** 语言类型 */
type TypeLanguage = keyof typeof C.LANGUAGE;

/**
 * [M] 国际化-多语言
 * - 修改对应配置文件中的内容，key-value格式
 * - [用法] 将此组件挂载在对应的Label所在节点下，修改key
 * - [用法] 使用静态接口text()
 */
@ccclass
@requireComponent(cc.Label)
@menu("framework/Mi18n")
export class Mi18n extends cc.Component {

    /** 初始化本地存储 */
    static init_local() {
        L.language = C.EDITOR_TYPE
    }

    /**
     * 获取key对应的value并组合成为字符串
     * @param key
     * @param param
     */
    static text(key: keyof typeof en, ...param: any[]): string {
        let type = (MVersion.is_editor || !L.language) ? C.EDITOR_TYPE : L.language
        let value = C.LANGUAGE[type][key]
        if (!value) {
            value = key
            MLog.warn(`@Mi18n: 获取了一个不存在的key, key=${key}`)
        }
        return G.fake_template_string(value, ...param)
    }

    onLoad() {
        this.play_onload && this.update_label()
    }

    @property({ tooltip: "字符串key;无法使用notify()函数" })
    private key: string = C.DEFAULT_KEY

    @property({ tooltip: "字符串参数", type: cc.String })
    private param: string[] = []

    @property({ tooltip: "预览1次;预览完毕后置于false", type: cc.Boolean })
    private get preview() { return false }
    private set preview(v: boolean) {
        MVersion.is_editor && this.update_label()
    }

    @property({ tooltip: "是否在onLoad()时候修改" })
    private play_onload: boolean = true

    private label: cc.Label;

    /**
     * 更新label
     * - 目前仅支持cc.Label组件
     * @param label node中的cc.Label组件
     */
    private update_label() {
        if (!this.label) {
            this.label = this.node.getComponent(cc.Label)
        }
        this.label.string = Mi18n.text(<any>this.key, ...this.param)
    }
}