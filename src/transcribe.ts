import path from 'node:path'
import fs from 'node:fs'
import FormData from 'form-data'

import api from '@/api'

import { AxiosError } from 'axios'
import { ITranscribe, ITranscriptionResponse } from '@_types/global'

const transcribe: ITranscribe = async opts => {
  try {
    const resolvedPath = path.resolve(opts.filePath)

    if (!fs.existsSync(resolvedPath)) {
      throw new Error(`File not found: ${resolvedPath}`)
    }

    const audioFile = fs.readFileSync(resolvedPath)

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

    return response.data.text
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
