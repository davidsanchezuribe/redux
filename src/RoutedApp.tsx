import {
  BrowserRouter, Routes, Route, Navigate,
} from 'react-router-dom';
import React from 'react';
import Posts from './views/Posts';
import PostsRTKQuery from './views/PostsRTKQuery';
import PageNotFound from './views/PageNotFound';
import Counter from './views/Counter';
import Post from './views/Post';
import AddPostForm from './views/AddPostForm';
import UsersPage from './views/UsersPage';
// @imports

declare global {
  const BASE_PATH: string;
}

const RoutedApp = () => {
  const basepath = BASE_PATH;
  const notFoundPath = '/404';
  return (
    <BrowserRouter basename={basepath}>
      {/* navbar */}
      <Routes>
        <Route path="/" element={<Counter />} />
        <Route path="/addpost" element={<AddPostForm />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/posts2" element={<PostsRTKQuery />} />
        <Route path="/posts2/:id" element={<Post />} />
        <Route path="/users/:id" element={<UsersPage />} />
        <Route path={notFoundPath} element={<PageNotFound />} />
        <Route path="*" element={<Navigate to={notFoundPath} replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RoutedApp;
