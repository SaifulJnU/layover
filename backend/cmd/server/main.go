package main

import (
	"layover-backend/internal/handler"
	"layover-backend/internal/middleware"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	r.Use(middleware.CORS())

	api := r.Group("/api")
	{
		// Destinations & weather
		api.GET("/destinations", handler.GetDestinations)
		api.GET("/destinations/:id", handler.GetDestination)
		api.GET("/weather", handler.GetWeather)
		api.GET("/weather/analysis", handler.GetWeatherAnalysis)

		// Trips
		api.GET("/trips", handler.GetTrips)
		api.GET("/trips/:id", handler.GetTrip)
		api.POST("/trips", handler.CreateTrip)
		api.POST("/trips/:id/share", handler.ShareTrip)
		api.POST("/trips/:id/generate-itinerary", handler.GenerateItinerary)

		// Outfits & budget
		api.GET("/outfits", handler.GetOutfits)
		api.GET("/budget/suggestions", handler.GetBudgetSuggestions)

		// Split payments
		api.GET("/splits", handler.GetSplits)
		api.GET("/splits/:id", handler.GetSplitGroup)
		api.POST("/splits/:id/expenses", handler.AddExpense)
		api.POST("/splits/:id/settle", handler.SettleDebt)

		// Rewards
		api.GET("/rewards", handler.GetRewards)
		api.GET("/rewards/leaderboard", handler.GetLeaderboard)
		api.POST("/rewards/:id/claim", handler.ClaimReward)

		// Social
		api.GET("/social/feed", handler.GetFeed)
		api.POST("/social/posts", handler.CreatePost)
		api.POST("/social/posts/:id/like", handler.LikePost)

		// Invites
		api.GET("/invites", handler.GetInvites)
		api.POST("/invites", handler.SendInvite)
		api.PUT("/invites/:id/respond", handler.RespondInvite)
		api.DELETE("/invites/:id", handler.DeleteInvite)

		// Budget plans
		api.GET("/budget/plans", handler.GetBudgetPlans)
		api.GET("/budget/plans/:id", handler.GetBudgetPlan)
		api.POST("/budget/plans", handler.CreateBudgetPlan)
		api.POST("/budget/plans/:id/expenses", handler.AddBudgetExpense)
		api.PUT("/budget/plans/:id/categories/:cat", handler.UpdateCategoryAllocation)

		// Subscriptions
		api.GET("/subscriptions/plans", handler.GetPlans)
		api.GET("/subscriptions/current", handler.GetCurrentPlan)
		api.POST("/subscriptions/subscribe", handler.Subscribe)
		api.DELETE("/subscriptions/cancel", handler.CancelSubscription)
	}

	r.Run(":8080")
}