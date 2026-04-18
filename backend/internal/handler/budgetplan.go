package handler

import (
	"fmt"
	"net/http"
	"time"

	"layover-backend/internal/repository"
	"layover-backend/pkg/model"

	"github.com/gin-gonic/gin"
)

func GetBudgetPlans(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"plans": repository.MockBudgetPlans, "total": len(repository.MockBudgetPlans)})
}

func GetBudgetPlan(c *gin.Context) {
	id := c.Param("id")
	for _, p := range repository.MockBudgetPlans {
		if p.ID == id {
			c.JSON(http.StatusOK, p)
			return
		}
	}
	c.JSON(http.StatusNotFound, gin.H{"error": "Plan not found"})
}

func CreateBudgetPlan(c *gin.Context) {
	var plan model.BudgetPlan
	if err := c.ShouldBindJSON(&plan); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	plan.ID = fmt.Sprintf("bp%d", len(repository.MockBudgetPlans)+1)
	plan.CreatedAt = time.Now().Format(time.RFC3339)
	if plan.Expenses == nil {
		plan.Expenses = []model.BudgetExpense{}
	}
	repository.MockBudgetPlans = append(repository.MockBudgetPlans, plan)
	c.JSON(http.StatusCreated, plan)
}

func AddBudgetExpense(c *gin.Context) {
	planID := c.Param("id")
	var expense model.BudgetExpense
	if err := c.ShouldBindJSON(&expense); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	expense.ID = fmt.Sprintf("bx%d", int(time.Now().UnixMilli()%100000))
	expense.Date = time.Now().Format("2006-01-02")

	for i := range repository.MockBudgetPlans {
		if repository.MockBudgetPlans[i].ID == planID {
			repository.MockBudgetPlans[i].Expenses = append(repository.MockBudgetPlans[i].Expenses, expense)
			if cat, ok := repository.MockBudgetPlans[i].Categories[expense.Category]; ok {
				cat.Spent += expense.Amount
				repository.MockBudgetPlans[i].Categories[expense.Category] = cat
			}
			c.JSON(http.StatusCreated, repository.MockBudgetPlans[i])
			return
		}
	}
	c.JSON(http.StatusNotFound, gin.H{"error": "Plan not found"})
}

func UpdateCategoryAllocation(c *gin.Context) {
	planID := c.Param("id")
	category := c.Param("cat")
	var body struct {
		Allocated float64 `json:"allocated"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	for i := range repository.MockBudgetPlans {
		if repository.MockBudgetPlans[i].ID == planID {
			if cat, ok := repository.MockBudgetPlans[i].Categories[category]; ok {
				cat.Allocated = body.Allocated
				repository.MockBudgetPlans[i].Categories[category] = cat
				c.JSON(http.StatusOK, repository.MockBudgetPlans[i])
				return
			}
		}
	}
	c.JSON(http.StatusNotFound, gin.H{"error": "Not found"})
}