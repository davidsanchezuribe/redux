import { createSelector, createEntityAdapter, EntityState } from '@reduxjs/toolkit';
import { apiSlice, Post, User } from './apiSlicev2';
import { RootState } from './store';

const usersAdapter = createEntityAdapter<User>();
// El estado inicial de un entity adapter es un { ids:[,,,], entities:{"key": "value"}}
const initialState = usersAdapter.getInitialState();

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<EntityState<User>, void>({
      query: () => '/users',
      // reemplaza los elementos con los elementos del array
      transformResponse: (responseData: Array<User>) => (usersAdapter
        .setAll(initialState, responseData)),
    }),
  }),
});
// OJO tanto el query como el selector se extraen de este apiSlice
// para que typescript sepa que es el apiSlice con las caracteristicas
// añadidas
export const { useGetUsersQuery } = userApiSlice;
// Select es una de las funciones que proveen los endpoints
// En este caso sin parametros porque users no pide parametros
// Retorna el query result
export const selectUsersResult = userApiSlice.endpoints.getUsers.select();

// funcion memoizada recalcula resultados solo cuando el input cambia
// si cambia el contenido de selectUsersResult calcula la funcion
// puede ser un array o un solo elemento, cada uno de los elementos corresponde
// al argumento que le entra a la funcion de abajo
// Hace el retorno desde la cache
export const selectAllUsers = createSelector(
  // inputSelectors de la forma selector1, selector2, ... o [sel1, sel2, ...]
  selectUsersResult,
  (usersResult) => usersResult.data,
);

// creo que el primer argumento tambien puede ser de la forma
// [selectAllUsers, (state, userId) => userId]
export const selectUserById = createSelector(
  // primer argumento que le entra a la funcion de abajo, (Elementos)
  selectAllUsers,
  // segundo y tercer argumento de la funcion de abajo mas selectores
  // definidos de forma explicita
  (state: RootState, userId: number) => userId,
  (users, userId) => users?.entities[userId] ?? null,
);



export const selectPostsFromUser = createSelector(
  (posts: Array<Post>) => posts,
  (posts: Array<Post>, userId: number) => userId,
  (posts: Array<Post>, userId: number, dummy: string) => dummy,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (data, userId, dummy) => data?.filter((post) => post.userId === userId) ?? [],
);

// selectAll y selectById son selectores que provee usersAdapter
// al que le tengo que proveer el root state para que me los de
// si no se los tengo que pedir al initial state que tambien es un entity
// adapter pero vacío
// a getSelectors se le debe dar un input selector que es todo lo que esta dentro de la funcion
// para que sepa donde estan los datos
export const { selectAll, selectById } = usersAdapter
  .getSelectors((state : RootState) => selectAllUsers(state) ?? initialState);
