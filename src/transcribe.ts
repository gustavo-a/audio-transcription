import fs from 'node:fs'

import api from '@/api'
import splitAudio from '@/split'

const transcribe = async (opts: TranscribeOptions) => {
  try {
    const chunkPaths = await splitAudio(opts.filePath, 20)

    const textPieces = []

    // Send each chunk to transcribe
    for (const chunkPath of chunkPaths) {
      const audioFile = fs.createReadStream(chunkPath)

      console.log(`Transcribing chunk: ${chunkPath}`)

      const response = await api.audio.transcriptions.create(
        {
          model: 'whisper-1',
          file: audioFile,
          response_format: opts.responseFormat,
          language: opts.language,
          prompt: opts.prompt,
          temperature: opts.temperature
        },
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      console.log('Transcribed successfully\n\n')

      textPieces.push(response)
    }

    return textPieces
  } catch (error) {
    console.error('Error transcribing audio file: \n', error)
  }
}

export default transcribe
