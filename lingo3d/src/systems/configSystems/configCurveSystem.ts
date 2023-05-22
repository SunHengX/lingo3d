import { BufferAttribute, BufferGeometry, Line, LineBasicMaterial } from "three"
import Curve from "../../display/Curve"
import configSystemWithCleanUp2 from "../utils/configSystemWithCleanUp2"
import getVecOnCurve from "../../display/utils/getVecOnCurve"
import { point2Vec } from "../../display/utils/vec2Point"
import HelperSphere from "../../display/core/utils/HelperSphere"
import { getSelectionCandidates } from "../../throttle/getSelectionCandidates"
import getCurveHelperSpherePool from "../../memo/getCurveHelperSpherePool"

export const [addConfigCurveSystem] = configSystemWithCleanUp2(
    (self: Curve) => {
        const segments = self.points.length * self.subdivide
        const bufferAttribute = new BufferAttribute(
            new Float32Array(segments * 3),
            3
        )
        const geometry = (self.$geometry = new BufferGeometry())
        geometry.setAttribute("position", bufferAttribute)
        self.outerObject3d.add(
            (self.$mesh = new Line(
                geometry,
                (self.$material = new LineBasicMaterial({
                    color: 0xff0000
                }))
            ))
        )
        if (self.points.length < 2)
            for (let i = 0; i < segments; ++i)
                bufferAttribute.setXYZ(i, 0, 0, 0)
        else {
            const vecs = self.points.map(point2Vec)
            for (let i = 0; i < segments; ++i) {
                const t = i / (segments - 1)
                const vec = getVecOnCurve(vecs, t)
                bufferAttribute.setXYZ(i, vec.x, vec.y, vec.z)
            }
        }
        if (!self.helper) return
        const [requestHelperSphere] = getCurveHelperSpherePool(self)
        for (const pt of self.points) requestHelperSphere([pt.x, pt.y, pt.z])
        getSelectionCandidates()
    },
    (self) => {
        self.$geometry!.dispose()
        self.$material!.dispose()
        self.outerObject3d.remove(self.$mesh!)
        if (!self.children) return
        const [, releaseHelperSphere] = getCurveHelperSpherePool(self)
        for (const child of self.children)
            child instanceof HelperSphere && releaseHelperSphere(child)
    }
)
