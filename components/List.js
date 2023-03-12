import React, {useEffect, useState, useCallback, useContext} from 'react';
import {FlatList, RefreshControl} from 'react-native';
import {useMedia} from '../hooks/ApiHooks';
import ListItem from './ListItem';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';

// NativeBase Components
import {PresenceTransition} from 'native-base';

const List = ({navigation, myFilesOnly = false, MyFavouritesOnly = false}) => {
  const {mediaArray} = useMedia(myFilesOnly, MyFavouritesOnly);
  const [transition, setTransition] = useState(false);
  const [loading, setLoading] = useState(false);
  const {setUpdate} = useContext(MainContext);

  // Pull down to refresh list
  const onRefresh = useCallback(() => {
    setLoading(true);
    setUpdate(false);
  }, []);

  useEffect(() => {
    setTransition(true);
    setLoading(false);
    setUpdate(true);
  }, [loading]);

  return (
    <PresenceTransition visible={transition}>
      <FlatList
        numColumns={2}
        renderItem={({item}) => (
          <ListItem navigation={navigation} singleMedia={item} />
        )}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        }
        data={mediaArray}
        extraData={mediaArray}
        keyExtractor={(item, index) => index.toString()}
      />
    </PresenceTransition>
  );
};

List.propTypes = {
  navigation: PropTypes.object.isRequired,
  myFilesOnly: PropTypes.bool,
  MyFavouritesOnly: PropTypes.bool,
  searchText: PropTypes.string,
  children: PropTypes.bool,
  searchMediaResult: PropTypes.bool,
};

export default List;
