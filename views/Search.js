import PropTypes from 'prop-types';
import List from '../components/List';
import {StyleSheet, SafeAreaView, View} from 'react-native';
import {VStack, Input} from 'native-base';
import {AntDesign} from '@expo/vector-icons';
import {useSearch} from '../hooks/ApiHooks';
import {useMedia} from '../hooks/ApiHooks';
import AsyncStorage from "@react-native-async-storage/async-storage";


const Search = ({navigation}) => {

  const {postSearch} = useSearch();

  const {loadMedia} = useMedia();

  const searchFile = async (searchText) => {
    console.log('searching', searchText);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const searchMediaResult = await postSearch(searchText, token);
      loadMedia();
      console.log(searchMediaResult);
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
                }
              }
              />
          </VStack>
        </VStack>
        <List navigation={navigation}/>
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
};

export default Search;
