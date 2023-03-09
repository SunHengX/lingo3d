import { Signal } from "@preact/signals"
import { memo, useMemo } from "preact/compat"
import { TimelineContextMenuPosition } from "."
import { FRAME_WIDTH, FRAME_HEIGHT } from "../../globals"
import useStopPropagation from "../hooks/useStopPropagation"
import diffProps from "../utils/diffProps"

const colors = [
    "#D50000",
    "#C51162",
    "#AA00FF",
    "#6200EA",
    "#304FFE",
    "#2962FF",
    "#0091EA",
    "#00B8D4",
    "#00BFA5",
    "#00C853",
    "#64DD17",
    "#AEEA00",
    "#FFD600",
    "#FFAB00",
    "#FF6D00",
    "#DD2C00"
]
let colorIndex = 0

type FrameTweenProps = {
    frameNum: number
    frameNums: Array<number>
    index: number
    positionSignal: Signal<TimelineContextMenuPosition>
}

const FrameTween = ({
    frameNum,
    frameNums,
    index,
    positionSignal
}: FrameTweenProps) => {
    const background = useMemo(() => {
        if (++colorIndex === colors.length) colorIndex = 0
        return colors[colorIndex]
    }, [])

    const stopRef = useStopPropagation()

    return (
        <div
            className="lingo3d-flexcenter"
            style={{
                width:
                    Math.max((frameNums[index + 1] ?? frameNum) - frameNum, 1) *
                    FRAME_WIDTH,
                height: FRAME_HEIGHT,
                position: "absolute",
                left: frameNum * FRAME_WIDTH,
                opacity: 0.5
            }}
        >
            <div
                style={{
                    width: "100%",
                    height: 4,
                    background
                }}
            />
            <div
                ref={stopRef}
                className="lingo3d-flexcenter"
                style={{
                    position: "absolute",
                    width: FRAME_WIDTH,
                    height: FRAME_HEIGHT,
                    left: 0,
                    top: 0
                }}
                onContextMenu={(e) =>
                    (positionSignal.value = {
                        x: e.clientX,
                        y: e.clientY,
                        keyframe: true
                    })
                }
            >
                <div
                    style={{
                        width: 8,
                        height: 8,
                        border: "1px solid rgba(255, 255, 255, 1)",
                        background,
                        borderRadius: 8
                    }}
                />
            </div>
        </div>
    )
}

export default memo(FrameTween, diffProps)
