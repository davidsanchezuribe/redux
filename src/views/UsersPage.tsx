import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useGetPostsQuery } from '../redux/apiSlicev2';
import { useAppSelector } from '../redux/reduxHooks';
import { selectUserById, selectPostsFromUser } from '../redux/usersSlice';

const UsersPage = () => {
  const { id = '' } = useParams<{ id: string }>();
  const idNumber = parseInt(id, 10);

  // const user = useSelector((state: RootState) => selectUserById(state, idNumber));
  // useAppSelector me ahorra el tipo y un import
  const user = useAppSelector((state) => selectUserById(state, idNumber));
  const selectPostsForUser = useMemo(() => selectPostsFromUser, []);

  const postsForUser = useGetPostsQuery(undefined, {
    selectFromResult: ({ data = [] }) => ({
      // Se pueden incluir otros metadatos aqui
      prueba: 'feliz cumpleaños a mi',
      posts: selectPostsForUser(data, idNumber, 'dumis'),
    }),
  });

  return (
    <div />
  );
};

export default UsersPage;
