import React, { useState } from 'react';
import { View, FlatList, TouchableOpacity, Text } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { getDestinationCoordinates } from '../services/ORSRoutingService';

interface DestinationItem {
  label: string;
  lat: number;
  lon: number;
}

interface SearchBarProps {
  onSelectDestination: (destination: {latitude: number, longitude: number}) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSelectDestination }) => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [destinations, setDestinations] = useState<DestinationItem[]>([]);

    const onChangeSearch = async (query: string) => {
        setSearchQuery(query);
        const results = await getDestinationCoordinates(query);
        setDestinations(results);
    };

    const handleSelectDestination = (destination: DestinationItem) => {
        onSelectDestination({
            latitude: destination.lat,
            longitude: destination.lon,
        });
        setSearchQuery(destination.label);
        setDestinations([]);
    };

    return (
        <View>
            <Searchbar
                placeholder="Digite um destino"
                onChangeText={onChangeSearch}
                value={searchQuery}
            />
            {destinations.length > 0 && (
                <FlatList
                    data={destinations}
                    keyExtractor={(item) => item.label}
                    renderItem={({ item }: any) => (
                        <TouchableOpacity onPress={() => handleSelectDestination(item)}>
                            <Text>{item.label}</Text>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
}

export default SearchBar;