import Appendable from "../api/core/Appendable"

export const runtimeSchemaMap = new WeakMap<Appendable, Record<string, any>>()
export const runtimeIncludeKeysMap = new WeakMap<Appendable, Set<string>>()