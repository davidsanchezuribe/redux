import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/reduxHooks';
import { fetchPosts, selectPosts } from '../redux/postsSlice';
import type { RootState } from '../redux/store';

const Posts = () => {
  const dispatch = useAppDispatch();
  const posts = useAppSelector(selectPosts);

  const postStatus = useAppSelector((state: RootState) => state.postsReducer.status);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const error = useAppSelector((state: RootState) => state.postsReducer.error);
  useEffect(() => {
    // Solo llamar el fetch posts una vez
    if (postStatus === 'idle') {
      dispatch(fetchPosts());
    }
    // el dispatch se reactiva si el store cambia
  }, [postStatus, dispatch]);
  const postList = posts.map((post) => (
    <p key={post.id}>{post.body}</p>
  ));
  return (
    <h1>{postList}</h1>
  );
};

export default Posts;
