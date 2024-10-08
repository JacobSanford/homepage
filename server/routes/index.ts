import { createRouter, defineEventHandler, useBase } from 'h3'

const router = createRouter()

router.get('/', defineEventHandler(() => 'Hello World!'))

export default useBase('/api', router.handler)