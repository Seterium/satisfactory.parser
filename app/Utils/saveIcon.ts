import fs from 'fs'
import path from 'path'

import Env from '@ioc:Adonis/Core/Env'

import md5 from 'md5'
import sharp from 'sharp'
import chalk from 'chalk'
import consola from 'consola'

export async function saveIcon(iconPath: string, saveBasePath: string, size: number = 0) {
  const fullPath = path.join(Env.get('FG_FMODEL_EXPORTS_PATH'), `${iconPath}.png`)

  if (fs.existsSync(fullPath) === false) {
    throw new Error(`Could not find image: ${fullPath}`)
  }

  const filename = md5(fullPath)

  const pngIcon = sharp(fullPath)
  const webpIcon = sharp(fullPath)

  if (size) {
    pngIcon.resize(size, size)
    webpIcon.resize(size, size)
  }

  await Promise.all([
    await pngIcon.png({
      quality: 85,
    }).toFile(path.join(saveBasePath, `${filename}.png`)),

    await webpIcon.webp({
      force: false,
    }).toFile(path.join(saveBasePath, `${filename}.webp`)),
  ])

  consola.success(`Icon ${chalk.bold.cyanBright(iconPath)} saved with name ${chalk.bold.greenBright(filename)}`)

  return filename
}
