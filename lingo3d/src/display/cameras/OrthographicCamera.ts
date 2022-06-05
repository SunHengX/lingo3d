import { OrthographicCamera as ThreeOrthographicCamera } from "three"
import { camFar } from "../../engine/constants"
import ICamera from "../../interface/ICamera"
import { getResolution } from "../../states/useResolution"
import CameraBase from "../core/CameraBase"

export const frustum = 5.7

//@ts-ignore
export default class OrthographicCamera extends CameraBase<ThreeOrthographicCamera> implements ICamera {
    public constructor() {
        const [w, h] = getResolution()
        const aspect = w / h

        super(new ThreeOrthographicCamera(
            aspect * frustum * -0.5, aspect * frustum * 0.5, frustum * 0.5, frustum * -0.5, -1, camFar
        ))
    }
}