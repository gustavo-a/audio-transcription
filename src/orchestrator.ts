import readline from 'node:readline/promises'

import transcribe from '@/transcribe'
import formatAndValidate from '@/input'
import createOutput from '@/output'

//
const init = async () => {
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

    const input = formatAndValidate({
      filePath,
      prompt,
      language,
      temperature,
      responseFormat
    })

    const transcribedText = await transcribe(input)

    if (!transcribedText) return

    createOutput({
      content: transcribedText,
      outputType: input.responseFormat
    })
  } finally {
    rl.close()
  }
}

export default init
