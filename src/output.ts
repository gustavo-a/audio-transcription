import fs from 'node:fs'
import path from 'node:path'
import { Transcription } from 'openai/resources/audio/transcriptions.mjs'

/**
 * This function creates a new file in the `output` directory.
 * The file will have the chosen file type and the transcribed audio content.d
 */

export default function createOutput({
  content,
  outputType
}: CreateOutputOptions) {
  const extension =
    !outputType || outputType === 'verbose_json'
      ? 'json'
      : outputType === 'text'
      ? 'txt'
      : outputType

  const fileName = `transcription-${Date.now()}.${extension}`

  const formattedContent = formatOutput(content, outputType)

  fs.writeFileSync(
    path.join(process.cwd(), 'output', fileName),
    formattedContent,
    {
      encoding: 'utf8',
      flag: 'a'
    }
  )
}

const formatOutput = (
  output: Transcription[] | string[],
  format: CreateOutputOptions['outputType']
) => {
  if (format === 'json' || format === 'verbose_json') {
    return JSON.stringify(output, null, 2)
  }

  return output.join('\n\n')
}
