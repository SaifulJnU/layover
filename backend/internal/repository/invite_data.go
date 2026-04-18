package repository

import "layover-backend/pkg/model"

var MockInvites = []model.Invite{
	{
		ID: "inv1", TripID: "t1", TripName: "Bali Adventure",
		FromUser: "You", ToEmail: "alex@example.com",
		Message:    "Hey! Join our Bali trip in May 🌴",
		Status:     "accepted",
		InviteLink: "https://layover.app/join/abc123",
		CreatedAt:  "2026-04-10T10:00:00Z",
	},
	{
		ID: "inv2", TripID: "t1", TripName: "Bali Adventure",
		FromUser: "You", ToEmail: "sam@example.com",
		Message:    "Come join us for the best trip ever!",
		Status:     "pending",
		InviteLink: "https://layover.app/join/def456",
		CreatedAt:  "2026-04-14T15:30:00Z",
	},
}