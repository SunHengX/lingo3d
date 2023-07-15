import { DirectionalLightHelper, Light, SpotLightHelper } from "three"
import scene from "../../engine/scene"
import ILightBase from "../../interface/ILightBase"
import HelperSprite from "./helperPrimitives/HelperSprite"
import GimbalObjectManager from "./GimbalObjectManager"
import { ColorString } from "../../interface/ITexturedStandard"
import { ssrExcludeSet } from "../../collections/ssrExcludeSet"
import { renderCheckExcludeSet } from "../../collections/renderCheckExcludeSet"
import { updateSystem } from "../../systems/updateSystem"
import { getWorldMode } from "../../states/useWorldMode"
import { worldModePtr } from "../../pointers/worldModePtr"

export default abstract class LightBase<T extends Light>
    extends GimbalObjectManager<T>
    implements ILightBase
{
    public constructor(
        light: T,
        Helper?: typeof DirectionalLightHelper | typeof SpotLightHelper
    ) {
        super(light)
        this.createEffect(() => {
            if (worldModePtr[0] !== "editor" || this.$disableSceneGraph) return

            const sprite = new HelperSprite("light", this)
            if (Helper) {
                const helper = new Helper(light as any)
                ssrExcludeSet.add(helper)
                renderCheckExcludeSet.add(helper)
                scene.add(helper)
                helper.add(sprite.$object)
                "update" in helper && updateSystem.add(helper)

                sprite.then(() => {
                    helper.dispose()
                    ssrExcludeSet.delete(helper)
                    renderCheckExcludeSet.delete(helper)
                    scene.remove(helper)
                    "update" in helper && updateSystem.delete(helper)
                })
            }
            return () => {
                sprite.dispose()
            }
        }, [getWorldMode])
    }

    protected override disposeNode() {
        super.disposeNode()
        this.$innerObject.dispose()
    }

    public get color() {
        return ("#" + this.$innerObject.color.getHexString()) as ColorString
    }
    public set color(val: ColorString) {
        this.$innerObject.color.set(val)
    }

    public get intensity() {
        return this.$innerObject.intensity
    }
    public set intensity(val) {
        this.$innerObject.intensity = val
    }
}
