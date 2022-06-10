// Se deben importar del punto de entrada especifico a react
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

type Post2Upload = {
  userId: number,
  title: string,
  body: string,
};

export type Post = {
  userId: number,
  id: number,
  title: string,
  body: string,
};

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: Address;
  phone: string;
  website: string;
  company: Company;
}

interface Address {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: Geo;
}

interface Geo {
  lat: string;
  lng: string;
}

interface Company {
  name: string;
  catchPhrase: string;
  bs: string;
}

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
      // Para invalidar con array de tags simples mirar apiSlicev1
      providesTags: (result = []) => {
        const tags = [
          // Es muy importante el as const para typescript
          ...result.map(({ id }) => ({ type: 'Post' as const, id })),
          { type: 'Post' as const, id: 'LIST' },
        ];
        console.log('getPosts tags:', tags);
        return tags;
      },

    }),
    getPost: builder.query<Post, number>({
      query: (postId) => `/posts/${postId}`,
      transformResponse: (responseData: Post) => {
        const newData = { ...responseData, body: responseData.body.toUpperCase() };
        return newData;
      },
      // arg corresponde al argumento que se le pasa al query "postId"
      providesTags: (result, error, arg) => {
        // console.log('getPost arg:', arg);
        const tags = [{ type: 'Post' as const, id: arg }];
        // console.log('getPost tags:', tags);
        return tags;
      },
    }),
    // Fuerza el refetch de la lista completa de posts mas no el
    // refetch de un post particular
    addNewPost: builder.mutation<Post, Post2Upload>({
      query: (initialPost) => ({
        url: '/posts',
        method: 'POST',
        body: initialPost,
      }),
      invalidatesTags: [{ type: 'Post' as const, id: 'LIST' }],
    }),
    // fuerza el refetch de la lista completa de posts ya que esos
    // cositos se generaron con todos los ids y del post particular
    editPost: builder.mutation({
      query: (post: Post) => ({
        url: `posts/${post.id}`,
        method: 'PATCH',
        body: post,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Post', id: arg.id }],
    }),

  }),

});

// RTK Query genera un hook por cada endpoint que se define
// Sirven para llamar los datos cuando el componente se monta y
// pintar de nuevo el componente cuando los datos están disponibles
export const {
  useGetPostsQuery,
  useAddNewPostMutation,
  useGetPostQuery,
} = apiSlice;
export const getPostsUseLazyQuery = apiSlice.endpoints.getPost.useLazyQuery;
