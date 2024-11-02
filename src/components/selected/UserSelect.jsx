import { useMemo } from 'react';
import useFetchData from '../../hooks/useFetchData';
import Select from '../selected/Select';
import { getUsers } from '../../api/api';
import React from 'react';

const UserSelect = React.memo(({ name, label, ...props }) => {
  const { data: users, error, loading } = useFetchData(getUsers);

  const uniqueUsers = useMemo(() => {
    if (!users) return [];
    // Filtra usuarios únicos y estructura solo con los datos necesarios
    return [...new Map(users.map(user => [user.id, { id: user.id, name: user.name, last_name: user.last_name }])).values()];
  }, [users]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!users || users.length === 0) return <p>No users available</p>;

  return (
    <Select label={label} name={name} {...props}>
      <option value="">Seleccione un usuario</option>
      {uniqueUsers.map((user) => (
        <option key={user.id} value={user.id}>
          {`${user.name} ${user.last_name}`}
        </option>
      ))}
    </Select>
  );
});

export default UserSelect;
