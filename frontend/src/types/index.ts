export interface Destination {
  id: string
  name: string
  country: string
  description: string
  image: string
  rating: number
  reviews: number
  priceLevel: number
  seasons: string[]
  activities: string[]
  weather: string
  avgTemp: number
  tags: string[]
  continent: string
}

export interface Forecast {
  day: string
  high: number
  low: number
  icon: string
  condition: string
}

export interface WeatherData {
  city: string
  country: string
  temperature: number
  feelsLike: number
  humidity: number
  windSpeed: number
  condition: string
  icon: string
  uvIndex: number
  forecast: Forecast[]
}

export interface Member {
  id: string
  name: string
  avatar: string
  paid: number
}

export interface Activity {
  time: string
  name: string
  type: string
  cost: number
  duration: string
  rating: number
  description: string
  address: string
}

export interface DayPlan {
  day: number
  date: string
  activities: Activity[]
}

export interface Trip {
  id: string
  name: string
  destination: string
  image: string
  startDate: string
  endDate: string
  budget: number
  members: Member[]
  itinerary: DayPlan[]
  totalSpent: number
  status: string
}

export interface Outfit {
  id: string
  tempRange: string
  season: string
  items: string[]
  style: string
  description: string
  colors: string[]
}

export interface BudgetSuggestion {
  destination: Destination
  estimatedCost: number
  breakdown: Record<string, number>
  duration: number
}

export type Season = 'all' | 'spring' | 'summer' | 'fall' | 'winter'
export type PriceLevel = 1 | 2 | 3 | 4