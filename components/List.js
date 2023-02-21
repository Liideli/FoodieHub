import React, {useState, useCallback, useEffect} from 'react';
import {FlatList, RefreshControl} from 'react-native';
import {useMedia} from '../hooks/ApiHooks';
import ListItem from './ListItem';
import PropTypes from 'prop-types';
import {Heading, HStack, Spinner} from 'native-base';

const List = ({navigation, myFilesOnly = false}) => {
  const {mediaArray} = useMedia(myFilesOnly);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  }, []);

  const doLoading = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    doLoading();
  }, []);

  return (
    <>
      {loading ? (
        <HStack h="100%" space={2} justifyContent="center" alignItems="center">
          <Heading color="coolGray.600" fontSize="xl">
            {' '}
            <Spinner color="coolGray.600" accessibilityLabel="Loading posts" />
            Loading FoodieHub
          </Heading>
        </HStack>
      ) : (
        <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          numColumns={2}
          data={mediaArray}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <ListItem navigation={navigation} singleMedia={item} />
          )}
        />
      )}
    </>
  );
};

List.propTypes = {
  navigation: PropTypes.object.isRequired,
  myFilesOnly: PropTypes.bool,
};

export default List;
