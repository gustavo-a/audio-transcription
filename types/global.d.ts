export type TranscribeOptions = {
  filePath: string
  prompt?: string
  language?: string
  temperature?: string
  responseFormat?: 'json' | 'text' | 'srt' | 'verbose_json' | 'vtt'
}

export interface ITranscriptionResponse {
  text: string
}

export interface ITranscribe {
  (opts: TranscribeOptions): Promise<string | undefined>
}
