package handler

import (
	"net/http"
	"strconv"

	"layover-backend/internal/repository"
	"layover-backend/pkg/model"

	"github.com/gin-gonic/gin"
)

func GetBudgetSuggestions(c *gin.Context) {
	amountStr := c.Query("amount")
	durationStr := c.Query("duration")

	amount, _ := strconv.ParseFloat(amountStr, 64)
	duration := 7
	if durationStr != "" {
		duration, _ = strconv.Atoi(durationStr)
	}

	if amount <= 0 {
		amount = 1000
	}

	perDay := amount / float64(duration)
	suggestions := []model.BudgetSuggestion{}

	for _, d := range repository.Destinations {
		var baseCost float64
		switch d.PriceLevel {
		case 1:
			baseCost = 40
		case 2:
			baseCost = 80
		case 3:
			baseCost = 150
		case 4:
			baseCost = 280
		}

		totalEstimate := baseCost * float64(duration)
		if totalEstimate <= amount {
			suggestion := model.BudgetSuggestion{
				Destination:   d,
				EstimatedCost: totalEstimate,
				Duration:      duration,
				Breakdown: map[string]float64{
					"accommodation": baseCost * 0.45 * float64(duration),
					"food":          baseCost * 0.30 * float64(duration),
					"activities":    baseCost * 0.15 * float64(duration),
					"transport":     baseCost * 0.10 * float64(duration),
				},
			}
			suggestions = append(suggestions, suggestion)
		}
		_ = perDay
	}

	c.JSON(http.StatusOK, gin.H{
		"suggestions": suggestions,
		"budget":      amount,
		"duration":    duration,
		"total":       len(suggestions),
	})
}