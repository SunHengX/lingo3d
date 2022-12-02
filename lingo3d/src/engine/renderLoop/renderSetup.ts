import { LinearToneMapping, NoToneMapping } from "three"
import { getExposure } from "../../states/useExposure"
import { getResolution, setResolution } from "../../states/useResolution"
import { createEffect, createNestedEffect } from "@lincode/reactivity"
import { getWebXR } from "../../states/useWebXR"
import { getRenderer } from "../../states/useRenderer"
import { getPBR } from "../../states/usePBR"
import { getSecondaryCamera } from "../../states/useSecondaryCamera"
import { VRButton } from "./VRButton"
import { getAutoMount } from "../../states/useAutoMount"
import { debounce } from "@lincode/utils"
import { getPixelRatio } from "../../states/usePixelRatio"
import { onEditorLayout } from "../../events/onEditorLayout"
import createElement from "../../utils/createElement"
import { getUILayer } from "../../states/useUILayer"

const style = createElement(`
    <style>
        .lingo3d-container {
            position: absolute;
            top: 0px;
            left: 0px;
            width: 100%;
            height: 100%;
        }
        .lingo3d-uicontainer {
            pointer-events: none;
        }
        .lingo3d-uicontainer > * {
            pointer-events: auto;
        }
    </style>
`)
document.head.appendChild(style)

const rootContainer = createElement<HTMLDivElement>(
    `<div class="lingo3d-container"></div>`
)
export const container = createElement<HTMLDivElement>(
    `<div class="lingo3d-container"></div>`
)
export const uiContainer = createElement<HTMLDivElement>(
    `<div class="lingo3d-container lingo3d-uicontainer"></div>`
)
rootContainer.appendChild(container)
container.appendChild(uiContainer)
getSecondaryCamera((cam) => {
    container.style.height = cam ? "50%" : "100%"
})
createEffect(() => {
    uiContainer.style.display =
        getSecondaryCamera() || !getUILayer() ? "none" : "block"
}, [getSecondaryCamera, getUILayer])

export const containerBounds = [container.getBoundingClientRect()]

const useResize = (el: Element) => {
    createNestedEffect(() => {
        const handleResize = () => {
            containerBounds[0] = container.getBoundingClientRect()
            setResolution(
                el === document.body
                    ? [window.innerWidth, window.innerHeight]
                    : [el.clientWidth, el.clientHeight]
            )
        }
        handleResize()

        const handleResizeDebounced = debounce(handleResize, 100, "both")
        window.addEventListener("resize", handleResizeDebounced)
        const handle = onEditorLayout(handleResizeDebounced)

        return () => {
            window.removeEventListener("resize", handleResize)
            handle.cancel()
        }
    }, [el])
}

createEffect(() => {
    const autoMount = getAutoMount()
    if (!autoMount) return

    if (typeof autoMount === "string") {
        const el = document.querySelector(autoMount)
        if (!el) return

        el.prepend(rootContainer)
        useResize(el)

        return () => {
            el.removeChild(rootContainer)
        }
    }

    if (autoMount === true) {
        document.body.prepend(rootContainer)
        useResize(document.body)

        return () => {
            document.body.removeChild(rootContainer)
        }
    }

    autoMount.prepend(rootContainer)
    useResize(autoMount)

    return () => {
        autoMount.removeChild(rootContainer)
    }
}, [getAutoMount])

createEffect(() => {
    const renderer = getRenderer()
    if (!renderer) return

    const canvas = renderer.domElement
    rootContainer.prepend(canvas)
    Object.assign(canvas.style, {
        position: "absolute",
        left: "0px",
        top: "0px"
    })
    return () => {
        rootContainer.removeChild(canvas)
    }
}, [getRenderer])

createEffect(() => {
    const renderer = getRenderer()
    if (!renderer) return

    const [w, h] = getResolution()
    renderer.setSize(w, h)
    renderer.setPixelRatio(Math.min(getPixelRatio(), devicePixelRatio))
}, [getRenderer, getResolution, getPixelRatio])

createEffect(() => {
    const renderer = getRenderer()
    if (!renderer) return

    renderer.physicallyCorrectLights = getPBR()
}, [getRenderer, getPBR])

createEffect(() => {
    const renderer = getRenderer()
    if (!renderer) return

    const exposure = getExposure()
    renderer.toneMapping = exposure !== 1 ? LinearToneMapping : NoToneMapping
    renderer.toneMappingExposure = exposure
}, [getExposure, getRenderer])

createEffect(() => {
    if (!getWebXR()) return

    const renderer = getRenderer()
    if (!renderer) return

    renderer.xr.enabled = true

    const button = VRButton.createButton(renderer)
    uiContainer.appendChild(button)

    button.ontouchstart = () => button.onclick?.(new MouseEvent("click"))

    return () => {
        renderer.xr.enabled = false
        button.remove()
    }
}, [getWebXR, getRenderer])
