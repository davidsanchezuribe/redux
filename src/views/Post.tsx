import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useGetPostQuery } from '../redux/apiSlicev2';

type PostParams = {
  id: string,
};

const Post = () => {
  const { id = '' } = useParams<PostParams>();
  const idNumber = parseInt(id, 10);
  if (Number.isNaN(idNumber)) {
    return (<Navigate to="404" />);
  }
  const { data: post } = useGetPostQuery(idNumber);
  return (
    <p>{post?.body}</p>
  );
};

export default Post;
