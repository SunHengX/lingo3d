import IObjectManager, {
    objectManagerDefaults,
    objectManagerSchema
} from "./IObjectManager"
import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"
import Range from "./utils/Range"
import { ColorString } from "./ITexturedStandard"

export default interface ILightBase extends IObjectManager {
    color: ColorString
    intensity: number
    helper: boolean
}

export const lightBaseSchema: Required<ExtractProps<ILightBase>> = {
    ...objectManagerSchema,
    helper: Boolean,
    color: String,
    intensity: Number
}

export const lightBaseDefaults = extendDefaults<ILightBase>(
    [objectManagerDefaults],
    {
        color: "#ffffff",
        intensity: 1,
        helper: true
    },
    { intensity: new Range(0, 20) },
    { color: true }
)
