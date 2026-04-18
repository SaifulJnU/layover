import axios from 'axios'

const BASE = '/api'

// Named convenience exports (used by pages)
export const fetchDestinations = (params: Record<string, string>) => api.destinations.list(params)
export const fetchWeather = (city: string) => api.weather.current(city)
export const fetchBudgetSuggestions = (amount: number, duration: number) => api.budget.suggestions(amount, duration)
export const fetchTrips = () => api.trips.list()
export const createTrip = (trip: object) => api.trips.create(trip)
export const generateItinerary = (id: string) => api.trips.generateItinerary(id)
export const fetchOutfits = (season?: string, destination?: string) => api.outfits.list(season, destination)

export const api = {
  destinations: {
    list: (params: Record<string, string>) =>
      axios.get(`${BASE}/destinations?${new URLSearchParams(params)}`).then(r => r.data),
    get: (id: string) =>
      axios.get(`${BASE}/destinations/${id}`).then(r => r.data),
  },

  weather: {
    current: (city: string) =>
      axios.get(`${BASE}/weather?city=${encodeURIComponent(city)}`).then(r => r.data),
    analysis: (city: string) =>
      axios.get(`${BASE}/weather/analysis?city=${encodeURIComponent(city)}`).then(r => r.data),
  },

  trips: {
    list: () => axios.get(`${BASE}/trips`).then(r => r.data),
    get: (id: string) => axios.get(`${BASE}/trips/${id}`).then(r => r.data),
    create: (trip: object) => axios.post(`${BASE}/trips`, trip).then(r => r.data),
    generateItinerary: (id: string) =>
      axios.post(`${BASE}/trips/${id}/generate-itinerary`).then(r => r.data),
  },

  budget: {
    suggestions: (amount: number, duration: number) =>
      axios.get(`${BASE}/budget/suggestions?amount=${amount}&duration=${duration}`).then(r => r.data),
    plans: {
      list: () => axios.get(`${BASE}/budget/plans`).then(r => r.data),
      get: (id: string) => axios.get(`${BASE}/budget/plans/${id}`).then(r => r.data),
      create: (plan: object) => axios.post(`${BASE}/budget/plans`, plan).then(r => r.data),
      addExpense: (id: string, expense: object) =>
        axios.post(`${BASE}/budget/plans/${id}/expenses`, expense).then(r => r.data),
    },
  },

  outfits: {
    list: (season?: string, destination?: string) => {
      const params = new URLSearchParams()
      if (season && season !== 'all') params.set('season', season)
      if (destination) params.set('destination', destination)
      const query = params.toString() ? `?${params}` : ''
      return axios.get(`${BASE}/outfits${query}`).then(r => r.data)
    },
  },

  splits: {
    list: () => axios.get(`${BASE}/splits`).then(r => r.data),
    get: (id: string) => axios.get(`${BASE}/splits/${id}`).then(r => r.data),
    addExpense: (id: string, expense: object) =>
      axios.post(`${BASE}/splits/${id}/expenses`, expense).then(r => r.data),
    settle: (id: string, debt: object) =>
      axios.post(`${BASE}/splits/${id}/settle`, debt).then(r => r.data),
  },

  rewards: {
    get: () => axios.get(`${BASE}/rewards`).then(r => r.data),
    leaderboard: (filter?: string) =>
      axios.get(`${BASE}/rewards/leaderboard${filter ? `?filter=${filter}` : ''}`).then(r => r.data),
    claim: (id: string) => axios.post(`${BASE}/rewards/${id}/claim`).then(r => r.data),
  },

  social: {
    feed: () => axios.get(`${BASE}/social/feed`).then(r => r.data),
    createPost: (post: object) => axios.post(`${BASE}/social/posts`, post).then(r => r.data),
    like: (id: string) => axios.post(`${BASE}/social/posts/${id}/like`).then(r => r.data),
  },

  subscriptions: {
    plans: () => axios.get(`${BASE}/subscriptions/plans`).then(r => r.data),
    current: () => axios.get(`${BASE}/subscriptions/current`).then(r => r.data),
    subscribe: (plan: object) => axios.post(`${BASE}/subscriptions/subscribe`, plan).then(r => r.data),
    cancel: () => axios.delete(`${BASE}/subscriptions/cancel`).then(r => r.data),
  },

  invites: {
    list: () => axios.get(`${BASE}/invites`).then(r => r.data),
    send: (invite: object) => axios.post(`${BASE}/invites`, invite).then(r => r.data),
    respond: (id: string, response: object) =>
      axios.put(`${BASE}/invites/${id}/respond`, response).then(r => r.data),
    remove: (id: string) => axios.delete(`${BASE}/invites/${id}`).then(r => r.data),
  },
}