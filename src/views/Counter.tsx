/* eslint-disable react/button-has-type */
import React from 'react';
import { useAppDispatch, useAppSelector } from '../redux/reduxHooks';
import {
  decrement, increment, incrementByAmount, selectCount, incrementAsync,
} from '../redux/counterSlice';

const Counter = () => {
  // useAppSelector es importante porque nosotros no podemos acceder al store
  // pero useAppSelector si entonces llama detras de cuerdas selectCount con el
  // argumento (store.getState())
  // useSelector se llama cada vez que se despacha una accion y se actualiza el store
  // si el valor cambia, useSelector fuerza una rerenderizacion del componente
  const count = useAppSelector(selectCount);
  // ejemplo de modificar el estado llamando funciones inline sin reciclar selectores
  // const countPlusTwo = useAppSelector(state: RootState => state.counter.value + 2)

  // useDispatch accede al metodo dispatch() del store ya que no podemos hacerlo directamente
  const dispatch = useAppDispatch();

  return (
    <div>
      <div>
        <button
          aria-label="Increment value"
          onClick={() => dispatch(increment())}
        >
          Increment
        </button>
        <button
          aria-label="Increment value"
          onClick={() => dispatch(incrementAsync(1))}
        >
          Increment Async
        </button>
        <span>{count}</span>
        <button
          aria-label="Decrement value"
          onClick={() => dispatch(decrement())}
        >
          Decrement
        </button>
        <button
          aria-label="Decrement value"
          onClick={() => dispatch(incrementByAmount(4))}
        >
          Increment 4
        </button>
      </div>
    </div>
  );
};

export default Counter;
