import Admin from '@/scenes/admin'
import Breakdown from '@/scenes/breakdown'
import Customers from '@/scenes/customers'
import Daily from '@/scenes/daily'
import Dashboard from '@/scenes/dashboard'
import Geography from '@/scenes/geography'
import HomePage from '@/scenes/homePage'
import LandingPage from '@/scenes/landingPage'
import Layout from '@/scenes/layout'
import LoginPage from '@/scenes/loginPage'
import Monthly from '@/scenes/monthly'
import Overview from '@/scenes/overview'
import Performance from '@/scenes/performance'
import Products from '@/scenes/products'
import ProfilePage from '@/scenes/profilePage'
import Transactions from '@/scenes/transactions'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { createTheme } from '@mui/material/styles'
import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import HttpApi from 'i18next-http-backend'
import { useMemo } from 'react'
import { initReactI18next } from 'react-i18next'
import { useSelector } from 'react-redux'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from 'react-router-dom'
import { themeSettings } from './theme'

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(HttpApi)
  .init({
    supportedLngs: ['en', 'ee', 'fi', 'swe', 'nor', 'rus', 'ukr'],
    fallbackLng: 'en',
    detection: {
      order: ['cookie', 'htmlTag', 'localStorage', 'path', 'subdomain'],
      caches: ['cookie'],
    },
    backend: {
      loadPath: '/assets/translations/{{lng}}/translation.json',
    },
    react: { useSuspense: false },
  })

function App() {
  const mode = useSelector((state) => state.auth.mode)
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode])
  const isAuth = Boolean(useSelector((state) => state.auth.token))

  const routers = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/home"
          element={isAuth ? <Layout /> : <Navigate to="/" />}
        />
        <Route
          path="/profile/:userId"
          element={isAuth ? <ProfilePage /> : <Navigate to="/" />}
        />

        {/* dashboard */}
        <Route
          path="/dashboard"
          element={isAuth ? <Layout /> : <Navigate to="/" />}
        >
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="customers" element={<Customers />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="geography" element={<Geography />} />
          <Route path="overview" element={<Overview />} />
          <Route path="daily" element={<Daily />} />
          <Route path="monthly" element={<Monthly />} />
          <Route path="breakdown" element={<Breakdown />} />
          <Route path="admin" element={<Admin />} />
          <Route path="performance" element={<Performance />} />
        </Route>
      </>
    )
  )

  return (
    <div className="app">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterProvider router={routers} />
      </ThemeProvider>
    </div>
  )
}

export default App
