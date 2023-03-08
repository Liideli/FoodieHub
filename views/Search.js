import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import List from '../components/List';
import {useMedia} from '../hooks/ApiHooks';
import {StyleSheet, SafeAreaView, View} from 'react-native';
import {AntDesign} from '@expo/vector-icons';
import {useSearch} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// NativeBase Components
import {VStack, Input} from 'native-base';

const Search = ({
  navigation,
  myFilesOnly = false,
  MyFavouritesOnly = false,
}) => {
  const {postSearch} = useSearch();
  const {setUpdate} = useContext(MainContext);
  const {setSearchMediaArray} = useContext(MainContext);
  const {mediaArray, setMediaArray} = useMedia(myFilesOnly, MyFavouritesOnly);

  const searchFile = async (searchText) => {
    console.log('searching', searchText);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const searchMediaResult = await postSearch(searchText, token);
      setUpdate(true);
      setSearchMediaArray(searchMediaResult);
      setMediaArray(searchMediaResult);
      // console.log(mediaArray);
      // console.log('searchResult', searchMediaResult);
    } catch (error) {
      console.error('Search', error);
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>
        <VStack my="2" px="2" space={5} w="100%">
          <VStack w="100%" space={5} alignSelf="center">
            <Input
              placeholder="Search"
              variant="filled"
              width="100%"
              borderRadius="5"
              py="2"
              px="2"
              InputLeftElement={
                <AntDesign name="search1" size={24} color="black" />
              }
              onChangeText={(searchText) => {
                searchFile(searchText);
              }}
            />
          </VStack>
        </VStack>
        <List navigation={navigation} />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

Search.propTypes = {
  route: PropTypes.object,
  navigation: PropTypes.object,
  myFilesOnly: PropTypes.bool,
  MyFavouritesOnly: PropTypes.bool,
};

export default Search;
