import { onBeforeRender } from "../../events/onBeforeRender"
import IThirdPersonCamera, {
    thirdPersonCameraDefaults,
    thirdPersonCameraSchema
} from "../../interface/IThirdPersonCamera"
import CharacterCamera from "../core/CharacterCamera"
import { managerActorPtrMap } from "../core/PhysicsObjectManager/physx/pxMaps"
import {
    assignPxVec,
    assignPxVec_
} from "../core/PhysicsObjectManager/physx/pxMath"
import getWorldDirection from "../utils/getWorldDirection"
import getWorldPosition from "../utils/getWorldPosition"
import getWorldQuaternion from "../utils/getWorldQuaternion"
import MeshAppendable from "../../api/core/MeshAppendable"
import { physxPtr } from "../core/PhysicsObjectManager/physx/physxPtr"
import { getEditorHelper } from "../../states/useEditorHelper"

const setVisible = (target: MeshAppendable, visible: boolean) =>
    "visible" in target && (target.visible = visible)

export default class ThirdPersonCamera
    extends CharacterCamera
    implements IThirdPersonCamera
{
    public static componentName = "thirdPersonCamera"
    public static override defaults = thirdPersonCameraDefaults
    public static override schema = thirdPersonCameraSchema

    public constructor() {
        super()
        this.innerZ = 300
        this.orbitMode = true

        const cam = this.camera

        this.createEffect(() => {
            const found = this.firstChildState.get()
            if (!(found instanceof MeshAppendable)) {
                const handle = onBeforeRender(() => {
                    cam.position.copy(getWorldPosition(this.object3d))
                    cam.quaternion.copy(getWorldQuaternion(this.object3d))
                })
                return () => {
                    handle.cancel()
                }
            }

            let tooCloseOld = false
            setVisible(found, true)

            const handle = onBeforeRender(() => {
                const origin = getWorldPosition(this.outerObject3d)
                const position = getWorldPosition(this.object3d)

                const pxHit = physxPtr[0].pxRaycast?.(
                    assignPxVec(origin),
                    assignPxVec_(getWorldDirection(this.object3d)),
                    position.distanceTo(origin),
                    managerActorPtrMap.get(found)
                )
                pxHit && position.lerpVectors(position, pxHit.position, 1.1)

                cam.position.copy(position)
                cam.quaternion.copy(getWorldQuaternion(this.object3d))

                const tooClose = getEditorHelper()
                    ? false
                    : cam.position.distanceTo(origin) < 1
                tooClose !== tooCloseOld && setVisible(found, !tooClose)
                tooCloseOld = tooClose
            })
            return () => {
                handle.cancel()
            }
        }, [this.firstChildState.get])
    }
}
