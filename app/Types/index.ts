export type DocsJsonSchema = DocsJsonSchemaItem[]

export interface DocsJsonSchemaItem {
  NativeClass: string

  Classes: Record<string, any>[]
}

export * from './PowerPlanner'
export * from './ProductionPlanner'
