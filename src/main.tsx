import React, { lazy, Suspense } from 'react'
import { configureStore } from '@reduxjs/toolkit'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import { motion } from 'framer-motion'
import storage from 'redux-persist/lib/storage'
import globalSlice from '@/state/global'
import { api } from '@/state/api'
import authReducer from '@/state'
import App from './App'
import './index.css'

const persistConfig = { key: 'root', storage, version: 1 }
const persistedReducer = persistReducer(persistConfig, authReducer)
const store = configureStore({
  reducer: {
    global: globalSlice,
    auth: persistedReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(api.middleware),
})

function Loading() {
  return (
    <div className="suspense">
      <CircularProgress />
    </div>
  )
}

const LazyApp = lazy(() => import('./App'))

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate
        loading={
          <Box className="suspense">
            <CircularProgress />
          </Box>
        }
        persistor={persistStore(store)}
      >
        <Suspense fallback={<Loading />}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="suspense"
          >
            <LazyApp />
          </motion.div>
        </Suspense>
      </PersistGate>
    </Provider>
  </React.StrictMode>
)
