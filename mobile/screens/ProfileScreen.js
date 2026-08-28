import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  ActivityIndicator
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('favorites')

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user')
      if (userData) {
        setUser(JSON.parse(userData))
      }
      setLoading(false)
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token')
      await AsyncStorage.removeItem('user')
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }]
      })
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF0000" />
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <Text style={styles.profileIcon}>👤</Text>
        <Text style={styles.profileName}>{user?.name || 'Usuário'}</Text>
        <Text style={styles.profileEmail}>{user?.email}</Text>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'favorites' && styles.tabButtonActive
          ]}
          onPress={() => setActiveTab('favorites')}
        >
          <Text style={styles.tabButtonText}>❤️ Favoritos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'watchlist' && styles.tabButtonActive
          ]}
          onPress={() => setActiveTab('watchlist')}
        >
          <Text style={styles.tabButtonText}>📺 Watchlist</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        {activeTab === 'favorites' ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Nenhum favorito ainda</Text>
            <Text style={styles.emptySubtext}>
              Adicione filmes aos favoritos para vê-los aqui!
            </Text>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Watchlist vazia</Text>
            <Text style={styles.emptySubtext}>
              Adicione filmes à watchlist para vê-los aqui!
            </Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutButtonText}>Sair da Conta</Text>
      </TouchableOpacity>
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f0f0f'
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 30,
    borderBottomColor: '#FF0000',
    borderBottomWidth: 2,
    marginBottom: 20
  },
  profileIcon: {
    fontSize: 50,
    marginBottom: 10
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5
  },
  profileEmail: {
    fontSize: 14,
    color: '#aaa'
  },
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    borderBottomColor: '#333',
    borderBottomWidth: 1
  },
  tabButton: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomColor: 'transparent',
    borderBottomWidth: 2
  },
  tabButtonActive: {
    borderBottomColor: '#FF0000'
  },
  tabButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14
  },
  contentContainer: {
    minHeight: 300,
    paddingHorizontal: 20
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60
  },
  emptyText: {
    color: '#aaa',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10
  },
  emptySubtext: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center'
  },
  logoutButton: {
    backgroundColor: '#FF0000',
    marginHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16
  }
})
