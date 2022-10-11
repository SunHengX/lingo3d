import { last, omit } from "@lincode/utils"
import { FolderApi, Pane } from "tweakpane"
import mainCamera from "../../engine/mainCamera"
import { setOrbitControls } from "../../states/useOrbitControls"
import { useEffect, useLayoutEffect, useState } from "preact/hooks"
import register from "preact-custom-element"
import {
    useSelectionTarget,
    useCameraList,
    useMultipleSelectionTargets,
    useCameraStack,
    useNodeEditor,
    useSetupStack
} from "../states"
import { Cancellable } from "@lincode/promiselikes"
import {
    getSecondaryCamera,
    setSecondaryCamera
} from "../../states/useSecondaryCamera"
import mainOrbitCamera from "../../engine/mainOrbitCamera"
import getComponentName from "../utils/getComponentName"
import addInputs, { setProgrammatic } from "./addInputs"
import getParams from "./getParams"
import splitObject from "./splitObject"
import { onTransformControls } from "../../events/onTransformControls"
import assignIn from "./assignIn"
import { emitSceneGraphNameChange } from "../../events/onSceneGraphNameChange"
import { dummyDefaults } from "../../interface/IDummy"
import useInit from "../utils/useInit"
import {
    decreaseEditorMounted,
    increaseEditorMounted
} from "../../states/useEditorMounted"
import useHotkeys from "./useHotkeys"
import settings from "../../api/settings"
import Setup, { dataSetupMap } from "../../display/Setup"
import addSetupInputs from "./addSetupInputs"
import Tab from "../component/Tab"
import AppBar from "../component/AppBar"
import { emitSelectionTarget } from "../../events/onSelectionTarget"

Object.assign(dummyDefaults, {
    stride: { x: 0, y: 0 }
})

