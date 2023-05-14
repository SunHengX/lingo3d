import { createEffect } from "@lincode/reactivity"
import { BoxHelper } from "three"
import { getMultipleSelectionTargets } from "../states/useMultipleSelectionTargets"
import { getSelectionTarget } from "../states/useSelectionTarget"
import { addUpdateSystem, deleteUpdateSystem } from "../systems/updateSystem"
import scene from "./scene"
import { selectionTargetPtr } from "../pointers/selectionTargetPtr"
import { ssrExcludeSet } from "../collections/ssrExcludeSet"
import { renderCheckExcludeSet } from "../collections/renderCheckExcludeSet"
import { multipleSelectionTargets } from "../collections/multipleSelectionTargets"

createEffect(() => {
    const [selectionTarget] = selectionTargetPtr
    const isMeshAppendable = selectionTarget && "object3d" in selectionTarget
    if (isMeshAppendable && !selectionTarget.object3d.parent) return

    const target = isMeshAppendable ? selectionTarget.object3d : undefined
    if (!target) return

    const boxHelper = new BoxHelper(target)
    const frame = requestAnimationFrame(() => scene.add(boxHelper))
    addUpdateSystem(boxHelper)
    ssrExcludeSet.add(boxHelper)
    renderCheckExcludeSet.add(boxHelper)

    return () => {
        cancelAnimationFrame(frame)
        scene.remove(boxHelper)
        deleteUpdateSystem(boxHelper)
        boxHelper.dispose()
        ssrExcludeSet.delete(boxHelper)
        renderCheckExcludeSet.delete(boxHelper)
    }
}, [getSelectionTarget])

createEffect(() => {
    if (!multipleSelectionTargets.size) return

    const boxHelpers: Array<BoxHelper> = []
    for (const target of multipleSelectionTargets) {
        const boxHelper = new BoxHelper(target.object3d)
        scene.add(boxHelper)
        boxHelpers.push(boxHelper)
    }

    for (const boxHelper of boxHelpers) {
        addUpdateSystem(boxHelper)
        ssrExcludeSet.add(boxHelper)
        renderCheckExcludeSet.add(boxHelper)
    }

    return () => {
        for (const boxHelper of boxHelpers) {
            deleteUpdateSystem(boxHelper)
            scene.remove(boxHelper)
            boxHelper.dispose()
            ssrExcludeSet.delete(boxHelper)
            renderCheckExcludeSet.delete(boxHelper)
        }
    }
}, [getMultipleSelectionTargets])
