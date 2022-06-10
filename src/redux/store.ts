import { configureStore, AnyAction, ThunkAction } from '@reduxjs/toolkit';
import counterReducer from './counterSlice';
import exampleReducer from './exampleSlice';
import postsReducer from './postsSlice';
import { apiSlice } from './apiSlicev2';

const store = configureStore({
  reducer: {
    counterReducer,
    exampleReducer,
    postsReducer,
    // api slice cache reducer usando ese path se asegura que
    // se añada en el punto correcto
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  // Se debe añadir tambien el middleware que maneja los tiempos de cache
  // concat se usa para que nuestro middleware esté al final de todos
  middleware: (getDefaultMiddleWare) => getDefaultMiddleWare()
    .concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, AnyAction>;
export default store;
