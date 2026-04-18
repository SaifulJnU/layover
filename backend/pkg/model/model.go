package model

type Destination struct {
	ID          string   `json:"id"`
	Name        string   `json:"name"`
	Country     string   `json:"country"`
	Description string   `json:"description"`
	Image       string   `json:"image"`
	Rating      float64  `json:"rating"`
	Reviews     int      `json:"reviews"`
	PriceLevel  int      `json:"priceLevel"`
	Seasons     []string `json:"seasons"`
	Activities  []string `json:"activities"`
	Weather     string   `json:"weather"`
	AvgTemp     int      `json:"avgTemp"`
	Tags        []string `json:"tags"`
	Continent   string   `json:"continent"`
}

type WeatherData struct {
	City        string     `json:"city"`
	Country     string     `json:"country"`
	Temperature int        `json:"temperature"`
	FeelsLike   int        `json:"feelsLike"`
	Humidity    int        `json:"humidity"`
	WindSpeed   int        `json:"windSpeed"`
	Condition   string     `json:"condition"`
	Icon        string     `json:"icon"`
	UVIndex     int        `json:"uvIndex"`
	Forecast    []Forecast `json:"forecast"`
}

type Forecast struct {
	Day       string `json:"day"`
	High      int    `json:"high"`
	Low       int    `json:"low"`
	Icon      string `json:"icon"`
	Condition string `json:"condition"`
}

type Trip struct {
	ID          string    `json:"id"`
	Name        string    `json:"name"`
	Destination string    `json:"destination"`
	Image       string    `json:"image"`
	StartDate   string    `json:"startDate"`
	EndDate     string    `json:"endDate"`
	Budget      float64   `json:"budget"`
	Members     []Member  `json:"members"`
	Itinerary   []DayPlan `json:"itinerary"`
	TotalSpent  float64   `json:"totalSpent"`
	Status      string    `json:"status"`
}

type Member struct {
	ID     string  `json:"id"`
	Name   string  `json:"name"`
	Avatar string  `json:"avatar"`
	Paid   float64 `json:"paid"`
}

type DayPlan struct {
	Day        int        `json:"day"`
	Date       string     `json:"date"`
	Activities []Activity `json:"activities"`
}

type Activity struct {
	Time        string  `json:"time"`
	Name        string  `json:"name"`
	Type        string  `json:"type"`
	Cost        float64 `json:"cost"`
	Duration    string  `json:"duration"`
	Rating      float64 `json:"rating"`
	Description string  `json:"description"`
	Address     string  `json:"address"`
}

type Outfit struct {
	ID          string   `json:"id"`
	TempRange   string   `json:"tempRange"`
	Season      string   `json:"season"`
	Items       []string `json:"items"`
	Style       string   `json:"style"`
	Description string   `json:"description"`
	Colors      []string `json:"colors"`
}

type BudgetSuggestion struct {
	Destination   Destination        `json:"destination"`
	EstimatedCost float64            `json:"estimatedCost"`
	Breakdown     map[string]float64 `json:"breakdown"`
	Duration      int                `json:"duration"`
}

type SearchFilters struct {
	Query     string  `form:"q"`
	Season    string  `form:"season"`
	MinRating float64 `form:"minRating"`
	MaxPrice  int     `form:"maxPrice"`
	Continent string  `form:"continent"`
}

// Split models
type SplitGroup struct {
	ID         string    `json:"id"`
	TripID     string    `json:"tripId"`
	Name       string    `json:"name"`
	Currency   string    `json:"currency"`
	Members    []Member  `json:"members"`
	Expenses   []Expense `json:"expenses"`
	Balances   []Balance `json:"balances"`
	TotalSpent float64   `json:"totalSpent"`
}

type Expense struct {
	ID          string   `json:"id"`
	Description string   `json:"description"`
	Amount      float64  `json:"amount"`
	PaidBy      string   `json:"paidBy"`
	SplitWith   []string `json:"splitWith"`
	Category    string   `json:"category"`
	Date        string   `json:"date"`
}

type Balance struct {
	From    string  `json:"from"`
	To      string  `json:"to"`
	Amount  float64 `json:"amount"`
	Settled bool    `json:"settled"`
}

// Rewards models
type RewardsProfile struct {
	UserID           string    `json:"userId"`
	UserName         string    `json:"userName"`
	Points           int       `json:"points"`
	Level            string    `json:"level"`
	LevelProgress    int       `json:"levelProgress"`
	NextLevelPoints  int       `json:"nextLevelPoints"`
	TotalTrips       int       `json:"totalTrips"`
	TotalCountries   int       `json:"totalCountries"`
	Badges           []Badge   `json:"badges"`
	AvailableRewards []Reward  `json:"availableRewards"`
	History          []PointEvent `json:"history"`
}

