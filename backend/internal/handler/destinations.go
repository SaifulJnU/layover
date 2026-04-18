package handler

import (
	"net/http"
	"strconv"
	"strings"

	"layover-backend/internal/repository"
	"layover-backend/pkg/model"

	"github.com/gin-gonic/gin"
)

func GetDestinations(c *gin.Context) {
	query := strings.ToLower(c.Query("q"))
	season := strings.ToLower(c.Query("season"))
	minRatingStr := c.Query("minRating")
	maxPriceStr := c.Query("maxPrice")
	continent := strings.ToLower(c.Query("continent"))

	var minRating float64
	if minRatingStr != "" {
		minRating, _ = strconv.ParseFloat(minRatingStr, 64)
	}
	var maxPrice int
	if maxPriceStr != "" {
		maxPrice, _ = strconv.Atoi(maxPriceStr)
	}

	results := []model.Destination{}
	for _, d := range repository.Destinations {
		if query != "" {
			nameMatch := strings.Contains(strings.ToLower(d.Name), query)
			countryMatch := strings.Contains(strings.ToLower(d.Country), query)
			tagMatch := false
			for _, tag := range d.Tags {
				if strings.Contains(strings.ToLower(tag), query) {
					tagMatch = true
					break
				}
			}
			if !nameMatch && !countryMatch && !tagMatch {
				continue
			}
		}

		if season != "" && season != "all" {
			found := false
			for _, s := range d.Seasons {
				if s == season {
					found = true
					break
				}
			}
			if !found {
				continue
			}
		}

		if minRating > 0 && d.Rating < minRating {
			continue
		}

		if maxPrice > 0 && d.PriceLevel > maxPrice {
			continue
		}

		if continent != "" && continent != "all" {
			if strings.ToLower(d.Continent) != continent {
				continue
			}
		}

		results = append(results, d)
	}

	c.JSON(http.StatusOK, gin.H{
		"destinations": results,
		"total":        len(results),
	})
}

func GetDestination(c *gin.Context) {
	id := c.Param("id")
	for _, d := range repository.Destinations {
		if d.ID == id {
			c.JSON(http.StatusOK, d)
			return
		}
	}
	c.JSON(http.StatusNotFound, gin.H{"error": "Destination not found"})
}