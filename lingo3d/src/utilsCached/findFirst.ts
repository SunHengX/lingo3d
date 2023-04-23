import { PropertyBinding } from "three"
import computeOnce2 from "./utils/computeOnce2"
import { getFoundManager } from "../api/utils/getFoundManager"
import Model from "../display/Model"
import { indexChildrenNames } from "./indexChildrenNames"

export default computeOnce2((self: Model, name: string) => {
    const sanitized = PropertyBinding.sanitizeNodeName(name)
    for (const child of indexChildrenNames(self.loadedObject3d!).values())
        if (child.name.startsWith(sanitized))
            return getFoundManager(child, self)
})