import {StatusBar} from 'expo-status-bar';
import {MainProvider} from './contexts/MainContext';
import Navigator from './navigators/Navigator';
import {extendTheme, NativeBaseProvider} from 'native-base';

const App = () => {
  const theme = extendTheme({
    components: {
      Button: {
        defaultProps: {
          backgroundColor: '#FE5D26',
          borderRadius: 10,
          _text: {
            color: 'black',
          },
        },
      },
      Input: {
        defaultProps: {
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
