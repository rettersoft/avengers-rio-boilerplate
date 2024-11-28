import { SampleClassData } from './models/common'
import { SampleMethodInput } from './models/input'
import { SampleMethodOutput } from './models/output'

type SampleClassSampleMethodData = SampleClassData<SampleMethodInput, SampleMethodOutput>

export async function sampleMethod(data: SampleClassSampleMethodData): Promise<SampleClassSampleMethodData> {
    data.response = { statusCode: 200, body: { output: data.request.body!.input } }
    return data
}
