import dotenv from 'dotenv'
dotenv.config()

import readline from 'node:readline/promises'

import transcribe from '@/transcribe'
import createOutput from '@/output'

import type { TranscribeOptions } from '@_types/global'

//
;(async () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  try {
    // NOTE: the second parameter (the timeout) is optional.
    const filePath = await rl.question('Path to the audio file: ')
    const prompt = await rl.question('Prompt: ')
    const language = await rl.question('Language: ')
    const temperature = await rl.question('Temperature: ')
    const responseFormat = await rl.question('Output format: ')

    const transcribedText = await transcribe({
      filePath,
      prompt,
      language,
      temperature,
      response_format: responseFormat as TranscribeOptions['response_format']
    })

    if (!transcribedText) return

    createOutput({
      content: transcribedText,
      outputType: responseFormat as TranscribeOptions['response_format']
    })
  } finally {
    rl.close()
  }
})()
