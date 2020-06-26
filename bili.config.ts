import { Config } from 'bili'

const config: Config = {
  banner: false,
  input: {
    'plusauth-web': 'src/index.ts'
  },
  bundleNodeModules: true,
  babel: {
    minimal: true
  },
  output: {
    format: ['es', 'cjs', 'umd', 'umd-min'],
    moduleName: 'plusauthweb',
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
