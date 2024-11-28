import { Response } from '@retter/rdk'

import { SampleClassData } from './models/common'

export async function authorize(data: SampleClassData): Promise<Response> {
    const { identity, methodName } = data.context

    switch (methodName) {
        case 'INIT':
        case 'GET': {
            if (identity === 'enduser') return { statusCode: 204 }

            break
        }
        default: {
            break
        }
    }
    return { statusCode: 403, body: { message: 'Forbidden' } }
}
