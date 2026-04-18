package handler

import (
	"net/http"
	"strconv"
	"time"

	"layover-backend/internal/repository"
	"layover-backend/pkg/model"

	"github.com/gin-gonic/gin"
)

func GetFeed(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"posts": repository.MockPosts, "total": len(repository.MockPosts)})
}

func CreatePost(c *gin.Context) {
	var post model.Post
	if err := c.ShouldBindJSON(&post); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	post.ID = "p" + strconv.Itoa(len(repository.MockPosts)+1)
	post.CreatedAt = time.Now().Format("2006-01-02T15:04:05Z")
	post.Likes = 0
	repository.MockPosts = append([]model.Post{post}, repository.MockPosts...)
	c.JSON(http.StatusCreated, post)
}

func LikePost(c *gin.Context) {
	id := c.Param("id")
	for i := range repository.MockPosts {
		if repository.MockPosts[i].ID == id {
			repository.MockPosts[i].Likes++
			c.JSON(http.StatusOK, gin.H{"likes": repository.MockPosts[i].Likes})
			return
		}
	}
	c.JSON(http.StatusNotFound, gin.H{"error": "Post not found"})
}

func ShareTrip(c *gin.Context) {
	tripID := c.Param("id")
	shareURL := "https://layover.app/trips/" + tripID + "?shared=true"
	c.JSON(http.StatusOK, gin.H{
		"shareUrl": shareURL,
		"tripId":   tripID,
		"message":  "Trip shared successfully",
	})
}