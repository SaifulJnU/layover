package handler

import (
	"net/http"
	"strings"

	"layover-backend/internal/repository"
	"layover-backend/pkg/model"

	"github.com/gin-gonic/gin"
)

var tropicalDests = []string{"bali", "maldives", "thailand", "phuket", "cancun", "miami", "dubai", "goa", "hawaii", "jamaica", "bora bora", "zanzibar", "sri lanka", "malaysia", "singapore", "vietnam", "indonesia", "philippines", "costa rica", "caribbean", "ibiza", "mykonos", "tenerife", "mauritius", "seychelles"}
var winterDests = []string{"iceland", "norway", "finland", "alaska", "lapland", "sweden", "switzerland", "canada", "greenland", "russia", "austria", "innsbruck", "reykjavik", "aspen", "banff", "quebec", "oslo", "stockholm", "helsinki", "zurich"}
var springDests = []string{"paris", "london", "amsterdam", "berlin", "tokyo", "kyoto", "new york", "barcelona", "rome", "lisbon", "madrid", "seoul", "milan", "venice", "florence", "prague", "budapest", "athens", "istanbul", "amsterdam"}
var fallDests = []string{"edinburgh", "portland", "seattle", "montreal", "copenhagen", "brussels", "vienna", "new england", "kyoto fall", "tuscany", "cape town"}

func detectSeason(destination string) string {
	dest := strings.ToLower(destination)
	for _, d := range tropicalDests {
		if strings.Contains(dest, d) {
			return "summer"
		}
	}
	for _, d := range winterDests {
		if strings.Contains(dest, d) {
			return "winter"
		}
	}
	for _, d := range springDests {
		if strings.Contains(dest, d) {
			return "spring"
		}
	}
	for _, d := range fallDests {
		if strings.Contains(dest, d) {
			return "fall"
		}
	}
	return ""
}

func GetOutfits(c *gin.Context) {
	season := strings.ToLower(c.Query("season"))
	destination := strings.TrimSpace(c.Query("destination"))

	detectedSeason := ""
	if destination != "" && (season == "" || season == "all") {
		detectedSeason = detectSeason(destination)
		if detectedSeason != "" {
			season = detectedSeason
		}
	}

	if season == "" || season == "all" {
		c.JSON(http.StatusOK, gin.H{"outfits": repository.MockOutfits, "detectedSeason": detectedSeason})
		return
	}

	results := []model.Outfit{}
	for _, o := range repository.MockOutfits {
		if o.Season == season {
			results = append(results, o)
		}
	}

	c.JSON(http.StatusOK, gin.H{"outfits": results, "detectedSeason": detectedSeason})
}