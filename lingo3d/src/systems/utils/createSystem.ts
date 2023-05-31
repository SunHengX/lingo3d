import { Cancellable } from "@lincode/promiselikes"
import type Appendable from "../../display/core/Appendable"
import { onBeforeRender } from "../../events/onBeforeRender"
import { onAfterRender } from "../../events/onAfterRender"
import { onRender } from "../../events/onRender"
import { onLoop } from "../../events/onLoop"
import { assertExhaustive } from "@lincode/utils"
import { createSetupSystem } from "./createSetupSystem"

type Ticker =
    | "beforeRender"
    | "afterRender"
    | "render"
    | "loop"
    | typeof onBeforeRender

type SetupTicker = Ticker | typeof queueMicrotask | [() => Promise<void>]

const mapTicker = (ticker: Ticker) => {
    if (typeof ticker === "function") return ticker
    switch (ticker) {
        case "beforeRender":
            return onBeforeRender
        case "afterRender":
            return onAfterRender
        case "render":
            return onRender
        case "loop":
            return onLoop
        default:
            assertExhaustive(ticker)
    }
}

const isQueueMicrotastk = (ticker: any): ticker is typeof queueMicrotask =>
    ticker === queueMicrotask

const mapSetupTicker = (ticker: SetupTicker) => {
    if (Array.isArray(ticker)) return (cb: () => void) => ticker[0]().then(cb)
    if (isQueueMicrotastk(ticker)) return ticker
    return mapTicker(ticker)
}

type Options<
    GameObject extends object | Appendable,
    Data extends Record<string, any> | void
> = {
    data?: Data | ((gameObject: GameObject) => Data)
    setup?: (gameObject: GameObject, data: Data) => void | false | (() => void)
    cleanup?: (gameObject: GameObject, data: Data) => void
    update?: (gameObject: GameObject, data: Data) => void
    ticker?: Ticker
    setupTicker?: SetupTicker
    beforeTick?: (queued: Map<GameObject, Data> | Set<GameObject>) => void
    afterTick?: (queued: Map<GameObject, Data> | Set<GameObject>) => void
    sort?: (a: GameObject, b: GameObject) => number
}

const placeholderFn = () => {}

export default <
    GameObject extends object | Appendable,
    Data extends Record<string, any> | void
>({
    data,
    setup,
    cleanup,
    update,
    ticker,
    setupTicker = queueMicrotask,
    beforeTick,
    afterTick,
    sort
}: Options<GameObject, Data>) => {
    const queued = new Map<GameObject, Data>()

    const [addSetupSystem, deleteSetupSystem] = setup
        ? createSetupSystem(setup, cleanup, mapSetupTicker(setupTicker))
        : [placeholderFn, placeholderFn]

    const execute =
        beforeTick || afterTick
            ? sort
                ? () => {
                      beforeTick?.(queued)
                      for (const target of [...queued.keys()].sort(sort))
                          update!(target, queued.get(target)!)
                      afterTick?.(queued)
                  }
                : () => {
                      beforeTick?.(queued)
                      for (const [target, data] of queued) update!(target, data)
                      afterTick?.(queued)
                  }
            : sort
            ? () => {
                  for (const target of [...queued.keys()].sort(sort))
                      update!(target, queued.get(target)!)
              }
            : () => {
                  for (const [target, data] of queued) update!(target, data)
              }

    let handle: Cancellable | undefined
    const onEvent = mapTicker(ticker ?? "beforeRender")
    const start = update && (() => (handle = onEvent(execute)))

    const deleteSystem = update
        ? (item: GameObject) => {
              deleteSetupSystem(item)
              if (!queued.delete(item)) return
              "$deleteSystemSet" in item &&
                  item.$deleteSystemSet.delete(deleteSystem)
              queued.size === 0 && handle?.cancel()
          }
        : (item: GameObject) => {
              deleteSetupSystem(item)
              queued.delete(item)
          }

    const tryAddSetupSystem = (item: GameObject, initData?: Data) => {
        const _data =
            initData ??
            queued.get(item) ??
            (typeof data === "function"
                ? data(item)
                : data
                ? { ...data }
                : undefined)
        addSetupSystem(item, _data)
        return _data
    }

    const addSystem = update
        ? (item: GameObject, initData?: Data) => {
              const _data = tryAddSetupSystem(item, initData)
              if (queued.has(item)) {
                  queued.set(item, _data)
                  return
              }
              queued.set(item, _data)
              "$deleteSystemSet" in item &&
                  item.$deleteSystemSet.add(deleteSystem)
              queued.size === 1 && start!()
          }
        : (item: GameObject, initData?: Data) =>
              queued.set(item, tryAddSetupSystem(item, initData))

    return {
        add: addSystem,
        delete: deleteSystem
    }
}