package handler

import (
	"net/http"
	"strings"

	"layover-backend/internal/repository"
	"layover-backend/pkg/model"

	"github.com/gin-gonic/gin"
)

func GetRewards(c *gin.Context) {
	c.JSON(http.StatusOK, repository.MockRewards)
}

func GetLeaderboard(c *gin.Context) {
	filterType := strings.ToLower(c.Query("filter"))  // global | connections | country | city
	country := strings.ToLower(c.Query("country"))
	city := strings.ToLower(c.Query("city"))

	filtered := []model.LeaderboardEntry{}

	for _, entry := range repository.MockLeaderboard {
		switch filterType {
		case "connections":
			if entry.IsConnection || entry.UserName == "You" {
				filtered = append(filtered, entry)
			}
		case "country":
			if country == "" || strings.ToLower(entry.Country) == country {
				filtered = append(filtered, entry)
			}
		case "city":
			if city == "" || strings.ToLower(entry.City) == city {
				filtered = append(filtered, entry)
			}
		default: // global
			filtered = append(filtered, entry)
		}
	}

	// Re-rank after filtering
	for i := range filtered {
		filtered[i].Rank = i + 1
	}

	// Collect unique countries and cities for filter dropdowns
	countrySet := map[string]bool{}
	citySet := map[string]bool{}
	for _, e := range repository.MockLeaderboard {
		countrySet[e.Country] = true
		citySet[e.City] = true
	}
	countries := []string{}
	cities := []string{}
	for k := range countrySet {
		countries = append(countries, k)
	}
	for k := range citySet {
		cities = append(cities, k)
	}

	c.JSON(http.StatusOK, gin.H{
		"leaderboard": filtered,
		"total":       len(filtered),
		"countries":   countries,
		"cities":      cities,
	})
}

func ClaimReward(c *gin.Context) {
	rewardID := c.Param("id")
	for i, r := range repository.MockRewards.AvailableRewards {
		if r.ID == rewardID && !r.Claimed {
			repository.MockRewards.AvailableRewards[i].Claimed = true
			repository.MockRewards.Points -= r.PointsCost
			c.JSON(http.StatusOK, gin.H{"success": true, "remaining_points": repository.MockRewards.Points})
			return
		}
	}
	c.JSON(http.StatusBadRequest, gin.H{"error": "Reward not found or already claimed"})
}