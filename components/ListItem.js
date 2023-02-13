import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';
import {Dimensions} from 'react-native';
import {MainContext} from '../contexts/MainContext';
import {useContext} from 'react';
import {
  AspectRatio,
  Box,
  Image,
  Stack,
  Heading,
  Text,
  HStack,
  Pressable,
} from 'native-base';

const ListItem = ({singleMedia, navigation}) => {
  const item = singleMedia;
  const width = Dimensions.get('window').width;
  const {user} = useContext(MainContext);

  return (
    <Pressable
      onPress={() => {
        navigation.navigate('Single', item);
      }}
    >
      <Box alignItems="center">
        <Box
          width={width / 2}
          rounded="lg"
          overflow="hidden"
          borderColor="coolGray.200"
          borderWidth="2"
          _dark={{
            borderColor: 'coolGray.600',
            backgroundColor: 'gray.700',
          }}
          _web={{
            shadow: 2,
            borderWidth: 0,
          }}
          _light={{
            backgroundColor: 'gray.50',
          }}
        >
          <Box>
            <AspectRatio w="100%" ratio={1 / 1}>
              <Image
                source={{uri: uploadsUrl + item.thumbnails?.w160}}
                alt="image"
              />
            </AspectRatio>
          </Box>
          <Stack p="4" space={3} overflow="hidden">
            <Stack space={2}>
              <Heading size="md" ml="-1">
                {item.title}
              </Heading>
            </Stack>
            <Text fontWeight="400">{item.description}</Text>
            <HStack
              alignItems="center"
              space={4}
              justifyContent="space-between"
            >
              <HStack alignItems="center">
                {item.user_id === user.user_id && (
                  <Text
                    color="coolGray.600"
                    _dark={{
                      color: 'warmGray.200',
                    }}
                    fontWeight="400"
                  >
                    {user.username}
                  </Text>
                )}
              </HStack>
            </HStack>
          </Stack>
        </Box>
      </Box>
    </Pressable>
  );
};

ListItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
};

export default ListItem;
