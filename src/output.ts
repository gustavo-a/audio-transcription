import fs from 'node:fs'
import path from 'node:path'

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

  fs.writeFileSync(
    path.join(process.cwd(), 'output', fileName),
    content.join('\n'),
    {
      encoding: 'utf8',
      flag: 'a'
    }
  )
}
