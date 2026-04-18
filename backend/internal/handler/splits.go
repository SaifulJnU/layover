package handler

import (
	"net/http"
	"strconv"
	"time"

	"layover-backend/internal/repository"
	"layover-backend/pkg/model"

	"github.com/gin-gonic/gin"
)

func GetSplits(c *gin.Context) {
	tripID := c.Query("tripId")
	if tripID == "" {
		c.JSON(http.StatusOK, gin.H{"groups": repository.MockSplitGroups})
		return
	}
	results := []model.SplitGroup{}
	for _, g := range repository.MockSplitGroups {
		if g.TripID == tripID {
			results = append(results, g)
		}
	}
	c.JSON(http.StatusOK, gin.H{"groups": results})
}

func GetSplitGroup(c *gin.Context) {
	id := c.Param("id")
	for _, g := range repository.MockSplitGroups {
		if g.ID == id {
			c.JSON(http.StatusOK, g)
			return
		}
	}
	c.JSON(http.StatusNotFound, gin.H{"error": "Group not found"})
}

func AddExpense(c *gin.Context) {
	groupID := c.Param("id")
	var expense model.Expense
	if err := c.ShouldBindJSON(&expense); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	expense.ID = "exp" + strconv.Itoa(int(time.Now().UnixMilli()))
	expense.Date = time.Now().Format("2006-01-02")

	for i := range repository.MockSplitGroups {
		if repository.MockSplitGroups[i].ID == groupID {
			repository.MockSplitGroups[i].Expenses = append(repository.MockSplitGroups[i].Expenses, expense)
			repository.MockSplitGroups[i].TotalSpent += expense.Amount
			c.JSON(http.StatusCreated, repository.MockSplitGroups[i])
			return
		}
	}
	c.JSON(http.StatusNotFound, gin.H{"error": "Group not found"})
}

func SettleDebt(c *gin.Context) {
	groupID := c.Param("id")
	var body struct {
		From   string  `json:"from"`
		To     string  `json:"to"`
		Amount float64 `json:"amount"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	for i := range repository.MockSplitGroups {
		if repository.MockSplitGroups[i].ID == groupID {
			for j := range repository.MockSplitGroups[i].Balances {
				b := &repository.MockSplitGroups[i].Balances[j]
				if b.From == body.From && b.To == body.To {
					b.Amount -= body.Amount
					if b.Amount <= 0 {
						b.Settled = true
						b.Amount = 0
					}
				}
			}
			c.JSON(http.StatusOK, repository.MockSplitGroups[i])
			return
		}
	}
	c.JSON(http.StatusNotFound, gin.H{"error": "Group not found"})
}