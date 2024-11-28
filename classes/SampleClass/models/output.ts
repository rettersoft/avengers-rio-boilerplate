import { z } from 'zod'

export const SampleMethodOutput = z.object({
  output: z.string().min(1),
})
export type SampleMethodOutput = z.infer<typeof SampleMethodOutput>
