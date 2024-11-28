import { Response } from '@retter/rdk'
import { SampleClassData } from './models/common'

export async function init(data: SampleClassData): Promise<SampleClassData> {
  data.response = { statusCode: 204 }
  return data
}

export async function getState(data: SampleClassData): Promise<Response> {
  return { statusCode: 200, body: data.state }
}

export async function getInstanceId(): Promise<string> {
  return 'default'
}
