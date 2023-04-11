import { useState } from "preact/hooks"
import useSyncState from "../hooks/useSyncState"
import { getDummyIK } from "../../states/useDummyIK"
import IDummyIK from "../../interface/IDummyIK"
import { draggingItemPtr } from "../../pointers/draggingItemPtr"
import { Object3D } from "three"
import unsafeSetValue from "../../utils/unsafeSetValue"

type JointProps = {
    x: number
    y: number
    name: keyof IDummyIK
    onMouseMove?: (e: MouseEvent) => void
    onMouseLeave?: (e: MouseEvent) => void
}

const Joint = ({ x, y, onMouseMove, onMouseLeave, name }: JointProps) => {
    const [dragOver, setDragOver] = useState(false)
    const dummyIK = useSyncState(getDummyIK)
    if (!dummyIK) return null

    return (
        <div
            style={{
                position: "absolute",
                width: 14,
                height: 14,
                left: 50 + x + "%",
                top: y + "%",
                transform: "translateX(-50%)",
                borderRadius: 20,
                border: "1px solid rgba(255, 255, 255, 0.5)",
                background: "rgba(255, 255, 255, 0.2)"
            }}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            onDragOver={(e) => {
                e.stopPropagation()
                e.preventDefault()
                draggingItemPtr[0] && setDragOver(true)
            }}
            onDragEnter={(e) => {
                e.stopPropagation()
                e.preventDefault()
                draggingItemPtr[0] && setDragOver(true)
            }}
            onDragLeave={(e) => {
                e.stopPropagation()
                setDragOver(false)
            }}
            onDrop={(e) => {
                e.stopPropagation()
                draggingItemPtr[0] instanceof Object3D &&
                    unsafeSetValue(dummyIK, name, draggingItemPtr[0].name)
            }}
        />
    )
}

export default Joint