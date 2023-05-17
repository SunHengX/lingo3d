import { Cancellable } from "@lincode/promiselikes"
import { onBeforeRender } from "../../events/onBeforeRender"
import Appendable from "../../display/core/Appendable"

export default <T extends Appendable | object>(
    cb: (target: T) => void,
    ticker = onBeforeRender
) => {
    const queued = new Set<T>()

    const execute = () => {
        for (const target of queued) cb(target)
    }

    let handle: Cancellable | undefined
    const start = () => (handle = ticker(execute))

    const deleteSystem = (item: T) => {
        if (!queued.delete(item)) return
        "$deleteSystemSet" in item && item.$deleteSystemSet.delete(deleteSystem)
        queued.size === 0 && handle?.cancel()
    }
    return <const>[
        (item: T) => {
            if (queued.has(item)) return
            queued.add(item)
            "$deleteSystemSet" in item &&
                item.$deleteSystemSet.add(deleteSystem)
            if (queued.size === 1) start()
        },
        deleteSystem
    ]
}
