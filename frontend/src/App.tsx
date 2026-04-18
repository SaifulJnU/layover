import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import Navbar from './components/layout/Navbar'
import Home from './pages/Home'
import Explore from './pages/Explore'
import TripPlanner from './pages/TripPlanner'
import Budget from './pages/Budget'
import BudgetPlan from './pages/BudgetPlan'
import Outfits from './pages/Outfits'
import Split from './pages/Split'
import Rewards from './pages/Rewards'
import Social from './pages/Social'
import Pricing from './pages/Pricing'

export default function App() {
  return (
    <ThemeProvider>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"           element={<Home />}        />
        <Route path="/explore"    element={<Explore />}     />
        <Route path="/planner"    element={<TripPlanner />} />
        <Route path="/budget"     element={<Budget />}      />
        <Route path="/budget-plan" element={<BudgetPlan />} />
        <Route path="/outfits"    element={<Outfits />}     />
        <Route path="/split"      element={<Split />}       />
        <Route path="/rewards"    element={<Rewards />}     />
        <Route path="/social"     element={<Social />}      />
        <Route path="/pricing"    element={<Pricing />}     />
      </Routes>
    </BrowserRouter>
    </ThemeProvider>
  )
}