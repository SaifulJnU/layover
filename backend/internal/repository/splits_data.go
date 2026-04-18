package repository

import "layover-backend/pkg/model"

var MockSplitGroups = []model.SplitGroup{
	{
		ID: "sg1", TripID: "t1", Name: "Bali Adventure 🌴",
		Currency: "EUR",
		Members: []model.Member{
			{ID: "u1", Name: "Alex", Avatar: "A", Paid: 580},
			{ID: "u2", Name: "Sam", Avatar: "S", Paid: 320},
			{ID: "u3", Name: "Jordan", Avatar: "J", Paid: 250},
		},
		TotalSpent: 1150,
		Expenses: []model.Expense{
			{ID: "e1", Description: "Hotel Ubud Villa (3 nights)", Amount: 360, PaidBy: "Alex", SplitWith: []string{"Alex", "Sam", "Jordan"}, Category: "accommodation", Date: "2026-05-10"},
			{ID: "e2", Description: "Mount Batur Sunrise Hike", Amount: 105, PaidBy: "Sam", SplitWith: []string{"Alex", "Sam", "Jordan"}, Category: "activity", Date: "2026-05-11"},
			{ID: "e3", Description: "Tanah Lot Entrance + Transport", Amount: 75, PaidBy: "Alex", SplitWith: []string{"Alex", "Sam", "Jordan"}, Category: "transport", Date: "2026-05-11"},
			{ID: "e4", Description: "Jimbaran Seafood Dinner", Amount: 90, PaidBy: "Jordan", SplitWith: []string{"Alex", "Sam", "Jordan"}, Category: "food", Date: "2026-05-11"},
			{ID: "e5", Description: "Locavore Restaurant", Amount: 135, PaidBy: "Alex", SplitWith: []string{"Alex", "Sam", "Jordan"}, Category: "food", Date: "2026-05-12"},
			{ID: "e6", Description: "Scooter Rental (2 days)", Amount: 60, PaidBy: "Sam", SplitWith: []string{"Alex", "Sam"}, Category: "transport", Date: "2026-05-12"},
			{ID: "e7", Description: "Uluwatu Temple + Kecak Show", Amount: 45, PaidBy: "Jordan", SplitWith: []string{"Alex", "Sam", "Jordan"}, Category: "activity", Date: "2026-05-13"},
			{ID: "e8", Description: "Seminyak Beach Club", Amount: 120, PaidBy: "Alex", SplitWith: []string{"Alex", "Sam", "Jordan"}, Category: "activity", Date: "2026-05-14"},
			{ID: "e9", Description: "Airport Transfers", Amount: 60, PaidBy: "Sam", SplitWith: []string{"Alex", "Sam", "Jordan"}, Category: "transport", Date: "2026-05-17"},
		},
		Balances: []model.Balance{
			{From: "Sam", To: "Alex", Amount: 85.00, Settled: false},
			{From: "Jordan", To: "Alex", Amount: 110.00, Settled: false},
			{From: "Jordan", To: "Sam", Amount: 15.00, Settled: true},
		},
	},
}