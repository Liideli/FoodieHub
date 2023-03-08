import React from 'react';
import List from '../components/List';
import PropTypes from 'prop-types';

// NativeBase Components
import {View} from 'native-base';

const Home = ({navigation}) => {
  return (
    <View backgroundColor={'#fff'}>
      <List
        navigation={navigation}
        myFilesOnly={false}
        MyFavouritesOnly={false}
      />
    </View>
  );
};

Home.propTypes = {
  navigation: PropTypes.object,
};

export default Home;
