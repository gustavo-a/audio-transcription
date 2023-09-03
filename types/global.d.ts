export type TranscribeOptions = {
  filePath: string
  prompt?: string
  language?: string
  temperature?: string
  response_format?: 'json' | 'text' | 'srt' | 'verbose_json' | 'vtt'
}

export interface ITranscriptionResponse {
  text: string
}

export interface ITranscribe {
  (opts: TranscribeOptions): Promise<string[] | undefined>
}

export type CreateOutputOptions = {
  content: string[]
  outputType: TranscribeOptions['responseFormat']
}
