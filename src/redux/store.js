import { legacy_createStore as createStore } from 'redux';
import { metamaskReducer } from './reducer';


export const configureStore = (state = { rotating: true }) => {
    return createStore(metamaskReducer, state);
}