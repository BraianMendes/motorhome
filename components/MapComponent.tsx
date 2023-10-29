import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, Text, Dimensions, Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import SearchBar from './SearchBar';
import * as Location from 'expo-location';
import { getRoute } from '../services/ORSRoutingService';

interface LocationState {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

const MapComponent = () => {
  const [currentLocation, setCurrentLocation] = useState<LocationState | null>(null);
  const [routeData, setRouteData] = useState<any | null>(null); // Adicionando estado para a rota

  useEffect(() => {
    (async () => {
      // Solicita permissão para acessar a localização
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        // Você pode querer adicionar um alerta para o usuário aqui
        return;
      }

      // Pega a localização atual
      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })();
  }, []);

  const handleDestinationSelect = useCallback(async (destination: { latitude: number; longitude: number; }) => {
    if (!currentLocation) return;
    try {
      const data = await getRoute([currentLocation.latitude, currentLocation.longitude], [destination.latitude, destination.longitude]);
      setRouteData(data);
    } catch (error) {
      Alert.alert("Erro", "Falha ao buscar a rota.");
    }
  }, [currentLocation]);

  if (!currentLocation) {
    return <Text>Carregando...</Text>;
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={currentLocation}
        showsUserLocation={true}
      >
        <Marker
          coordinate={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
          }}
          title="Minha Localização"
        />
        {routeData && (
          <Polyline
            coordinates={routeData.features[0].geometry.coordinates.map((coord: any[]) => ({ latitude: coord[1], longitude: coord[0] }))}
            strokeWidth={4}
            strokeColor="blue"
          />
        )}
      </MapView>
      <SearchBar onSelectDestination={handleDestinationSelect} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default MapComponent;