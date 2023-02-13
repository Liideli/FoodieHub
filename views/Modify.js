import {Button, Card, Input} from '@rneui/themed';
import PropTypes from 'prop-types';
import {Controller, useForm} from 'react-hook-form';
import {Alert, Keyboard, ScrollView, TouchableOpacity} from 'react-native';
import {useContext, useRef, useState} from 'react';
import {useMedia} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../contexts/MainContext';
import {uploadsUrl} from '../utils/variables';
import {Video} from 'expo-av';

const Modify = ({navigation, route}) => {
  const {file} = route.params;
  const video = useRef(null);
  const [loading, setLoading] = useState(false);
  const {putMedia} = useMedia();
  const {update, setUpdate} = useContext(MainContext);
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {title: file.title, description: file.description},
    mode: 'onChange',
  });

  const modifyFile = async (data) => {
    // create form data and post it
    setLoading(true);
    console.log('data', data);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const result = await putMedia(file.file_id, data, token);

      Alert.alert('Success', result.message, [
        {
          text: 'OK',
          onPress: () => {
            setUpdate(!update);
            navigation.navigate('MyFiles');
          },
        },
      ]);
    } catch (error) {
      console.error('file modify failed', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView>
      <TouchableOpacity onPress={() => Keyboard.dismiss()} activeOpacity={1}>
        <Card>
          {file.media_type === 'video' ? (
            <Video
              ref={video}
              source={{uri: uploadsUrl + file.filename}}
              style={{width: '100%', height: 200}}
              resizeMode="cover"
              useNativeControls
              onError={(error) => {
                console.log(error);
              }}
            />
          ) : (
            <Card.Image source={{uri: uploadsUrl + file.filename}} />
          )}
          <Controller
            control={control}
            rules={{
              required: {
                value: true,
                message: 'is required',
              },
              minLength: {
                value: 3,
                message: 'Title min length is 3 characters.',
              },
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                placeholder="Title"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                errorMessage={errors.title && errors.title.message}
              />
            )}
            name="title"
          />
          <Controller
            control={control}
            rules={{
              minLength: {
                value: 5,
                message: 'Description min length is 5 characters.',
              },
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                placeholder="Description"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                errorMessage={errors.description && errors.description.message}
              />
            )}
            name="description"
          />
          <Button
            loading={loading}
            title="Modify"
            onPress={handleSubmit(modifyFile)}
          />
        </Card>
      </TouchableOpacity>
    </ScrollView>
  );
};

Modify.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

export default Modify;
