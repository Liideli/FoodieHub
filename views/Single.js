import React, {useContext, useEffect, useRef, useState} from 'react';
import {uploadsUrl} from '../utils/variables';
import PropTypes from 'prop-types';
import {Text, Card, ListItem, Icon} from '@rneui/themed';
import {Video} from 'expo-av';
import {Modal, ScrollView} from 'react-native';
import {useFavourite, useUser} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../contexts/MainContext';
import * as ScreenOrientation from 'expo-screen-orientation';
import {Image} from '@rneui/base';

const Single = ({route}) => {
  // console.log(route.params);
  const {
    title,
    description,
    filename,
    time_added: timeAdded,
    user_id: userId,
    media_type: type,
    file_id: fileId,
    filesize,
  } = route.params;
  const video = useRef(null);
  const [owner, setOwner] = useState({});
  const [likes, setLikes] = useState([]);
  const [userLikesIt, setUserLikesIt] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const {user} = useContext(MainContext);
  const {getUserById} = useUser();
  const {getFavouritesByFileId, postFavourite, deleteFavourite} =
    useFavourite();

  const getOwner = async () => {
    const token = await AsyncStorage.getItem('userToken');
    const owner = await getUserById(userId, token);
    console.log(owner);
    setOwner(owner);
  };

  const getLikes = async () => {
    const likes = await getFavouritesByFileId(fileId);
    // console.log('likes', likes, 'user', user);
    setLikes(likes);
    // check if the current user id is included in the 'likes' array and
    // set the 'userLikesIt' state accordingly
    for (const like of likes) {
      if (like.user_id === user.user_id) {
        setUserLikesIt(true);
        break;
      }
    }
  };

  const likeFile = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      await postFavourite(fileId, token);
      setUserLikesIt(true);
      getLikes();
    } catch (error) {
      // note: you cannot like same file multiple times
      // console.log(error);
    }
  };
  const dislikeFile = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      await deleteFavourite(fileId, token);
      setUserLikesIt(false);
      getLikes();
    } catch (error) {
      // note: you cannot like same file multiple times
      console.log(error);
    }
  };

  const unlock = async () => {
    try {
      await ScreenOrientation.unlockAsync();
    } catch (error) {
      console.error('unlock', error.message);
    }
  };

  const lock = async () => {
    try {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP
      );
    } catch (error) {
      console.error('lock', error.message);
    }
  };

  const showVideoInFullScreen = async () => {
    try {
      await video.current.presentFullscreenPlayer();
    } catch (error) {
      console.error('showVideoInFullScreen', error.message);
    }
  };

  useEffect(() => {
    getOwner();
    getLikes();
    unlock();

    const orientSub = ScreenOrientation.addOrientationChangeListener((evt) => {
      console.log('orientation', evt);
      if (evt.orientationInfo.orientation > 2) {
        // show video in fullscreen
        if (video.current) showVideoInFullScreen();
      }
    });

    return () => {
      ScreenOrientation.removeOrientationChangeListener(orientSub);
      lock();
    };
  }, []);

  return (
    <>
      <ScrollView>
        <Card>
          <Card.Title>{title}</Card.Title>
          <Card.Divider />
          {type === 'image' ? (
            <Card.Image
              onPress={() => setModalVisible(true)}
              source={{uri: uploadsUrl + filename}}
            />
          ) : (
            <Video
              ref={video}
              source={{uri: uploadsUrl + filename}}
              style={{width: '100%', height: 200}}
              resizeMode="cover"
              useNativeControls
              onError={(error) => {
                console.log(error);
              }}
              isLooping
            />
          )}
          <Card.Divider />
          {description && (
            <ListItem>
              <Text>{description}</Text>
            </ListItem>
          )}
          <ListItem>
            <Icon name="schedule" />
            <Text>{new Date(timeAdded).toLocaleString('fi-FI')}</Text>
            <Icon name="save" />
            <Text>{(filesize / 1000000).toFixed(2)} MB</Text>
          </ListItem>
          <ListItem>
            <Icon name="person" />
            <Text>
              {owner.username} ({owner.full_name})
            </Text>
          </ListItem>
          <ListItem>
            {userLikesIt ? (
              <Icon name="favorite" color="red" onPress={dislikeFile} />
            ) : (
              <Icon name="favorite-border" onPress={likeFile} />
            )}
            <Text>Total likes: {likes.length}</Text>
          </ListItem>
        </Card>
      </ScrollView>
      <Modal
        visible={modalVisible}
        style={{flex: 1}}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
        supportedOrientations={['portrait', 'landscape']}
      >
        <Image
          resizeMode="contain"
          onPress={() => setModalVisible(false)}
          style={{height: '100%'}}
          source={{uri: uploadsUrl + filename}}
        />
      </Modal>
    </>
  );
};

Single.propTypes = {
  route: PropTypes.object,
};

export default Single;
