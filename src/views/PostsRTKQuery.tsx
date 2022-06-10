import React, { useMemo } from 'react';
import classnames from 'classnames';
import { useGetPostsQuery } from '../redux/apiSlicev2';

const Posts = () => {
  const {
    data: posts = [],
    isLoading,
    isSuccess,
    isError,
    error,
    isFetching,
    refetch,
  } = useGetPostsQuery();
  // console.log(getUsersMatchPending());
  // Para que no los reordene si los posts son los mismos
  const sortedPosts = useMemo(() => {
    // Para no mutar la info original
    const postsCopy = posts.slice();
    postsCopy.sort((a, b) => a.body.localeCompare(b.body));
    return postsCopy;
  }, [posts]);
  let content;
  if (isLoading) {
    content = <h1>Is Loading...</h1>;
  } else if (isSuccess) {
    const renderedPosts = sortedPosts.map((post) => (
      <p key={post.id}>
        <a href={`\\posts2\\${post.id}`}>{post.title}</a>
      </p>
    ));
    const containerClassname = classnames('posts-container', {
      disabled: isFetching,
    });
    content = (
      <div className={containerClassname}>
        <h1>Posts</h1>
        <button type="button" onClick={refetch}>Refetch Posts</button>
        {renderedPosts}
      </div>
    );
  } else if (isError) {
    content = <div>{error.toString()}</div>;
  }
  return (content || null);
};

export default Posts;
