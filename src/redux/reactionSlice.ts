import { apiSlice, Post } from './apiSlicev2';

export const reactionApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.mutation<void, { postId: number, reaction: string }>({
      query: ({ postId, reaction }) => ({
        url: `posts/${postId}/reactions`,
        method: 'POST',
        // In a real app, we'd probably need to base this on user ID somehow
        // so that a user can't do the same reaction more than once
        body: { reaction },
      }),
      // OPTIMISTIC UPDATE
      // Los primeros argumentos son los argumentos que se le pasan al query
      // Los segundos argumentos son utilidades que me provee onQueryStarted
      async onQueryStarted({ postId, reaction }, { dispatch, queryFulfilled }) {
        const patchResultAction = apiSlice.util.updateQueryData('getPosts', undefined, (draft) => {
          const postToReact: Post | undefined = draft.find((post) => post.id === postId);
          if (postToReact) {
            postToReact.body = reaction;
          }
        });
        const patchResult = dispatch(patchResultAction);
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

  }),
});

export const x = 3;
