import { assert, forceGet } from "@lincode/utils"
import { FileLoader } from "three"
import { handleProgress } from "./bytesLoaded"

const cache = new Map<string, Promise<Record<string, any> | Array<any>>>()
const loader = new FileLoader()

export default (url: string) =>
    forceGet(
        cache,
        url,
        () =>
            new Promise<Record<string, any> | Array<any>>((resolve, reject) => {
                loader.load(
                    url,
                    (data) => {
                        try {
                            assert(typeof data === "string")
                            resolve(Object.freeze(JSON.parse(data)))
                        } catch {}
                    },
                    handleProgress(url),
                    reject
                )
            })
    )
