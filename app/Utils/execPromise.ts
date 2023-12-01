import { exec } from 'child_process'

export async function execPromise(command: string, showStdout = false) {
  return new Promise<void>((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (showStdout) {
        console.log(stdout)
      }

      if (error !== null) {
        console.log(stderr)

        reject(error)
      } else {
        resolve()
      }
    })
  })
}
