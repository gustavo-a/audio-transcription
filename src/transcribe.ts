import path from 'node:path'
import fs from 'node:fs'
import FormData from 'form-data'

import api from '@/api'
import splitAudio from '@/split'

import { AxiosError } from 'axios'

const transcribe = async (opts: TranscribeOptions) => {
  try {
    const resolvedPath = path.resolve(opts.filePath)

    if (!fs.existsSync(resolvedPath)) {
      throw new Error(`File not found: ${resolvedPath}`)
    }

    const chunkPaths = await splitAudio(resolvedPath, 20)

    const textPieces = ['']

    // Envia cada chunk para transcrição
    for (const chunkPath of chunkPaths) {
      const audioFile = fs.readFileSync(chunkPath)

      console.log(`Transcribing chunk: ${chunkPath}`)

      const form = new FormData()

      form.append('model', 'whisper-1')

      for (const [key, value] of Object.entries(opts)) {
        if (key === 'filePath') continue

        form.append(key, value)
      }

      form.append('file', audioFile, { filename: 'audio.ogg' })

      const response = await api.post<ITranscriptionResponse>(
        '/audio/transcriptions',
        form,
        {
          headers: {
            ...form.getHeaders()
          }
        }
      )

      console.log('Transcribed successfully\n\n')

      textPieces.push(response.data.text)
    }

    return textPieces
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        `Error transcribing audio file:\n${error.message}, status: ${error.response?.status}`
      )
    } else {
      console.error('Error transcribing audio file: \n', error)
    }
  }
}

export default transcribe
