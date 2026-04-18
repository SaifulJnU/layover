package handler

import (
	"net/http"
	"strings"
	"time"

	"layover-backend/internal/repository"
	"layover-backend/pkg/model"

	"github.com/gin-gonic/gin"
)

func GetTrips(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"trips": repository.MockTrips, "total": len(repository.MockTrips)})
}

func GetTrip(c *gin.Context) {
	id := c.Param("id")
	for _, t := range repository.MockTrips {
		if t.ID == id {
			c.JSON(http.StatusOK, t)
			return
		}
	}
	c.JSON(http.StatusNotFound, gin.H{"error": "Trip not found"})
}

func CreateTrip(c *gin.Context) {
	var trip model.Trip
	if err := c.ShouldBindJSON(&trip); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	trip.ID = "t" + time.Now().Format("150405")
	trip.Status = "upcoming"
	trip.TotalSpent = 0
	if trip.Members == nil {
		trip.Members = []model.Member{}
	}
	if trip.Itinerary == nil {
		trip.Itinerary = []model.DayPlan{}
	}
	repository.MockTrips = append([]model.Trip{trip}, repository.MockTrips...)
	c.JSON(http.StatusCreated, trip)
}

var itineraries = map[string][]model.DayPlan{
	"bali": {
		{Day: 1, Activities: []model.Activity{
			{Time: "09:00", Name: "Check-in & settle", Type: "accommodation", Cost: 120, Duration: "1 hr", Rating: 4.8, Description: "Check into your villa and freshen up", Address: "Ubud, Bali"},
			{Time: "13:00", Name: "Tegalalang Rice Terrace", Type: "attraction", Cost: 5, Duration: "2 hrs", Rating: 4.7, Description: "Iconic terraced rice fields with photo swings", Address: "Tegalalang, Ubud"},
			{Time: "19:00", Name: "Local warung dinner", Type: "food", Cost: 15, Duration: "1.5 hrs", Rating: 4.6, Description: "Authentic nasi goreng and satay", Address: "Ubud Centre"},
		}},
		{Day: 2, Activities: []model.Activity{
			{Time: "05:30", Name: "Mount Batur Sunrise Hike", Type: "attraction", Cost: 35, Duration: "5 hrs", Rating: 4.9, Description: "Guided volcanic sunrise hike", Address: "Kintamani, Bali"},
			{Time: "15:00", Name: "Tanah Lot Temple", Type: "attraction", Cost: 5, Duration: "2 hrs", Rating: 4.7, Description: "Ocean temple at golden hour", Address: "Tabanan, Bali"},
			{Time: "20:00", Name: "Jimbaran Seafood BBQ", Type: "food", Cost: 35, Duration: "2 hrs", Rating: 4.8, Description: "Beach barbecue with fresh catch", Address: "Jimbaran Bay"},
		}},
		{Day: 3, Activities: []model.Activity{
			{Time: "09:00", Name: "Seminyak Beach", Type: "attraction", Cost: 0, Duration: "3 hrs", Rating: 4.6, Description: "Bali's most stylish beach strip", Address: "Seminyak"},
			{Time: "14:00", Name: "Surf Lesson", Type: "attraction", Cost: 25, Duration: "2 hrs", Rating: 4.7, Description: "Beginner surf lesson with local instructor", Address: "Kuta Beach"},
			{Time: "19:00", Name: "Ku De Ta sunset dinner", Type: "food", Cost: 55, Duration: "2.5 hrs", Rating: 4.8, Description: "Beachfront fine dining with live music", Address: "Seminyak Beach"},
		}},
	},
	"paris": {
		{Day: 1, Activities: []model.Activity{
			{Time: "10:00", Name: "Check-in & croissant", Type: "accommodation", Cost: 180, Duration: "1 hr", Rating: 4.7, Description: "Boutique hotel near the Marais", Address: "Le Marais, Paris"},
			{Time: "14:00", Name: "Eiffel Tower", Type: "attraction", Cost: 26, Duration: "2 hrs", Rating: 4.8, Description: "Visit the summit for panoramic views", Address: "Champ de Mars, Paris"},
			{Time: "20:00", Name: "Bistro dinner in Montmartre", Type: "food", Cost: 45, Duration: "2 hrs", Rating: 4.7, Description: "Classic French cuisine in Montmartre", Address: "Montmartre, Paris"},
		}},
		{Day: 2, Activities: []model.Activity{
			{Time: "09:00", Name: "Louvre Museum", Type: "attraction", Cost: 17, Duration: "4 hrs", Rating: 4.8, Description: "World's largest art museum — Mona Lisa & more", Address: "Rue de Rivoli, Paris"},
			{Time: "14:00", Name: "Seine River Cruise", Type: "attraction", Cost: 15, Duration: "1.5 hrs", Rating: 4.6, Description: "Scenic cruise past Notre-Dame and bridges", Address: "Pont de l'Alma, Paris"},
			{Time: "19:30", Name: "Le Comptoir dinner", Type: "food", Cost: 60, Duration: "2 hrs", Rating: 4.9, Description: "Legendary French brasserie by Yves Camdeborde", Address: "Saint-Germain-des-Prés"},
		}},
	},
	"kyoto": {
		{Day: 1, Activities: []model.Activity{
			{Time: "13:00", Name: "Ryokan check-in", Type: "accommodation", Cost: 200, Duration: "1 hr", Rating: 4.9, Description: "Traditional inn with tatami rooms and onsen", Address: "Higashiyama, Kyoto"},
			{Time: "17:00", Name: "Fushimi Inari Shrine", Type: "attraction", Cost: 0, Duration: "2 hrs", Rating: 4.9, Description: "Thousands of torii gates at dusk", Address: "Fushimi-ku, Kyoto"},
			{Time: "20:00", Name: "Pontocho Alley dinner", Type: "food", Cost: 50, Duration: "2 hrs", Rating: 4.8, Description: "Atmospheric narrow lane of restaurants", Address: "Pontocho, Kyoto"},
		}},
		{Day: 2, Activities: []model.Activity{
			{Time: "07:00", Name: "Arashiyama Bamboo Grove", Type: "attraction", Cost: 0, Duration: "1.5 hrs", Rating: 4.8, Description: "Serene bamboo forest walk at sunrise", Address: "Arashiyama, Kyoto"},
			{Time: "10:00", Name: "Tenryu-ji Temple & Garden", Type: "attraction", Cost: 10, Duration: "2 hrs", Rating: 4.7, Description: "UNESCO World Heritage Zen garden", Address: "Arashiyama, Kyoto"},
			{Time: "19:00", Name: "Kaiseki dinner", Type: "food", Cost: 80, Duration: "2.5 hrs", Rating: 4.9, Description: "Multi-course traditional Japanese haute cuisine", Address: "Gion, Kyoto"},
		}},
	},
	"iceland": {
		{Day: 1, Activities: []model.Activity{
			{Time: "12:00", Name: "Hotel check-in", Type: "accommodation", Cost: 200, Duration: "1 hr", Rating: 4.7, Description: "Central Reykjavik hotel with city views", Address: "Reykjavik Centre"},
			{Time: "14:00", Name: "Golden Circle Tour", Type: "attraction", Cost: 85, Duration: "8 hrs", Rating: 4.9, Description: "Geysir, Gullfoss & Þingvellir National Park", Address: "Golden Circle, Iceland"},
			{Time: "22:00", Name: "Northern Lights Hunt", Type: "attraction", Cost: 60, Duration: "3 hrs", Rating: 4.8, Description: "Guided aurora borealis excursion", Address: "Countryside, Iceland"},
		}},
		{Day: 2, Activities: []model.Activity{
			{Time: "09:00", Name: "Blue Lagoon Spa", Type: "attraction", Cost: 85, Duration: "3 hrs", Rating: 4.8, Description: "Geothermal spa in a volcanic lava field", Address: "Grindavík, Iceland"},
			{Time: "15:00", Name: "Hallgrímskirkja Church", Type: "attraction", Cost: 10, Duration: "1 hr", Rating: 4.6, Description: "Iconic modernist church with panoramic views", Address: "Hallgrímstorg, Reykjavik"},
			{Time: "19:00", Name: "Dill Restaurant", Type: "food", Cost: 120, Duration: "2.5 hrs", Rating: 4.9, Description: "Michelin-star New Nordic tasting menu", Address: "Hverfisgata 12, Reykjavik"},
		}},
	},
}

func GenerateItinerary(c *gin.Context) {
	id := c.Param("id")
	for i, t := range repository.MockTrips {
		if t.ID != id {
			continue
		}
		dest := strings.ToLower(t.Destination)
		var days []model.DayPlan
		for key, plan := range itineraries {
			if strings.Contains(dest, key) {
				days = plan
				break
			}
		}
		if days == nil {
			days = itineraries["bali"]
		}
		// Set actual dates
		startDate, err := time.Parse("2006-01-02", t.StartDate)
		if err != nil {
			startDate = time.Now()
		}
		for j := range days {
			days[j].Date = startDate.AddDate(0, 0, j).Format("2006-01-02")
		}
		repository.MockTrips[i].Itinerary = days
		c.JSON(http.StatusOK, gin.H{"itinerary": days})
		return
	}
	c.JSON(http.StatusNotFound, gin.H{"error": "Trip not found"})
}