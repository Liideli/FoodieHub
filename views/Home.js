import React from 'react';
import {StyleSheet} from 'react-native';
import {View} from 'native-base';
import List from '../components/List';
import PropTypes from 'prop-types';
// import {LogBox} from 'react-native';

const Home = ({navigation}) => {
  //  LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

  return (
    <View style={styles.container}>
      <List navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

Home.propTypes = {
  navigation: PropTypes.object,
  children: PropTypes.object,
};

export default Home;
