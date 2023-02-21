import {StatusBar} from 'expo-status-bar';
import {MainProvider} from './contexts/MainContext';
import Navigator from './navigators/Navigator';
import {NativeBaseProvider} from 'native-base';
import {useFonts} from 'expo-font';

const App = () => {
  const [loaded] = useFonts({
    JudsonRegular: require('./assets/fonts/Judson-Regular.ttf'),
    JudsonItalic: require('./assets/fonts/Judson-Italic.ttf'),
    JudsonBold: require('./assets/fonts/Judson-Bold.ttf'),
  });

  if (!loaded) {
    return null;
  }
  return (
    <NativeBaseProvider>
      <MainProvider>
        <Navigator />
        <StatusBar style="auto" />
      </MainProvider>
    </NativeBaseProvider>
  );
};

export default App;
