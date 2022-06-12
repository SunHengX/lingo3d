import { event } from "@lincode/events"
import { createEffect } from "@lincode/reactivity"
import { debounce } from "@lincode/utils"
import Appendable from "../api/core/Appendable"
import { getCameraRendered } from "../states/useCameraRendered"
import { getSelectionTarget } from "../states/useSelectionTarget"
import { onSceneGraphChange } from "./onSceneGraphChange"

const [_emitSelectionTarget, onSelectionTarget] = event<{ target?: Appendable, rightClick?: boolean }>()
const emitSelectionTarget = debounce((target?: Appendable, rightClick?: boolean) => (
    _emitSelectionTarget({ target, rightClick })
), 0, "trailing")

export { emitSelectionTarget, onSelectionTarget }

getCameraRendered(() => emitSelectionTarget())

createEffect(() => {
    const target = getSelectionTarget()
    if (!target) return

    const handle = onSceneGraphChange(() => {
        !target.outerObject3d.parent && emitSelectionTarget()
    })
    return () => {
        handle.cancel()
    }
}, [getSelectionTarget])