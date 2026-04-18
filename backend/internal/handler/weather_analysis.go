package handler

import (
	"fmt"
	"net/http"
	"strings"

	"layover-backend/internal/repository"
	"layover-backend/pkg/model"

	"github.com/gin-gonic/gin"
)

var bestMonthsByWeather = map[string][]string{
	"tropical":      {"April", "May", "June", "July", "August", "September"},
	"mediterranean": {"May", "June", "July", "August", "September"},
	"temperate":     {"April", "May", "June", "September", "October"},
	"desert":        {"November", "December", "January", "February", "March"},
	"arctic":        {"June", "July", "August"},
}

var cityWeatherType = map[string]string{
	"bali":      "tropical",
	"maldives":  "tropical",
	"paris":     "temperate",
	"tokyo":     "temperate",
	"kyoto":     "temperate",
	"santorini": "mediterranean",
	"barcelona": "mediterranean",
	"dubai":     "desert",
	"reykjavik": "arctic",
	"amsterdam": "temperate",
}

func GetWeatherAnalysis(c *gin.Context) {
	cityRaw := c.Query("city")
	city := strings.ToLower(strings.ReplaceAll(cityRaw, " ", ""))

	weather, ok := repository.MockWeather[city]
	if !ok {
		weather = repository.MockWeather["default"]
		weather.City = cityRaw
	}

	analysis := analyseWeather(weather, city)
	c.JSON(http.StatusOK, analysis)
}

