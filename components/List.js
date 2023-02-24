import React, {useEffect, useState} from 'react';
import {FlatList} from 'react-native';
import {useMedia} from '../hooks/ApiHooks';
import ListItem from './ListItem';
import PropTypes from 'prop-types';
import {PresenceTransition} from 'native-base';

const List = ({navigation, myFilesOnly = false, MyFavouritesOnly = false}) => {
  const {mediaArray} = useMedia(myFilesOnly, MyFavouritesOnly);
  const [transition, setTransition] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setTransition(true);
    }, 400);
  }, []);

  return (
    <PresenceTransition
      visible={transition}
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
        transition: {
          duration: 400,
        },
      }}
    >
      <FlatList
        numColumns={2}
        columnWrapperStyle={{justifyContent: 'space-between'}}
        data={mediaArray}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <ListItem navigation={navigation} singleMedia={item} />
        )}
      />
    </PresenceTransition>
  );
};

List.propTypes = {
  navigation: PropTypes.object.isRequired,
  myFilesOnly: PropTypes.bool,
  MyFavouritesOnly: PropTypes.bool,
  children: PropTypes.bool,
};

export default List;
