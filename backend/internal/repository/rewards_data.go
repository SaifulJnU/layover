package repository

import "layover-backend/pkg/model"

var MockRewards = model.RewardsProfile{
	UserID: "u1", UserName: "You",
	Points: 3450, Level: "Explorer",
	LevelProgress: 68, NextLevelPoints: 5000,
	TotalTrips: 4, TotalCountries: 7,
	Badges: []model.Badge{
		{ID: "b1", Name: "First Flight", Icon: "✈️", Description: "Planned your first trip", Earned: true, EarnedDate: "2025-11-01"},
		{ID: "b2", Name: "Budget Master", Icon: "💰", Description: "Stayed under budget on 3 trips", Earned: true, EarnedDate: "2026-01-15"},
		{ID: "b3", Name: "Globetrotter", Icon: "🌍", Description: "Visited 5 different countries", Earned: true, EarnedDate: "2026-02-20"},
		{ID: "b4", Name: "Group Leader", Icon: "👥", Description: "Planned a trip for 5+ people", Earned: true, EarnedDate: "2026-03-10"},
		{ID: "b5", Name: "Night Owl", Icon: "🦉", Description: "Planned 3 trips with nightlife activities", Earned: false},
		{ID: "b6", Name: "Foodie", Icon: "🍜", Description: "Added 20 restaurant activities", Earned: false},
		{ID: "b7", Name: "Adventurer", Icon: "🏔️", Description: "Completed 5 adventure activities", Earned: false},
		{ID: "b8", Name: "Social Star", Icon: "⭐", Description: "Get 100 likes on a shared trip", Earned: false},
		{ID: "b9", Name: "Split King", Icon: "🤝", Description: "Settled all expenses in a group trip", Earned: true, EarnedDate: "2026-03-25"},
		{ID: "b10", Name: "Continent Hopper", Icon: "🗺️", Description: "Visit all 6 continents", Earned: false},
	},
	AvailableRewards: []model.Reward{
		{ID: "r1", Title: "10% Off Booking.com", Description: "Get 10% discount on your next hotel booking", PointsCost: 500, Category: "discount", Icon: "🏨", Claimed: false},
		{ID: "r2", Title: "Free Lounge Access", Description: "1x airport lounge access at any airport", PointsCost: 1200, Category: "perk", Icon: "🛋️", Claimed: false},
		{ID: "r3", Title: "€25 Travel Credit", Description: "Apply to any booking made through Layover", PointsCost: 2000, Category: "credit", Icon: "💳", Claimed: false},
		{ID: "r4", Title: "Premium Plan — 1 Month", Description: "Unlock all premium AI planning features", PointsCost: 800, Category: "subscription", Icon: "⚡", Claimed: false},
		{ID: "r5", Title: "Travel Insurance Discount", Description: "20% off travel insurance for your next trip", PointsCost: 600, Category: "insurance", Icon: "🛡️", Claimed: true},
		{ID: "r6", Title: "Priority Support", Description: "Skip the queue with dedicated 24/7 support", PointsCost: 300, Category: "perk", Icon: "🎯", Claimed: false},
	},
	History: []model.PointEvent{
		{Description: "Planned Bali trip", Points: 200, Date: "2026-04-10", Type: "earn"},
		{Description: "Added 5 activities", Points: 50, Date: "2026-04-10", Type: "earn"},
		{Description: "Settled group expenses", Points: 100, Date: "2026-04-08", Type: "earn"},
		{Description: "Shared trip to social feed", Points: 75, Date: "2026-04-06", Type: "earn"},
		{Description: "Redeemed insurance discount", Points: -600, Date: "2026-04-05", Type: "redeem"},
		{Description: "Booked hotel via Layover", Points: 350, Date: "2026-03-28", Type: "earn"},
		{Description: "Earned Group Leader badge", Points: 150, Date: "2026-03-10", Type: "earn"},
		{Description: "Referred a friend", Points: 250, Date: "2026-02-14", Type: "earn"},
	},
}

var MockLeaderboard = []model.LeaderboardEntry{
	{Rank: 1, UserName: "world_wanderer",  Points: 12400, Level: "Globetrotter", Trips: 18, Avatar: "W", Country: "Germany",    City: "Berlin",    IsConnection: false},
	{Rank: 2, UserName: "tokyo_dreams",    Points: 9800,  Level: "Globetrotter", Trips: 14, Avatar: "T", Country: "Japan",      City: "Tokyo",     IsConnection: true},
	{Rank: 3, UserName: "aurora_chaser",   Points: 7200,  Level: "Adventurer",   Trips: 11, Avatar: "R", Country: "Germany",    City: "Munich",    IsConnection: true},
	{Rank: 4, UserName: "You",             Points: 3450,  Level: "Explorer",     Trips: 4,  Avatar: "Y", Country: "Germany",    City: "Dortmund",  IsConnection: false},
	{Rank: 5, UserName: "maldives_life",   Points: 3100,  Level: "Explorer",     Trips: 3,  Avatar: "M", Country: "France",     City: "Paris",     IsConnection: true},
	{Rank: 6, UserName: "safari_sam",      Points: 2800,  Level: "Traveler",     Trips: 5,  Avatar: "K", Country: "Kenya",      City: "Nairobi",   IsConnection: false},
	{Rank: 7, UserName: "santorini_lover", Points: 2200,  Level: "Traveler",     Trips: 4,  Avatar: "S", Country: "Greece",     City: "Athens",    IsConnection: true},
	{Rank: 8, UserName: "alex_travels",    Points: 1900,  Level: "Traveler",     Trips: 3,  Avatar: "A", Country: "Germany",    City: "Dortmund",  IsConnection: true},
	{Rank: 9, UserName: "nordic_nomad",    Points: 1650,  Level: "Traveler",     Trips: 6,  Avatar: "N", Country: "Sweden",     City: "Stockholm", IsConnection: false},
	{Rank: 10, UserName: "paris_jules",    Points: 1400,  Level: "Traveler",     Trips: 2,  Avatar: "P", Country: "France",     City: "Lyon",      IsConnection: false},
	{Rank: 11, UserName: "dortmund_felix", Points: 1200,  Level: "Traveler",     Trips: 2,  Avatar: "F", Country: "Germany",    City: "Dortmund",  IsConnection: true},
	{Rank: 12, UserName: "bali_beatrice",  Points: 980,   Level: "Traveler",     Trips: 1,  Avatar: "B", Country: "Indonesia",  City: "Bali",      IsConnection: false},
}