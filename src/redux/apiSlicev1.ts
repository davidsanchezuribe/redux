// Se deben importar del punto de entrada especifico a react
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

type Post2Upload = {
  userId: number,
  title: string,
  body: string,
};

type Post = {
  userId: number,
  id: number,
  title: string,
  body: string,
};

export const apiSlice = createApi({
  // Normalmente se espera que se añada a state.api por lo que es opcional
  // esta llave es muy importante ya que indica donde esta el cache de los datos
  // si se añade a un punto diferente del store, va a presentar error
  reducerPath: 'api',
  // fetchBaseQuery es un wrapper alrededor del fetch normalito
  baseQuery: fetchBaseQuery({ baseUrl: 'https://jsonplaceholder.typicode.com' }),
  // Se declaran los tipos de tags con los que se van a generar vínculos entre los queries
  tagTypes: ['Post'],
  // los endpoints pueden ser queries (jalada de datos) o mutaciones que es cuando
  // mandamos actualizaciones de algun elemento al servidor. Las mutaciones se llaman
  // con builder.mutation()
  endpoints: (builder) => ({
    // Tipo de dato que espero, dato que le debo mandar
    getPosts: builder.query<Array<Post>, void>({
      // Usa Get por defecto si se quiere cambiar usar el de abajo
      query: () => '/posts',
      // Tags que pueden invalidar la cache, describen los datos presentes
      providesTags: ['Post'],
    }),
    getPost: builder.query<Post, string>({
      query: (postId) => `/posts/${postId}`,
    }),
    addNewPost: builder.mutation<Post, Post2Upload>({
      query: (initialPost) => ({
        url: '/posts',
        method: 'POST',
        body: initialPost,
      }),
      invalidatesTags: ['Post'],
    }),
  }),

});

// RTK Query genera un hook por cada endpoint que se define
// Sirven para llamar los datos cuando el componente se monta y
// pintar de nuevo el componente cuando los datos están disponibles
export const { useGetPostsQuery, useAddNewPostMutation, useGetPostQuery } = apiSlice;
