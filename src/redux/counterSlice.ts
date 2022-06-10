import {
  AnyAction, createSlice, PayloadAction, ThunkAction,
} from '@reduxjs/toolkit';
import type { RootState, AppThunk } from './store';

interface CounterState {
  value: number
}

const initialState: CounterState = {
  value: 0,
};

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    // como no se nota mirar que hay en el payload se puede omitir el argumento action
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    // dentro de <> esta el tipo de objeto que espera el contenido del payload
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
});

export const { increment, decrement, incrementByAmount } = counterSlice.actions;

// ThunkAction type recibe 4 parametros
// R, Return type of the function por lo general void si se espera que devuelva
// un promise se debe especificar
// S, State type used by getState (RootState)
// E, any extra argument injected into the thunk (dispatch, state, <extraargument>)
// Si se usa mucho este tipo de tipo XD se puede crear en el store
export const incrementAsync = (amount: number):
ThunkAction<void, RootState, unknown, AnyAction> => (dispatch) => {
  setTimeout(() => {
    // Este incrementByAmount es accesible solo porque se está exportando abajo
    // de no ser asi me imagino que habria que poner
    // dispatch(counterSlice.actions.incrementByAmount(amount))
    dispatch(incrementByAmount(amount));
  }, 1000);
};

// Como void esta por defecto se puede poner solo AppThunk
export const incrementAsync2 = (amount: number): AppThunk<void> => (dispatch) => {
  setTimeout(() => {
    // Este incrementByAmount es accesible solo porque se está exportando abajo
    // de no ser asi me imagino que habria que poner
    // dispatch(counterSlice.actions.incrementByAmount(amount))
    dispatch(incrementByAmount(amount));
  }, 1000);
};

// Sirve para extraer la info mediante useAppSelector(selectCount)
// la funcion increment por ejemplo devuelve el objeto {type: "counter/increment"}
export const selectCount = (state: RootState) => state.counterReducer.value;

export default counterSlice.reducer;
