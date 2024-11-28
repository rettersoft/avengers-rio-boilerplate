import { Data } from '@retter/rdk'

interface State {
  private: object
  public: object
}

export type StatelessData<Input extends any, Output extends any> = Omit<Data<Input, Output>, 'state'>
export interface SampleClassData<I extends any = any, O extends any = any> extends StatelessData<I, O> {
  state: State
}
