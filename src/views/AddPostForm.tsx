/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { useAddNewPostMutation } from '../redux/apiSlicev2';

const AddPostForm = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  // el mutation hook devuelve un array con dos valores: una función que hace
  // la peticion al servidor con el argumento que se le provee los datos meta
  // que tienen info importante como isLoading para saber si se esta mandando info al servidor

  const [addNewPost, { isLoading }] = useAddNewPostMutation();

  const onTitleChanged = (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);
  // eslint-disable-next-line max-len
  const onContentChanged = (e: React.ChangeEvent<HTMLTextAreaElement>) => setBody(e.target.value);

  const canSave = [title, body].every(Boolean) && !isLoading;

  const onSavePostClicked = async () => {
    if (canSave) {
      try {
        const response = await addNewPost({ title, body, userId: 1 }).unwrap();
        console.log(response);
        setTitle('');
        setBody('');
      } catch (err) {
        console.error('Failed to save the post: ', err);
      }
    }
  };

  return (
    <section>
      <h2>Add a New Post</h2>
      <form>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          placeholder="What's on your mind?"
          value={title}
          onChange={onTitleChanged}
        />
        <label htmlFor="postAuthor">Author:</label>
        <label htmlFor="postContent">Content:</label>
        <textarea
          id="postContent"
          name="postContent"
          value={body}
          onChange={onContentChanged}
        />
        <button type="button" onClick={onSavePostClicked} disabled={!canSave}>
          Save Post
        </button>
      </form>
    </section>
  );
};

export default AddPostForm;
