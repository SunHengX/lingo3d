import { onBeforeRender } from "../../events/onBeforeRender"

export default <T extends object>(
    cb: (target: T) => void,
    ticker: typeof onBeforeRender | typeof queueMicrotask = queueMicrotask
) => {
    const queued = new Set<T>()

    const execute = () => {
        for (const target of queued) cb(target)
        queued.clear()
        started = false
    }

    let started = false
    const start = () => {
        if (started) return
        started = true
        ticker(execute, true)
    }

    return <const>[
        (item: T) => {
            start()
            queued.add(item)
        },
        (item: T) => void queued.delete(item)
    ]
}