//  @ts-check
import { plugin as tanstackQuery } from '@tanstack/eslint-plugin-query'
import { tanstackConfig } from '@tanstack/eslint-config'

export default [...tanstackQuery.configs['flat/recommended'], ...tanstackConfig]
