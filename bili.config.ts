import { Config } from 'bili'

const config: Config = {
  banner: false,
  input: 'src/index.ts',
  bundleNodeModules: true,
  babel: {
    minimal: true
  },
  output: {
    format: ['es', 'cjs', 'umd', 'umd-min'],
    moduleName: 'PlusAuthWeb',
    sourceMap: true
  },
  plugins: {
    typescript2: {
      clean: true,
      tsconfig: 'tsconfig.json',
      useTsconfigDeclarationDir: true
    }
  }
}

export default config