func analyseWeather(w model.WeatherData, cityKey string) model.WeatherAnalysis {
	score := 5
	var reasons, warnings, tips []string
	forecastNotes := []string{}

	// Temperature scoring
	switch {
	case w.Temperature >= 22 && w.Temperature <= 28:
		reasons = append(reasons, fmt.Sprintf("Ideal temperature at %d°C — perfect for outdoor activities", w.Temperature))
	case w.Temperature > 28 && w.Temperature <= 33:
		score--
		reasons = append(reasons, fmt.Sprintf("Warm at %d°C — great for beach but stay hydrated", w.Temperature))
		tips = append(tips, "Carry water and wear SPF 50+ sunscreen")
	case w.Temperature > 33:
		score -= 2
		warnings = append(warnings, fmt.Sprintf("Very hot at %d°C — limit outdoor exposure midday", w.Temperature))
		tips = append(tips, "Plan outdoor activities early morning or after 5pm")
	case w.Temperature >= 15 && w.Temperature < 22:
		reasons = append(reasons, fmt.Sprintf("Comfortable at %d°C — ideal for sightseeing and walking", w.Temperature))
	case w.Temperature >= 8 && w.Temperature < 15:
		score--
		warnings = append(warnings, fmt.Sprintf("Cool at %d°C — pack a warm layer", w.Temperature))
		tips = append(tips, "A light jacket and scarf will keep you comfortable")
	case w.Temperature < 8:
		score -= 2
		warnings = append(warnings, fmt.Sprintf("Cold at %d°C — heavy winter clothing required", w.Temperature))
		tips = append(tips, "Pack thermal base layers, a heavy coat, and waterproof boots")
	}

	// Condition scoring
	cond := strings.ToLower(w.Condition)
	switch {
	case strings.Contains(cond, "sunny") || strings.Contains(cond, "clear") || strings.Contains(cond, "hot"):
		reasons = append(reasons, "Clear skies — great visibility for photos and outdoor dining")
	case strings.Contains(cond, "partly") || strings.Contains(cond, "cloud"):
		reasons = append(reasons, "Partly cloudy — comfortable for walking, lower UV exposure")
	case strings.Contains(cond, "overcast"):
		score--
		warnings = append(warnings, "Overcast skies — photography may be challenging")
		tips = append(tips, "Visit indoor museums and galleries on grey days")
	case strings.Contains(cond, "rain") || strings.Contains(cond, "rainy"):
		score -= 2
		warnings = append(warnings, "Rain expected — outdoor plans may be disrupted")
		tips = append(tips, "Pack a compact umbrella and waterproof shoes")
		tips = append(tips, "Good day for museums, cafes, and local markets")
	case strings.Contains(cond, "snow") || strings.Contains(cond, "snowy"):
		score -= 2
		warnings = append(warnings, "Snowfall — roads may be affected, dress in warm layers")
		if cityKey == "reykjavik" {
			reasons = append(reasons, "Snow creates magical winter scenery — ideal for Northern Lights hunting!")
			score++ // bump back up for appropriate destinations
		}
	case strings.Contains(cond, "fog"):
		score--
		warnings = append(warnings, "Foggy conditions — reduced visibility, check transport delays")
	}

	// Humidity
	if w.Humidity > 80 {
		score--
		warnings = append(warnings, fmt.Sprintf("High humidity at %d%% — feels more intense than the temperature suggests", w.Humidity))
		tips = append(tips, "Loose, breathable clothing will help manage the humidity")
	} else if w.Humidity < 30 {
		tips = append(tips, "Low humidity — stay hydrated and use moisturiser")
	} else {
		reasons = append(reasons, fmt.Sprintf("Comfortable humidity at %d%%", w.Humidity))
	}

	// UV index
	if w.UVIndex >= 8 {
		warnings = append(warnings, fmt.Sprintf("Very high UV index (%d) — sunscreen essential, seek shade 11am–3pm", w.UVIndex))
	} else if w.UVIndex >= 5 {
		tips = append(tips, fmt.Sprintf("Moderate UV (%d) — sunscreen and sunglasses recommended", w.UVIndex))
	}

	// Wind
	if w.WindSpeed > 40 {
		score--
		warnings = append(warnings, fmt.Sprintf("Strong winds at %d km/h — outdoor activities may be uncomfortable", w.WindSpeed))
	}

	// Analyse 5-day forecast for rainy days
	rainyDays := 0
	for _, f := range w.Forecast {
		fc := strings.ToLower(f.Condition)
		if strings.Contains(fc, "rain") || strings.Contains(fc, "snow") || strings.Contains(fc, "storm") {
			rainyDays++
			forecastNotes = append(forecastNotes, fmt.Sprintf("%s: %s (%d°/%d°)", f.Day, f.Condition, f.High, f.Low))
		}
	}

	var forecastNote string
	if rainyDays == 0 {
		forecastNote = "5-day forecast looks clear — no major disruptions expected 🌤️"
	} else if rainyDays <= 2 {
		forecastNote = fmt.Sprintf("Rain on %d day(s) this week: %s. Plan indoor activities for those days.",
			rainyDays, strings.Join(forecastNotes, ", "))
	} else {
		forecastNote = fmt.Sprintf("Unsettled week ahead — %d rainy days: %s. Consider flexible booking.",
			rainyDays, strings.Join(forecastNotes, ", "))
		score--
	}

	// Clamp score
	if score < 1 {
		score = 1
	}
	if score > 5 {
		score = 5
	}

	// Verdict
	var verdict, verdictEmoji, verdictText, recommendation string
	switch {
	case score >= 5:
		verdict, verdictEmoji = "Excellent", "🟢"
		verdictText = "This is a great time to visit!"
		recommendation = "Book now — conditions are near-perfect. You'll have an amazing experience."
	case score == 4:
		verdict, verdictEmoji = "Good", "🟢"
		verdictText = "Good time to visit with minor caveats"
		recommendation = "Go ahead — conditions are favourable. Bring the items in the tips above."
	case score == 3:
		verdict, verdictEmoji = "Fair", "🟡"
		verdictText = "Decent but not ideal — manageable with preparation"
		recommendation = "You can still have a great trip with the right preparation. Check the warnings above."
	case score == 2:
		verdict, verdictEmoji = "Poor", "🔴"
		verdictText = "Not the best time — consider rescheduling"
		recommendation = "We'd suggest waiting for better conditions. See the best months below."
	default:
		verdict, verdictEmoji = "Avoid", "🔴"
		verdictText = "Strongly recommend postponing your trip"
		recommendation = "Conditions are unfavourable right now. Plan for a different month."
	}

	// Best months
	wType := cityWeatherType[strings.ToLower(w.City)]
	bestMonths := bestMonthsByWeather[wType]
	if len(bestMonths) == 0 {
		bestMonths = []string{"April", "May", "June", "September", "October"}
	}

	return model.WeatherAnalysis{
		City:           w.City,
		Score:          score,
		Verdict:        verdict,
		VerdictEmoji:   verdictEmoji,
		VerdictText:    verdictText,
		Reasons:        reasons,
		Warnings:       warnings,
		Tips:           tips,
		BestMonths:     bestMonths,
		Recommendation: recommendation,
		ForecastNote:   forecastNote,
	}
}