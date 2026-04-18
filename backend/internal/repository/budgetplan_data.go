package repository

import "layover-backend/pkg/model"

var MockBudgetPlans = []model.BudgetPlan{
	{
		ID:          "bp1",
		TripName:    "Bali Adventure",
		Destination: "Bali, Indonesia",
		TotalBudget: 2000,
		Currency:    "EUR",
		Duration:    7,
		CreatedAt:   "2026-04-10T10:00:00Z",
		Categories: map[string]model.BudgetCategory{
			"accommodation": {Label: "Accommodation", Allocated: 700, Spent: 480, Color: "#4F9CF9", Icon: "🏨"},
			"food":          {Label: "Food & Drinks", Allocated: 420, Spent: 310, Color: "#FFD166", Icon: "🍽️"},
			"transport":     {Label: "Transport", Allocated: 250, Spent: 195, Color: "#9B7FFF", Icon: "🚗"},
			"activities":    {Label: "Activities", Allocated: 380, Spent: 290, Color: "#06D6A0", Icon: "🎭"},
			"shopping":      {Label: "Shopping", Allocated: 150, Spent: 85, Color: "#FF9A3C", Icon: "🛍️"},
			"emergency":     {Label: "Emergency", Allocated: 100, Spent: 0, Color: "#FF6B6B", Icon: "🛡️"},
		},
		Expenses: []model.BudgetExpense{
			{ID: "bx1", Description: "Ubud Villa (3 nights)", Amount: 360, Category: "accommodation", Date: "2026-05-10"},
			{ID: "bx2", Description: "Airport Transfer", Amount: 35, Category: "transport", Date: "2026-05-10"},
			{ID: "bx3", Description: "Locavore Restaurant", Amount: 45, Category: "food", Date: "2026-05-10"},
			{ID: "bx4", Description: "Mount Batur Hike", Amount: 35, Category: "activities", Date: "2026-05-11"},
			{ID: "bx5", Description: "Seminyak Hotel (2 nights)", Amount: 120, Category: "accommodation", Date: "2026-05-12"},
			{ID: "bx6", Description: "Scooter Rental", Amount: 40, Category: "transport", Date: "2026-05-12"},
			{ID: "bx7", Description: "Warung lunches x3", Amount: 30, Category: "food", Date: "2026-05-12"},
			{ID: "bx8", Description: "Kuta Market Shopping", Amount: 85, Category: "shopping", Date: "2026-05-13"},
			{ID: "bx9", Description: "Uluwatu Temple + Show", Amount: 45, Category: "activities", Date: "2026-05-13"},
			{ID: "bx10", Description: "Jimbaran Seafood Dinner", Amount: 90, Category: "food", Date: "2026-05-13"},
			{ID: "bx11", Description: "Beach Club Day Pass", Amount: 120, Category: "activities", Date: "2026-05-14"},
			{ID: "bx12", Description: "Spa Treatment", Amount: 90, Category: "activities", Date: "2026-05-15"},
		},
	},
}