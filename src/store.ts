import { createStore } from '@ice/store';
import * as models from './models';

const store = createStore(models)

export default store;
export const {
  useModel, useModelEffectsLoading, useModelDispatchers, useModelState,
} = store