const Editor = () => {
    const elRef = useInit()
    useHotkeys()

    useLayoutEffect(() => {
        window.onbeforeunload = confirmExit
        function confirmExit() {
            return "Are you sure you want to close the current page?"
        }

        mainOrbitCamera.active = true
        setOrbitControls(true)
        settings.gridHelper = true
        increaseEditorMounted()

        return () => {
            setOrbitControls(false)
            settings.gridHelper = false
            decreaseEditorMounted()
        }
    }, [])

    const [cameraStack] = useCameraStack()
    const camera = last(cameraStack)!
    const [cameraList] = useCameraList()

    const [pane, setPane] = useState<Pane>()
    const [cameraFolder, setCameraFolder] = useState<FolderApi>()

    useLayoutEffect(() => {
        if (!pane || !cameraFolder) return

        const mainCameraName = "editor camera"

        const options = cameraList.reduce<Record<string, any>>(
            (acc, cam, i) => {
                acc[
                    i === 0
                        ? mainCameraName
                        : getComponentName(cam.userData.manager)
                ] = i
                return acc
            },
            {}
        )
        const cameraInput = pane.addInput(
            { camera: cameraList.indexOf(camera) },
            "camera",
            { options }
        )
        cameraFolder.add(cameraInput)
        cameraInput.on("change", ({ value }) => {
            cameraList[value].userData.manager.active = true
        })

        const secondaryOptions: any = {
            none: 0,
            ...omit(options, mainCameraName)
        }
        const secondaryCameraInput = pane.addInput(
            {
                "secondary camera": cameraList.indexOf(
                    getSecondaryCamera() ?? mainCamera
                )
            },
            "secondary camera",
            { options: secondaryOptions }
        )
        cameraFolder.add(secondaryCameraInput)
        secondaryCameraInput.on("change", ({ value }) =>
            setSecondaryCamera(value === 0 ? undefined : cameraList[value])
        )

        return () => {
            cameraInput.dispose()
            secondaryCameraInput.dispose()
        }
    }, [pane, cameraFolder, cameraList, camera])

    const [setupStack] = useSetupStack()
    const lastSetup = last(setupStack)
    const targetSetup = (lastSetup && dataSetupMap.get(lastSetup)) ?? settings

    const [selectionTarget] = useSelectionTarget()
    const [multipleSelectionTargets] = useMultipleSelectionTargets()

    const [tab, setTab] = useState<string | undefined>(undefined)

    useEffect(() => {
        const el = elRef.current
        if (!el) return

        const pane = new Pane({ container: el })
        setPane(pane)
        setCameraFolder(pane.addFolder({ title: "camera" }))

        if (!selectionTarget || selectionTarget instanceof Setup) {
            addSetupInputs(pane, selectionTarget ?? targetSetup)
            return () => {
                pane.dispose()
            }
        }

        const target = selectionTarget as any
        const handle = new Cancellable()

        if (!multipleSelectionTargets.length) {
            const { schema, defaults, componentName } = target.constructor

            const [generalParams, generalRest] = splitObject(
                omit(getParams(schema, defaults, target), [
                    "rotation",
                    "innerRotation",
                    "frustumCulled",
                    "minAzimuthAngle",
                    "maxAzimuthAngle"
                ]),
                ["name", "id", "physics", "gravity"]
            )
            if (generalParams) {
                const { name: nameInput } = addInputs(
                    pane,
                    "general",
                    target,
                    defaults,
                    generalParams
                )
                nameInput?.on("change", () => emitSceneGraphNameChange())
            }

            const [transformParams0, transformRest] = splitObject(generalRest, [
                "x",
                "y",
                "z",
                "rotationX",
                "rotationY",
                "rotationZ",
                "scale",
                "scaleX",
                "scaleY",
                "scaleZ",
                "innerX",
                "innerY",
                "innerZ",
                "innerRotationX",
                "innerRotationY",
                "innerRotationZ",
                "width",
                "height",
                "depth"
            ])
            if (transformParams0) {
                const [innerTransformParams, transformParams] = splitObject(
                    transformParams0,
                    [
                        "innerX",
                        "innerY",
                        "innerZ",
                        "innerRotationX",
                        "innerRotationY",
                        "innerRotationZ",
                        "width",
                        "height",
                        "depth"
                    ]
                )
                addInputs(pane, "transform", target, defaults, transformParams)
                innerTransformParams &&
                    addInputs(
                        pane,
                        "inner transform",
                        target,
                        defaults,
                        innerTransformParams
                    )

                handle.watch(
                    onTransformControls(() => {
                        setProgrammatic()
                        assignIn(transformParams, target, [
                            "x",
                            "y",
                            "z",
                            "rotationX",
                            "rotationY",
                            "rotationZ",
                            "scaleX",
                            "scaleY",
                            "scaleZ"
                        ])
                        pane.refresh()
                    })
                )
            }

            const [displayParams, displayRest] = splitObject(transformRest, [
                "visible",
                "innerVisible",
                "castShadow",
                "receiveShadow"
            ])
            displayParams &&
                addInputs(pane, "display", target, defaults, displayParams)

            const [effectsParams, effectsRest] = splitObject(displayRest, [
                "bloom",
                "outline"
            ])
            effectsParams &&
                addInputs(pane, "effects", target, defaults, effectsParams)

            const [animationParams, animationRest] = splitObject(effectsRest, [
                "animation",
                "animationPaused",
                "animationRepeat"
            ])
            animationParams &&
                addInputs(pane, "animation", target, defaults, animationParams)

            const [adjustMaterialParams, adjustMaterialRest] = splitObject(
                animationRest,
                [
                    "metalnessFactor",
                    "roughnessFactor",
                    "opacityFactor",
                    "envFactor",
                    "adjustColor",
                    "reflection"
                ]
            )
            adjustMaterialParams &&
                addInputs(
                    pane,
                    "adjust material",
                    target,
                    defaults,
                    adjustMaterialParams
                )

            const [materialParams, materialRest] = splitObject(
                adjustMaterialRest,
                [
                    "opacity",
                    "color",
                    "texture",
                    "textureRepeat",
                    "textureFlipY",
                    "textureRotation",
                    "videoTexture",
                    "wireframe"
                ]
            )
            materialParams &&
                addInputs(pane, "material", target, defaults, materialParams)

            const [pbrMaterialParams, pbrMaterialRest] = splitObject(
                materialRest,
                [
                    "metalnessMap",
                    "metalness",
                    "roughnessMap",
                    "roughness",
                    "normalMap",
                    "normalScale",
                    "bumpMap",
                    "bumpScale",
                    "displacementMap",
                    "displacementScale",
                    "displacementBias",
                    "aoMap",
                    "aoMapIntensity",
                    "lightMap",
                    "lightMapIntensity",
                    "emissive",
                    "emissiveIntensity",
                    "envMap",
                    "envMapIntensity",
                    "alphaMap"
                ]
            )
            pbrMaterialParams &&
                addInputs(
                    pane,
                    "pbr material",
                    target,
                    defaults,
                    pbrMaterialParams
                )

            if (componentName === "dummy") {
                pbrMaterialRest.stride = {
                    x: target.strideRight,
                    y: -target.strideForward
                }
                const { stride: strideInput } = addInputs(
                    pane,
                    componentName,
                    target,
                    defaults,
                    pbrMaterialRest
                )
                strideInput.on("change", ({ value }) => {
                    Object.assign(pbrMaterialRest, {
                        strideForward: -value.y,
                        strideRight: value.x
                    })
                    pane.refresh()
                })
            } else if (Object.keys(pbrMaterialRest).length)
                addInputs(
                    pane,
                    componentName,
                    target,
                    defaults,
                    pbrMaterialRest
                )
        }

        return () => {
            handle.cancel()
            pane.dispose()
        }
    }, [selectionTarget, multipleSelectionTargets, targetSetup])

    return (
        <div
            className="lingo3d-ui lingo3d-bg"
            style={{
                width: 300,
                height: "100%",
                display: "flex",
                flexDirection: "column"
            }}
        >
            <AppBar onSelectTab={setTab}>
                <Tab>World</Tab>
                {selectionTarget && (
                    <Tab
                        selected
                        onClose={(selected) =>
                            selected && emitSelectionTarget(undefined)
                        }
                    >
                        {getComponentName(selectionTarget)}
                    </Tab>
                )}
            </AppBar>
            <div style={{ flexGrow: 1, overflow: "scroll" }} ref={elRef} />
        </div>
    )
}

const EditorParent = () => {
    const [nodeEditor] = useNodeEditor()

    if (nodeEditor) return null

    return <Editor />
}
export default EditorParent

register(EditorParent, "lingo3d-editor")
