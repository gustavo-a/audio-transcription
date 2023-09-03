import path from 'node:path'
import fs from 'node:fs'

import ISO6391 from 'iso-639-1'

const formatAndValidate = (opts: InputOptions) => {
  const resolvedPath = path.resolve(opts.filePath)

  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`File not found: ${resolvedPath}`)
  }

  if (opts.temperature && isNaN(opts.temperature as any)) {
    throw new Error(`Invalid temperature: ${opts.temperature}`)
  }

  // Stay between 0 and 1
  const formattedTemperature =
    Number(opts.temperature) > 1
      ? 1
      : Number(opts.temperature) < 0
      ? 0
      : Number(opts.temperature)

  // Validate language code
  if (opts.language && ISO6391.validate(opts.language) === false) {
    throw new Error(`Invalid language code: ${opts.language}`)
  }

  if (!isValidResponseFormat(opts.responseFormat)) {
    throw new Error(`Invalid response format: ${opts.responseFormat}`)
  }

  return {
    filePath: resolvedPath,
    prompt: opts.prompt,
    language: opts.language,
    temperature: formattedTemperature,
    responseFormat: opts.responseFormat as TranscribeOptions['responseFormat']
  }
}

const isValidResponseFormat = (
  format?: string
): format is TranscribeOptions['responseFormat'] => {
  return true
}

export default formatAndValidate