type Badge struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Icon        string `json:"icon"`
	Description string `json:"description"`
	Earned      bool   `json:"earned"`
	EarnedDate  string `json:"earnedDate,omitempty"`
}

type Reward struct {
	ID          string `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	PointsCost  int    `json:"pointsCost"`
	Category    string `json:"category"`
	Claimed     bool   `json:"claimed"`
	Icon        string `json:"icon"`
}

type PointEvent struct {
	Description string `json:"description"`
	Points      int    `json:"points"`
	Date        string `json:"date"`
	Type        string `json:"type"`
}

type LeaderboardEntry struct {
	Rank         int    `json:"rank"`
	UserName     string `json:"userName"`
	Points       int    `json:"points"`
	Level        string `json:"level"`
	Trips        int    `json:"trips"`
	Avatar       string `json:"avatar"`
	Country      string `json:"country"`
	City         string `json:"city"`
	IsConnection bool   `json:"isConnection"`
}

// Weather analysis
type WeatherAnalysis struct {
	City           string   `json:"city"`
	Score          int      `json:"score"`
	Verdict        string   `json:"verdict"`
	VerdictEmoji   string   `json:"verdictEmoji"`
	VerdictText    string   `json:"verdictText"`
	Reasons        []string `json:"reasons"`
	Warnings       []string `json:"warnings"`
	Tips           []string `json:"tips"`
	BestMonths     []string `json:"bestMonths"`
	Recommendation string   `json:"recommendation"`
	ForecastNote   string   `json:"forecastNote"`
}

// Social models
type Post struct {
	ID          string   `json:"id"`
	UserName    string   `json:"userName"`
	UserAvatar  string   `json:"userAvatar"`
	Destination string   `json:"destination"`
	Country     string   `json:"country"`
	Caption     string   `json:"caption"`
	Images      []string `json:"images"`
	Likes       int      `json:"likes"`
	Comments    []Comment `json:"comments"`
	Tags        []string `json:"tags"`
	CreatedAt   string   `json:"createdAt"`
	Liked       bool     `json:"liked"`
	TripID      string   `json:"tripId,omitempty"`
}

type Comment struct {
	ID       string `json:"id"`
	UserName string `json:"userName"`
	Text     string `json:"text"`
	Date     string `json:"date"`
}

// Invite models
type Invite struct {
	ID         string `json:"id"`
	TripID     string `json:"tripId"`
	TripName   string `json:"tripName"`
	FromUser   string `json:"fromUser"`
	ToEmail    string `json:"toEmail"`
	Message    string `json:"message"`
	Status     string `json:"status"` // pending, accepted, declined
	InviteLink string `json:"inviteLink"`
	CreatedAt  string `json:"createdAt"`
}

// Budget Plan models
type BudgetPlan struct {
	ID          string                    `json:"id"`
	TripName    string                    `json:"tripName"`
	Destination string                    `json:"destination"`
	TotalBudget float64                   `json:"totalBudget"`
	Currency    string                    `json:"currency"`
	Duration    int                       `json:"duration"`
	Categories  map[string]BudgetCategory `json:"categories"`
	Expenses    []BudgetExpense           `json:"expenses"`
	CreatedAt   string                    `json:"createdAt"`
}

type BudgetCategory struct {
	Label     string  `json:"label"`
	Allocated float64 `json:"allocated"`
	Spent     float64 `json:"spent"`
	Color     string  `json:"color"`
	Icon      string  `json:"icon"`
}

type BudgetExpense struct {
	ID          string  `json:"id"`
	Description string  `json:"description"`
	Amount      float64 `json:"amount"`
	Category    string  `json:"category"`
	Date        string  `json:"date"`
}

// Subscription models
type SubscriptionPlan struct {
	ID           string   `json:"id"`
	Name         string   `json:"name"`
	MonthlyPrice float64  `json:"monthlyPrice"`
	YearlyPrice  float64  `json:"yearlyPrice"`
	Description  string   `json:"description"`
	Features     []string `json:"features"`
	Color        string   `json:"color"`
	Popular      bool     `json:"popular"`
	BonusPoints  int      `json:"bonusPoints"`
}

type Subscription struct {
	PlanID     string  `json:"planId"`
	PlanName   string  `json:"planName"`
	Billing    string  `json:"billing"`
	Price      float64 `json:"price"`
	Status     string  `json:"status"`
	StartDate  string  `json:"startDate"`
	NextBill   string  `json:"nextBill"`
	CancelDate string  `json:"cancelDate,omitempty"`
	CardLast   string  `json:"cardLast"`
}