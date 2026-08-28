import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import AsyncStorage from '@react-native-async-storage/async-storage'

// Screens
import HomeScreen from './screens/HomeScreen'
import SearchScreen from './screens/SearchScreen'
import ProfileScreen from './screens/ProfileScreen'
import LoginScreen from './screens/LoginScreen'

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1a1a1a'
        },
        headerTintColor: '#FF0000',
        headerTitleStyle: {
          fontWeight: 'bold',
          color: '#fff'
        }
      }}
    >
      <Stack.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{ title: '🎬 SlaRFlix' }}
      />
    </Stack.Navigator>
  )
}

const SearchStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1a1a1a'
        },
        headerTintColor: '#FF0000'
      }}
    >
      <Stack.Screen
        name="SearchTab"
        component={SearchScreen}
        options={{ title: '🔍 Buscar' }}
      />
    </Stack.Navigator>
  )
}

const ProfileStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1a1a1a'
        },
        headerTintColor: '#FF0000'
      }}
    >
      <Stack.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{ title: '👤 Perfil' }}
      />
    </Stack.Navigator>
  )
}

export default function App() {
  const [userToken, setUserToken] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    bootstrapAsync()
  }, [])

  const bootstrapAsync = async () => {
    try {
      const token = await AsyncStorage.getItem('token')
      setUserToken(token)
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return null
  }

  return (
    <NavigationContainer>
      {userToken == null ? (
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      ) : (
        <Tab.Navigator
          screenOptions={{
            tabBarStyle: {
              backgroundColor: '#1a1a1a',
              borderTopColor: '#FF0000',
              borderTopWidth: 2,
              paddingBottom: 5
            },
            tabBarActiveTintColor: '#FF0000',
            tabBarInactiveTintColor: '#666',
            headerShown: false
          }}
        >
          <Tab.Screen
            name="Home"
            component={HomeStack}
            options={{
              tabBarLabel: 'Início',
              tabBarIcon: ({ color }) => (
                <Text style={{ fontSize: 20 }}>🏠</Text>
              )
            }}
          />
          <Tab.Screen
            name="Search"
            component={SearchStack}
            options={{
              tabBarLabel: 'Buscar',
              tabBarIcon: ({ color }) => (
                <Text style={{ fontSize: 20 }}>🔍</Text>
              )
            }}
          />
          <Tab.Screen
            name="Profile"
            component={ProfileStack}
            options={{
              tabBarLabel: 'Perfil',
              tabBarIcon: ({ color }) => (
                <Text style={{ fontSize: 20 }}>👤</Text>
              )
            }}
          />
        </Tab.Navigator>
      )}
    </NavigationContainer>
  )
}

import { Text } from 'react-native'
