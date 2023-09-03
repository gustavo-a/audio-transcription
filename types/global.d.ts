declare global {
  interface ITranscriptionResponse {
    text: string
  }

  type CreateOutputOptions = {
    content: string[]
    outputType: TranscribeOptions['responseFormat']
  }

  type TranscribeOptions = {
    filePath: string
    prompt?: string
    language?: string
    temperature?: string
    response_format?: 'json' | 'text' | 'srt' | 'verbose_json' | 'vtt'
  }

  declare const transcribe: (
    opts: TranscribeOptions
  ) => Promise<string[] | undefined>
}

export {}
