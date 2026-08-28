import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'

const API_URL = 'http://localhost:3001/api'

export default function LoginScreen({ navigation }) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!email || !password) {
      setError('Email e senha são obrigatórios')
      return
    }

    if (!isLogin && !name) {
      setError('Nome é obrigatório')
      return
    }

    try {
      setLoading(true)
      setError('')

      const endpoint = isLogin ? '/auth/login' : '/auth/register'
      const data = isLogin
        ? { email, password }
        : { email, password, name }

      const response = await axios.post(`${API_URL}${endpoint}`, data)

      if (response.data.token) {
        await AsyncStorage.setItem('token', response.data.token)
        await AsyncStorage.setItem(
          'user',
          JSON.stringify(response.data.user)
        )

        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }]
        })
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao fazer login')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.logo}>🎬</Text>
          <Text style={styles.title}>SlaRFlix</Text>
          <Text style={styles.subtitle}>
            {isLogin ? 'Faça login na sua conta' : 'Crie uma nova conta'}
          </Text>
        </View>

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.formContainer}>
          {!isLogin && (
            <TextInput
              style={styles.input}
              placeholder="Seu Nome"
              placeholderTextColor="#666"
              value={name}
              onChangeText={setName}
              editable={!loading}
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#666"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            editable={!loading}
          />

          <TextInput
            style={styles.input}
            placeholder="Senha"
            placeholderTextColor="#666"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loading}
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.buttonText}>
                {isLogin ? 'Entrar' : 'Registrar'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {isLogin ? 'Não tem conta? ' : 'Já tem conta? '}
          </Text>
          <TouchableOpacity onPress={() => {
            setIsLogin(!isLogin)
            setError('')
            setEmail('')
            setPassword('')
            setName('')
          }}>
            <Text style={styles.footerLink}>
              {isLogin ? 'Registre-se' : 'Faça login'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f'
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20
  },
  header: {
    alignItems: 'center',
    marginBottom: 40
  },
  logo: {
    fontSize: 50,
    marginBottom: 10
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF0000',
    marginBottom: 10
  },
  subtitle: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center'
  },
  errorContainer: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 6,
    marginBottom: 20
  },
  errorText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center'
  },
  formContainer: {
    marginBottom: 30
  },
  input: {
    backgroundColor: '#1a1a1a',
    borderColor: '#FF0000',
    borderWidth: 2,
    borderRadius: 6,
    paddingHorizontal: 15,
    paddingVertical: 12,
    color: '#fff',
    fontSize: 14,
    marginBottom: 15,
    fontFamily: 'System'
  },
  button: {
    backgroundColor: '#FF0000',
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10
  },
  buttonDisabled: {
    opacity: 0.7
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  footerText: {
    color: '#aaa',
    fontSize: 14
  },
  footerLink: {
    color: '#FF0000',
    fontWeight: '600',
    fontSize: 14
  }
})
