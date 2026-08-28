import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native'
import axios from 'axios'

const API_BASE_URL = 'https://api.themoviedb.org/3'
const TMDB_API_KEY = 'bf233cfa7af75481bf196e65030a4114'

export default function HomeScreen() {
  const [popularMovies, setPopularMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchPopularMovies()
  }, [])

  const fetchPopularMovies = async () => {
    try {
      setLoading(true)
      const response = await axios.get(
        `${API_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=pt-BR&region=BR&sort_by=popularity.desc&page=1`
      )
      setPopularMovies(response.data.results.slice(0, 10))
      setError(null)
    } catch (err) {
      setError('Erro ao carregar filmes')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF0000" />
        <Text style={styles.loadingText}>Carregando filmes...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>❌ {error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={fetchPopularMovies}
        >
          <Text style={styles.retryText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🎬 SlaRFlix</Text>
        <Text style={styles.tagline}>Filmes em Streaming</Text>
      </View>

      <Text style={styles.sectionTitle}>🔥 Filmes Populares</Text>

      <FlatList
        horizontal
        data={popularMovies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.movieCard}>
            <Image
              source={{
                uri: `https://image.tmdb.org/t/p/w500${item.poster_path}`
              }}
              style={styles.movieImage}
            />
            <View style={styles.movieInfo}>
              <Text style={styles.movieTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.movieRating}>
                ⭐ {item.vote_average.toFixed(1)}/10
              </Text>
            </View>
          </TouchableOpacity>
        )}
        scrollEnabled={true}
        showsHorizontalScrollIndicator={false}
      />

      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>❤️ Favoritos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>📺 Watchlist</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f'
  },
  centerContainer: {
    flex: 1,
    backgroundColor: '#0f0f0f',
    justifyContent: 'center',
    alignItems: 'center'
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomColor: '#FF0000',
    borderBottomWidth: 2
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF0000',
    marginBottom: 5
  },
  tagline: {
    fontSize: 14,
    color: '#aaa'
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 20,
    marginTop: 25,
    marginBottom: 15
  },
  movieCard: {
    marginLeft: 20,
    marginRight: 10,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#1a1a1a'
  },
  movieImage: {
    width: 150,
    height: 225,
    resizeMode: 'cover'
  },
  movieInfo: {
    padding: 10,
    backgroundColor: '#1a1a1a'
  },
  movieTitle: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 5
  },
  movieRating: {
    color: '#ffc107',
    fontSize: 11,
    fontWeight: '600'
  },
  loadingText: {
    color: '#aaa',
    marginTop: 10,
    fontSize: 16
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 16,
    marginBottom: 20
  },
  retryButton: {
    backgroundColor: '#FF0000',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 6
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 30,
    marginBottom: 20
  },
  actionButton: {
    backgroundColor: '#FF0000',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 6
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14
  }
})
