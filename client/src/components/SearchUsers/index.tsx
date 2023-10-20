import { IonSearchbar } from "@ionic/react";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getUsers } from "../../services/users";

interface SearchUsersProps {
  setFilteredUser: any;
  placeholder: any;
  className?: string;
}

const SearchUsers: React.FC<SearchUsersProps> = ({
  setFilteredUser,
  placeholder,
  className,
}) => {
  const { data } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(),
  });

  const handleFilterChange = (event: any) => {
    if (event.target.value !== "") {
      setFilteredUser(
        data.users.filter((user: any) => {
          return user.username.includes(event.target.value);
        })
      );
    }
  };
  return (
    <IonSearchbar
      onIonInput={handleFilterChange}
      debounce={1000}
      onIonClear={() => {
        setFilteredUser([]);
      }}
      placeholder={placeholder}
      className={className}
    ></IonSearchbar>
  );
};

export default SearchUsers;
