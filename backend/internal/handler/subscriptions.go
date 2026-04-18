package handler

import (
	"net/http"
	"time"

	"layover-backend/internal/repository"
	"layover-backend/pkg/model"

	"github.com/gin-gonic/gin"
)

func GetPlans(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"plans": repository.SubscriptionPlans})
}

func GetCurrentPlan(c *gin.Context) {
	c.JSON(http.StatusOK, repository.CurrentSubscription)
}

func Subscribe(c *gin.Context) {
	var body struct {
		PlanID   string `json:"planId"`
		Billing  string `json:"billing"` // monthly or yearly
		CardLast string `json:"cardLast"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	for _, p := range repository.SubscriptionPlans {
		if p.ID == body.PlanID {
			price := p.MonthlyPrice
			if body.Billing == "yearly" {
				price = p.YearlyPrice / 12
			}
			repository.CurrentSubscription = model.Subscription{
				PlanID:    p.ID,
				PlanName:  p.Name,
				Billing:   body.Billing,
				Price:     price,
				Status:    "active",
				StartDate: time.Now().Format("2006-01-02"),
				NextBill:  time.Now().AddDate(0, 1, 0).Format("2006-01-02"),
				CardLast:  body.CardLast,
			}
			// Grant bonus points for subscribing
			if p.ID != "free" {
				repository.MockRewards.Points += p.BonusPoints
			}
			c.JSON(http.StatusOK, gin.H{"success": true, "subscription": repository.CurrentSubscription})
			return
		}
	}
	c.JSON(http.StatusNotFound, gin.H{"error": "Plan not found"})
}

func CancelSubscription(c *gin.Context) {
	repository.CurrentSubscription.Status = "cancelled"
	repository.CurrentSubscription.CancelDate = time.Now().Format("2006-01-02")
	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Subscription cancelled. Access remains until end of billing period."})
}