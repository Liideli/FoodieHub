import React, {useState} from 'react';
import PropTypes from 'prop-types';

const MainContext = React.createContext({});

const MainProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [update, setUpdate] = useState(true);
  const [userLikesIt, setUserLikesIt] = useState(false);
  const [toggleForm, setToggleForm] = useState({});
  const [refreshing, setRefreshing] = useState({});
  const [searchMediaArray, setSearchMediaArray] = useState([]);

  return (
    <MainContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        update,
        setUpdate,
        refreshing,
        setRefreshing,
        toggleForm,
        setToggleForm,
        userLikesIt,
        setUserLikesIt,
        searchMediaArray,
        setSearchMediaArray,
      }}
    >
      {props.children}
    </MainContext.Provider>
  );
};

MainProvider.propTypes = {
  children: PropTypes.node,
};

export {MainContext, MainProvider};
