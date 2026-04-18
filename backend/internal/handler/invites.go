package handler

import (
	"fmt"
	"net/http"
	"time"

	"layover-backend/internal/repository"
	"layover-backend/pkg/model"

	"github.com/gin-gonic/gin"
)

func GetInvites(c *gin.Context) {
	tripID := c.Query("tripId")
	if tripID == "" {
		c.JSON(http.StatusOK, gin.H{"invites": repository.MockInvites})
		return
	}
	results := []model.Invite{}
	for _, inv := range repository.MockInvites {
		if inv.TripID == tripID {
			results = append(results, inv)
		}
	}
	c.JSON(http.StatusOK, gin.H{"invites": results})
}

func SendInvite(c *gin.Context) {
	var body struct {
		TripID   string `json:"tripId"`
		TripName string `json:"tripName"`
		ToEmail  string `json:"toEmail"`
		Message  string `json:"message"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	id := fmt.Sprintf("inv%d", len(repository.MockInvites)+1)
	token := fmt.Sprintf("%x", time.Now().UnixNano())[:8]
	invite := model.Invite{
		ID:         id,
		TripID:     body.TripID,
		TripName:   body.TripName,
		FromUser:   "You",
		ToEmail:    body.ToEmail,
		Message:    body.Message,
		Status:     "pending",
		InviteLink: fmt.Sprintf("https://layover.app/join/%s", token),
		CreatedAt:  time.Now().Format(time.RFC3339),
	}
	repository.MockInvites = append(repository.MockInvites, invite)
	c.JSON(http.StatusCreated, invite)
}

func RespondInvite(c *gin.Context) {
	id := c.Param("id")
	var body struct {
		Status string `json:"status"` // accepted or declined
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	for i := range repository.MockInvites {
		if repository.MockInvites[i].ID == id {
			repository.MockInvites[i].Status = body.Status
			c.JSON(http.StatusOK, repository.MockInvites[i])
			return
		}
	}
	c.JSON(http.StatusNotFound, gin.H{"error": "Invite not found"})
}

func DeleteInvite(c *gin.Context) {
	id := c.Param("id")
	for i, inv := range repository.MockInvites {
		if inv.ID == id {
			repository.MockInvites = append(repository.MockInvites[:i], repository.MockInvites[i+1:]...)
			c.JSON(http.StatusOK, gin.H{"success": true})
			return
		}
	}
	c.JSON(http.StatusNotFound, gin.H{"error": "Invite not found"})
}