import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from './store';

type Post = {
  userId: number,
  id: number,
  title: string,
  body: string,
};

type PostState = {
  posts: Array<Post>,
  status: 'idle' | 'loading' | 'succeeded' | 'failed',
  error: string | null,
};

const initialState: PostState = {
  posts: [],
  status: 'idle',
  error: null,
};
// Primer argumento es el prefijo que van a tener los actions
// El segundo es una promesa que devuelve la info o un error
export const fetchPosts = createAsyncThunk('counter/fetchPosts', async (_, { extra }) => {
  console.log(extra);
  const posts = await fetch('https://jsonplaceholder.typicode.com/posts')
    .then((response) => response.json());
  return posts;
});

export const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      });
  },
});

export const selectPosts = (state: RootState) => state.postsReducer.posts;

export default postSlice.reducer;
