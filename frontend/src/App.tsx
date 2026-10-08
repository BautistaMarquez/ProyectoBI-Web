import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AuthGatekeeper from './components/auth/AuthGatekeeper'
import MainLayout from './components/layout/MainLayout'
import { ThemeProvider } from './context/ThemeContext'
import { FilterProvider } from './context/FilterContext'
import HomePlaceholder from './pages/HomePlaceholder'
import Pantalla2Devengados from './pages/Pantalla2Devengados'
import Pantalla3PagadosPesos from './pages/Pantalla3PagadosPesos'
import Pantalla4PagadosUsd from './pages/Pantalla4PagadosUsd'
import Pantalla5PendientesFc from './pages/Pantalla5PendientesFc'
import Pantalla6ReportePendientes from './pages/Pantalla6ReportePendientes'
import Pantalla7Reporte2025 from './pages/Pantalla7Reporte2025'
import Pantalla8EstadoObra from './pages/Pantalla8EstadoObra'

function App() {
  return (
    <ThemeProvider>
    <AuthGatekeeper>
    <FilterProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route index element={<HomePlaceholder />} />
            <Route path="pantalla-2" element={<Pantalla2Devengados />} />
            <Route path="pantalla-3" element={<Pantalla3PagadosPesos />} />
            <Route path="pantalla-4" element={<Pantalla4PagadosUsd />} />
            <Route path="pantalla-5" element={<Pantalla5PendientesFc />} />
            <Route path="pantalla-6" element={<Pantalla6ReportePendientes />} />
            <Route path="pantalla-7" element={<Pantalla7Reporte2025 />} />
            <Route path="pantalla-8" element={<Pantalla8EstadoObra />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </FilterProvider>
    </AuthGatekeeper>
    </ThemeProvider>
  )
}

export default App
