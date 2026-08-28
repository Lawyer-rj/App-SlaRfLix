import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native'
import axios from 'axios'

const API_BASE_URL = 'https://api.themoviedb.org/3'
const TMDB_API_KEY = 'bf233cfa7af75481bf196e65030a4114'

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    try {
      setLoading(true)
      setSearched(true)
      const response = await axios.get(
        `${API_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${searchQuery}&language=pt-BR&page=1`
      )
      setResults(response.data.results)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar filmes..."
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearch}
        >
          <Text style={styles.searchButtonText}>🔍</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#FF0000" />
        </View>
      ) : searched && results.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>Nenhum filme encontrado</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.movieCard}>
              <Image
                source={{
                  uri: `https://image.tmdb.org/t/p/w500${item.poster_path}`
                }}
                style={styles.movieImage}
              />
              <Text style={styles.movieTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.movieYear}>
                {new Date(item.release_date).getFullYear()}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f'
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomColor: '#333',
    borderBottomWidth: 1
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderColor: '#FF0000',
    borderWidth: 2,
    borderRadius: 6,
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: '#fff',
    fontSize: 14,
    marginRight: 10
  },
  searchButton: {
    backgroundColor: '#FF0000',
    paddingHorizontal: 15,
    justifyContent: 'center',
    borderRadius: 6
  },
  searchButtonText: {
    fontSize: 18
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyText: {
    color: '#666',
    fontSize: 16
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 15
  },
  movieCard: {
    width: '48%',
    marginBottom: 15
  },
  movieImage: {
    width: '100%',
    height: 200,
    borderRadius: 6,
    marginBottom: 8
  },
  movieTitle: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600'
  },
  movieYear: {
    color: '#aaa',
    fontSize: 11,
    marginTop: 3
  },
  listContent: {
    paddingHorizontal: 5
  }
})
