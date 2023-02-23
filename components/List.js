import {FlatList} from 'react-native';
import {useMedia} from '../hooks/ApiHooks';
import ListItem from './ListItem';
import PropTypes from 'prop-types';

const List = ({navigation, myFilesOnly = false, MyFavouritesOnly = false}) => {
  const {mediaArray} = useMedia(myFilesOnly, MyFavouritesOnly);
  return (
    <FlatList
      numColumns={2}
      data={mediaArray}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item}) => (
        <ListItem navigation={navigation} singleMedia={item} />
      )}
    />
  );
};

List.propTypes = {
  navigation: PropTypes.object.isRequired,
  myFilesOnly: PropTypes.bool,
  MyFavouritesOnly: PropTypes.bool,
};

export default List;
