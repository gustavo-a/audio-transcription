import OpenAI from 'openai'

declare global {
  interface ITranscriptionResponse {
    text: string
  }

  type CreateOutputOptions = {
    content: OpenAI.Audio.Transcription[]
    outputType: TranscribeOptions['responseFormat']
  }

  type TranscribeOptions = {
    filePath: string
    prompt?: OpenAI.Audio.TranscriptionCreateParams['prompt']
    language?: OpenAI.Audio.TranscriptionCreateParams['language']
    temperature?: OpenAI.Audio.TranscriptionCreateParams['temperature']
    responseFormat?: OpenAI.Audio.TranscriptionCreateParams['response_format']
  }

  type InputOptions = {
    filePath: string
    prompt?: string
    language?: string
    temperature?: string
    responseFormat?: string
  }

  declare const formatInput: (options: InputOptions) => TranscribeOptions

  declare const transcribe: (
    opts: TranscribeOptions
  ) => Promise<string[] | undefined>
}

export {}
