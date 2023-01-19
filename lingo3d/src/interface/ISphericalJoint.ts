import { coneLimitRange } from "./ID6Joint"
import IJointBase, { jointBaseDefaults, jointBaseSchema } from "./IJointBase"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export default interface ISphericalJoint extends IJointBase {
    limitY: number
    limitZ: number
}

export const sphericalJointSchema: Required<ExtractProps<ISphericalJoint>> = {
    ...jointBaseSchema,
    limitY: Number,
    limitZ: Number
}

export const sphericalJointDefaults = extendDefaults<ISphericalJoint>(
    [jointBaseDefaults],
    {
        limitY: 360,
        limitZ: 360
    },
    {
        limitY: coneLimitRange,
        limitZ: coneLimitRange
    }
)
