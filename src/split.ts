import fs from 'node:fs'
import tmp from 'tmp-promise'
import ffmpeg from 'fluent-ffmpeg'

import { promisify } from 'node:util'

const statAsync = promisify(fs.stat)

// Função para dividir o arquivo em chunks de tamanho máximo (em MB) usando fluent-ffmpeg
export default async function splitAudio(
  filePath: string,
  maxFileSizeMB: number
): Promise<string[]> {
  const chunks = []
  const chunkSizeBytes = maxFileSizeMB * 1024 * 1024 // Convertendo MB para bytes

  const stats = await statAsync(filePath)
  const fileSizeBytes = stats.size

  if (fileSizeBytes <= chunkSizeBytes) {
    // O arquivo é menor ou igual a 25 MB, não precisa ser dividido
    return [filePath]
  }

  const numChunks = Math.ceil(fileSizeBytes / chunkSizeBytes)

  const totalDurationSeconds = await calcTotalAudioDuration(filePath)

  console.log(
    `Dividindo o arquivo em ${numChunks} chunks de ${chunkSizeBytes} bytes`
  )

  console.log(
    `O arquivo possui ${totalDurationSeconds} segundos de duração\n\n`
  )

  const chunkDurationSeconds = Math.ceil(totalDurationSeconds / numChunks)

  let offsetSeconds = 0
  let chunkNumber = 0

  console.log('Dividindo arquivo em chunks...\n\n')

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

// Função para criar um chunk temporário com a biblioteca 'tmp'
async function createTempChunk(n: number) {
  return tmp.file({ prefix: `AudioTranscription-${n}`, postfix: '.ogg' })
}

// Função para dividir um chunk específico usando fluent-ffmpeg
async function divideChunk(
  filePath: string,
  chunkPath: string,
  offset: number,
  duration: number
): Promise<void> {
  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(filePath)
      .seekInput(offset) // Offset em segundos
      .duration(duration) // Tamanho em segundos
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
