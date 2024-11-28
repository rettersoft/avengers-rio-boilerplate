import { z } from 'zod'

export const SampleMethodInput = z.object({
  input: z.string().min(1),
})
export type SampleMethodInput = z.infer<typeof SampleMethodInput>
