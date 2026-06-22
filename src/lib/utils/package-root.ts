import * as path from 'path'

export const packageRoot = path.resolve(__dirname, '../../../')

export function packagePath(...segments: string[]): string {
  return path.resolve(packageRoot, ...segments)
}
