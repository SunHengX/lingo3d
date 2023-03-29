import MeshAppendable from "../api/core/MeshAppendable"
import PositionedMixin from "../display/core/mixins/PositionedMixin"
import getCenter from "../display/utils/getCenter"
import { vec2Point } from "../display/utils/vec2Point"
import renderSystemWithData from "./utils/renderSystemWithData"

export const [addPlaceAtSystem, deletePlaceAtSystem] = renderSystemWithData(
    (manager: PositionedMixin, data: { target: MeshAppendable }) =>
        manager.placeAt(vec2Point(getCenter(data.target.object3d)))
)
