import type { SearchParams, Results, Nullable } from '@orama/orama'

export type Optional<T = unknown> = T | undefined

export interface SearchEvent {
  rawSearchString?: string
  query: SearchParams
  resultsCount: number
  roundTripTime: number
  searchedAt: Date
  cached?: boolean
}

export interface ICollector {
  endpoint: string
  deploymentID: string
  index: string
}

export interface OramaInitResponse {
  orama: string
  deploymentID: string
  deploymentDatetime: string
  collectUrl: string
  index: string
}

export interface IOramaClient {
  api_key: string
  endpoint: string
  telemetry?: Partial<TelemetryConfig> | false
  cache?: Partial<CacheConfig> | false
}

export interface TelemetryConfig {
  flushInterval: number
  flushSize: number
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CacheConfig {}

export interface HeartBeatConfig {
  frequency: number
}

export type Endpoint = 'search' | 'init' | 'info' | 'health'

export type Method = 'GET' | 'POST'

export interface IOramaCloudData {
  endpoint: string
  apiKey: string
}

export interface IUseSearch {
  ready: boolean
  results: Nullable<Results>
  error: Nullable<Error>
}
