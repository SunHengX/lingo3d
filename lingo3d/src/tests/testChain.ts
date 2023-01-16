import { createEffect } from "@lincode/reactivity"
import "../display/core/PhysicsObjectManager/physx"
import { managerActorMap } from "../display/core/PhysicsObjectManager/physx/pxMaps"
import {
    multPxTransform,
    setPxTransform,
    setPxTransform_,
    setPxTransform__,
    setPxVec__
} from "../display/core/PhysicsObjectManager/physx/pxMath"
import Cube from "../display/primitives/Cube"
import { PI_HALF } from "../globals"
import { getPhysX, physXPtr } from "../states/usePhysX"

const createLimitedSpherical = (a0: any, t0: any, a1: any, t1: any) => {
    const { physics, Px, PxJointLimitCone, PxSphericalJointFlagEnum } =
        physXPtr[0]

    const j = Px.SphericalJointCreate(physics, a0, t0, a1, t1)
    j.setLimitCone(new PxJointLimitCone(PI_HALF, PI_HALF, 0.05))
    j.setSphericalJointFlag(PxSphericalJointFlagEnum.eLIMIT_ENABLED(), true)
    return j
}

const createChain = (t: any, length: number, g: any, separation: number) => {
    const { PxCreateDynamic, physics, material, scene } = physXPtr[0]

    const offset = setPxVec__(separation * 0.5, 0, 0)
    const localTm = setPxTransform__(offset.x, 0, 0)
    let prev = null

    for (let i = 0; i < length; i++) {
        const current = PxCreateDynamic(
            physics,
            multPxTransform(t, localTm),
            g,
            material,
            1
        )
        createLimitedSpherical(
            prev,
            prev ? setPxTransform(offset.x, offset.y, offset.z) : t,
            current,
            setPxTransform_(-offset.x, 0, 0)
        )
        scene.addActor(current)

        const manager = new Cube()
        managerActorMap.set(manager, current)

        prev = current
        localTm.p.x += separation
    }
}

createEffect(() => {
    const { physics, PxBoxGeometry } = physXPtr[0]
    if (!physics) return

    createChain(setPxTransform(0, 20, 0), 5, new PxBoxGeometry(2, 0, 0), 4)
}, [getPhysX])
