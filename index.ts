import readline from 'node:readline/promises'
import path from 'node:path'
import fs from 'node:fs'
;(async () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  try {
    // NOTE: the second parameter (the timeout) is optional.
    const answer = await rl.question('Path to the audio file ', {
      signal: AbortSignal.timeout(10_000) // 10s timeout
    })

    const filePath = path.resolve(answer)

    switch (answer.toLowerCase()) {
      case 'y':
        console.log('Super!')
        break
      case 'n':
        console.log('Sorry! :(')
        break
      default:
        console.log('Invalid answer!')
    }
  } finally {
    rl.close()
  }
})()
