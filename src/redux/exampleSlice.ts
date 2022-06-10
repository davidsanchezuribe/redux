import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState, AppThunk } from './store';

interface ExampleState {
  value: number
}

const initialState: ExampleState = {
  value: 0,
};

export const exampleSlice = createSlice({
  name: 'example',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
});

export const { increment, incrementByAmount } = exampleSlice.actions;

export const incrementAsync = (amount: number): AppThunk<void> => (dispatch) => {
  setTimeout(() => {
    dispatch(incrementByAmount(amount));
  }, 1000);
};

export const selectExample = (state: RootState) => state.exampleReducer.value;

export default exampleSlice.reducer;
