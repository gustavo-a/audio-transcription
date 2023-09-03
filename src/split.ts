import fs from 'node:fs'
import tmp from 'tmp-promise'
import ffmpeg from 'fluent-ffmpeg'

import { promisify } from 'node:util'

const statAsync = promisify(fs.stat)

// Function to split file into chunks of maximum size (in MB) using fluent-ffmpeg
export default async function splitAudio(
  filePath: string,
  maxFileSizeMB: number
): Promise<string[]> {
  const chunks = []
  const chunkSizeBytes = maxFileSizeMB * 1024 * 1024 // Converting MB to bytes

  const stats = await statAsync(filePath)
  const fileSizeBytes = stats.size

  if (fileSizeBytes <= chunkSizeBytes) {
    // The file is less than or equal to maxFileSizeMB, it does not need to be split
    return [filePath]
  }

  const numChunks = Math.ceil(fileSizeBytes / chunkSizeBytes)

  const totalDurationSeconds = await calcTotalAudioDuration(filePath)

  console.log(
    `Splitting the file into ${numChunks} chunks of ${chunkSizeBytes} bytes`
  )

  console.log(`The file is ${totalDurationSeconds} seconds long\n\n`)

  const chunkDurationSeconds = Math.ceil(totalDurationSeconds / numChunks)

  let offsetSeconds = 0
  let chunkNumber = 0

  console.log('Splitting file into chunks...\n\n')

  while (offsetSeconds < fileSizeBytes && chunkNumber < numChunks) {
    console.log(
      `Offset: ${offsetSeconds}, Chunk: ${chunkNumber}, Duration: ${chunkDurationSeconds}`
    )

    const chunk = await createTempChunk(chunkNumber)

    await divideChunk(filePath, chunk.path, offsetSeconds, chunkDurationSeconds)

    chunks.push(chunk.path)

    offsetSeconds += chunkDurationSeconds
    chunkNumber++
  }

  return chunks
}

// Function to create a temporary chunk with the 'tmp-promise' library
async function createTempChunk(n: number) {
  return tmp.file({ prefix: `AudioTranscription-${n}`, postfix: '.ogg' })
}

// Function to split a specific chunk using fluent-ffmpeg
async function divideChunk(
  filePath: string,
  chunkPath: string,
  offset: number,
  duration: number
): Promise<void> {
  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(filePath)
      .seekInput(offset) // Offset in seconds
      .duration(duration) // Duration in seconds
      .audioCodec('copy')
      .videoCodec('copy')
      .on('end', () => {
        resolve()
      })
      .on('error', err => {
        reject(err)
      })
      .output(chunkPath)
      .run()
  })
}

async function calcTotalAudioDuration(caminhoArquivo: string): Promise<number> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(caminhoArquivo, (err, metadata) => {
      if (err) {
        reject(err)
      } else {
        const duration = Math.floor(metadata.format.duration as number)

        resolve(duration)
      }
    })
  })
}
