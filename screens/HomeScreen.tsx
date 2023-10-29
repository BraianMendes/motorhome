import { View, Text } from 'react-native';
import MapComponent from '../components/MapComponent';

const HomeScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home Screen</Text>
      {/* O componente do mapa será renderizado aqui */}
      <MapComponent />
    </View>
  );
};

export default HomeScreen;