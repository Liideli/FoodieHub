import AsyncStorage from '@react-native-async-storage/async-storage';
import {ButtonGroup} from '@rneui/base';
import {Avatar, ListItem as RNEListItem} from '@rneui/themed';
import PropTypes from 'prop-types';
import {useContext} from 'react';
import {Alert} from 'react-native';
import {MainContext} from '../contexts/MainContext';
import {useMedia} from '../hooks/ApiHooks';
import {uploadsUrl} from '../utils/variables';

const ListItem = ({singleMedia, navigation}) => {
  const {user, setUpdate, update} = useContext(MainContext);
  const {deleteMedia} = useMedia();
  const item = singleMedia;

  const doDelete = () => {
    try {
      Alert.alert('Delete', 'this file permanently', [
        {text: 'Cancel'},
        {
          text: 'OK',
          onPress: async () => {
            const token = await AsyncStorage.getItem('userToken');
            const response = await deleteMedia(item.file_id, token);
            response && setUpdate(!update);
          },
        },
      ]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <RNEListItem
      onPress={() => {
        navigation.navigate('Single', item);
      }}
    >
      <Avatar size="large" source={{uri: uploadsUrl + item.thumbnails?.w160}} />
      <RNEListItem.Content>
        <RNEListItem.Title>{item.title}</RNEListItem.Title>
        <RNEListItem.Subtitle numberOfLines={3}>
          {item.description}
        </RNEListItem.Subtitle>
        {item.user_id === user.user_id && (
          <ButtonGroup
            buttons={['Modify', 'Delete']}
            rounded
            onPress={(index) => {
              if (index === 0) {
                navigation.navigate('Modify', {file: item});
              } else {
                doDelete();
              }
            }}
          />
        )}
      </RNEListItem.Content>
      <RNEListItem.Chevron />
    </RNEListItem>
  );
};

ListItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
};

export default ListItem;
