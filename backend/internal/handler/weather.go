package handler

import (
	"net/http"
	"strings"

	"layover-backend/internal/repository"

	"github.com/gin-gonic/gin"
)

func GetWeather(c *gin.Context) {
	city := strings.ToLower(c.Query("city"))
	city = strings.ReplaceAll(city, " ", "")

	weather, ok := repository.MockWeather[city]
	if !ok {
		weather = repository.MockWeather["default"]
		weather.City = strings.Title(c.Query("city"))
	}

	c.JSON(http.StatusOK, weather)
}