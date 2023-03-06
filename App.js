import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {StatusBar} from 'expo-status-bar';
import {MainProvider} from './contexts/MainContext';
import Navigator from './navigators/Navigator';
import {extendTheme, NativeBaseProvider} from 'native-base';
import {useFonts} from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

const App = () => {
  const [fontsLoaded] = useFonts({
    JudsonRegular: require('./assets/fonts/Judson-Regular.ttf'),
    JudsonItalic: require('./assets/fonts/Judson-Italic.ttf'),
    JudsonBold: require('./assets/fonts/Judson-Bold.ttf'),
  });

  useEffect(() => {
    async function prepare() {
      // Keep the splash screen visible while we fetch resources
      await SplashScreen.preventAutoHideAsync();
    }
    prepare();
  }, []);

  if (!fontsLoaded) {
    return null;
  } else {
    SplashScreen.hideAsync();
  }

  const theme = extendTheme({
    components: {
      Button: {
        defaultProps: {
          colorScheme: 'orange',
          borderRadius: 10,
          _text: {
            color: 'black',
          },
        },
      },
      Input: {
        defaultProps: {
          color: 'black',
          backgroundColor: 'white',
          focusOutlineColor: '#FE5D26',
        },
      },
    },
    config: {
      initialColorMode: 'dark',
    },
  });

  return (
    <NativeBaseProvider theme={theme}>
      <MainProvider>
        <Navigator />
        <StatusBar style="auto" />
      </MainProvider>
    </NativeBaseProvider>
  );
};

export default App;
