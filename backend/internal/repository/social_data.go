package repository

import "layover-backend/pkg/model"

var MockPosts = []model.Post{
	{
		ID: "p1", UserName: "alex_travels", UserAvatar: "https://i.pravatar.cc/48?img=47",
		Destination: "Bali", Country: "Indonesia",
		Caption:   "Sunrise at Mount Batur was absolutely magical 🌋 Woke up at 3am and it was 100% worth it. The view from the top is indescribable!",
		Images:    []string{"https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=700&q=80"},
		Likes:     247, Tags: []string{"bali", "sunrise", "volcano", "adventure"},
		CreatedAt: "2026-04-15T08:23:00Z",
		Comments: []model.Comment{
			{ID: "c1", UserName: "sarah_explorer", Text: "This is stunning! Was it difficult to hike?", Date: "2026-04-15T09:10:00Z"},
			{ID: "c2", UserName: "marco_world", Text: "Adding this to my bucket list right now 🔥", Date: "2026-04-15T10:45:00Z"},
		},
	},
	{
		ID: "p2", UserName: "tokyo_dreams", UserAvatar: "https://i.pravatar.cc/48?img=12",
		Destination: "Tokyo", Country: "Japan",
		Caption:   "Cherry blossom season in Shinjuku Gyoen 🌸 Worth flying 10,000km for. Japan never disappoints.",
		Images:    []string{"https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=700&q=80"},
		Likes:     512, Tags: []string{"tokyo", "sakura", "japan", "spring"},
		CreatedAt: "2026-04-12T14:30:00Z",
		Comments: []model.Comment{
			{ID: "c3", UserName: "wanderlust_lea", Text: "This is my dream trip! When's the best time to go?", Date: "2026-04-12T15:00:00Z"},
		},
	},
	{
		ID: "p3", UserName: "santorini_lover", UserAvatar: "https://i.pravatar.cc/48?img=9",
		Destination: "Santorini", Country: "Greece",
		Caption:   "Golden hour at Oia — the most beautiful sunset I've ever witnessed 🌅 Highly recommend booking an oia-side hotel for this view.",
		Images:    []string{"https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=700&q=80"},
		Likes:     891, Tags: []string{"santorini", "greece", "sunset", "romantic"},
		CreatedAt: "2026-04-10T19:15:00Z",
		Comments: []model.Comment{
			{ID: "c4", UserName: "couples_travel", Text: "Going here for honeymoon next month!", Date: "2026-04-10T20:00:00Z"},
			{ID: "c5", UserName: "photo_addict", Text: "What camera settings did you use?", Date: "2026-04-11T08:30:00Z"},
		},
	},
	{
		ID: "p4", UserName: "aurora_chaser", UserAvatar: "https://i.pravatar.cc/48?img=33",
		Destination: "Reykjavik", Country: "Iceland",
		Caption:   "Finally caught the Northern Lights after 3 nights of waiting ❄️🌌 Pro tip: drive away from the city lights for the best show!",
		Images:    []string{"https://images.unsplash.com/photo-1520769945061-0a448c463865?w=700&q=80"},
		Likes:     1243, Tags: []string{"iceland", "northernlights", "aurora", "winter"},
		CreatedAt: "2026-04-08T23:45:00Z",
		Comments: []model.Comment{
			{ID: "c6", UserName: "bucket_lister", Text: "This has been #1 on my bucket list forever!", Date: "2026-04-09T00:30:00Z"},
		},
	},
	{
		ID: "p5", UserName: "maldives_life", UserAvatar: "https://i.pravatar.cc/48?img=22",
		Destination: "Maldives", Country: "Maldives",
		Caption:   "Our overwater bungalow for the week 🌊 The water is literally crystal clear — you can see fish swimming from your villa floor!",
		Images:    []string{"https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=700&q=80"},
		Likes:     2187, Tags: []string{"maldives", "luxury", "overwater", "honeymoon"},
		CreatedAt: "2026-04-06T12:00:00Z",
		Comments: []model.Comment{
			{ID: "c7", UserName: "luxury_travel", Text: "Which resort is this? Looks incredible!", Date: "2026-04-06T13:00:00Z"},
			{ID: "c8", UserName: "dream_trips", Text: "Goals 😍", Date: "2026-04-06T14:20:00Z"},
		},
	},
	{
		ID: "p6", UserName: "safari_sam", UserAvatar: "https://i.pravatar.cc/48?img=15",
		Destination: "Maasai Mara", Country: "Kenya",
		Caption:   "Witnessed the Great Migration today 🦁🐘 Over a million wildebeest crossing the river — nothing prepares you for the scale of it.",
		Images:    []string{"https://images.unsplash.com/photo-1516426122078-c23e76319801?w=700&q=80"},
		Likes:     763, Tags: []string{"kenya", "safari", "wildlife", "africa"},
		CreatedAt: "2026-04-04T07:30:00Z",
		Comments: []model.Comment{
			{ID: "c9", UserName: "nature_first", Text: "This is so incredible. What tour operator did you use?", Date: "2026-04-04T09:00:00Z"},
		},
	},
}