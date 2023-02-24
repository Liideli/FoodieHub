import React, {useState, useCallback} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  View,
} from 'react-native';
import List from '../components/List';
import PropTypes from 'prop-types';
import {LogBox} from 'react-native';

const Home = ({navigation}) => {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

  const onRefresh = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setTimeout(() => {
        setRefreshing(true);
        setRefreshing(false);
      }, 500);
      setLoading(false);
    }, 0);
  }, [refreshing]);

  return (
    <View style={styles.container}>
      {!refreshing && (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={onRefresh} />
          }
        >
          <SafeAreaView style={styles.container}>
            <List navigation={navigation} />
          </SafeAreaView>
        </ScrollView>
      )}
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
