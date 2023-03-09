import React, {useEffect} from 'react';
import {StatusBar} from 'expo-status-bar';
import {MainProvider} from './contexts/MainContext';
import Navigator from './navigators/Navigator';
import {useFonts} from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

// NativeBase Components
import {extendTheme, NativeBaseProvider} from 'native-base';

const App = () => {
  const [fontsLoaded] = useFonts({
    Lobster: require('./assets/fonts/Lobster-Regular.ttf'),
    OpenSansRegular: require('./assets/fonts/OpenSans-Regular.ttf'),
    OpenSansSemiBold: require('./assets/fonts/OpenSans-SemiBold.ttf'),
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

  // Customized Theme
  const theme = extendTheme({
    components: {
      Button: {
        defaultProps: {
          colorScheme: 'orange',
          borderRadius: 10,
          _text: {
            color: 'black',
            fontFamily: 'OpenSansRegular',
            fontSize: 'lg',
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
      Text: {
        defaultProps: {
          fontFamily: 'OpenSansRegular',
          color: '#000',
        },
      },
      Heading: {
        defaultProps: {
          fontFamily: 'OpenSansSemiBold',
        },
      },
      PresenceTransition: {
        defaultProps: {
          initial: {
            opacity: 0,
          },
          animate: {
            opacity: 1,
            transition: {
              duration: 600,
            },
          },
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
