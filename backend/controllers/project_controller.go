package controllers

import (
	"backend/configs"
	"backend/models"
	"context"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type ProjectRequest struct {
	ImageUrl string `json:"imageUrl,omitempty"`
	VideoUrl string `json:"videoUrl,omitempty"`
}

// ValidCategories defines the allowed project categories
var ValidCategories = map[string]bool{
	models.CategoryLogo:          true,
	models.CategoryAdvertisement: true,
	models.CategoryProduct:       true,
	models.CategoryVisualMotion:  true,
}

func AddProjectHandler(c *fiber.Ctx) error {
	// Get category from path parameter
	categoryName := strings.Title(strings.ToLower(c.Params("category")))
	if categoryName == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Category is required",
		})
	}

	// Validate category
	if !ValidCategories[categoryName] {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid category. Must be one of: Logo, Advertisement, Product, VisualMotion",
		})
	}

	// Find category_id
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var category models.Category
	err := configs.CategoriesColl.FindOne(ctx, bson.M{"nameCategory": categoryName}).Decode(&category)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Category not found",
		})
	}

	var req ProjectRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	project := models.Project{
		ImageUrl:   req.ImageUrl,
		VideoUrl:   req.VideoUrl,
		CategoryID: category.ID,
		CreatedAt:  time.Now(),
	}

	result, err := configs.ProjectsColl.InsertOne(ctx, project)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to save project",
		})
	}

	// Get the inserted project ID
	project.ID = result.InsertedID.(primitive.ObjectID)

	return c.JSON(fiber.Map{
		"message": "Project added successfully",
		"data":    project,
	})
}

func UpdateProjectHandler(c *fiber.Ctx) error {
	id := c.Params("id")
	if id == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Project ID is required",
		})
	}

	// Get category from path parameter
	categoryName := strings.Title(strings.ToLower(c.Params("category")))
	if categoryName == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Category is required",
		})
	}

	// Validate category
	if !ValidCategories[categoryName] {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid category. Must be one of: Logo, Advertisement, Product, VisualMotion",
		})
	}

	// Find category_id
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var category models.Category
	err := configs.CategoriesColl.FindOne(ctx, bson.M{"nameCategory": categoryName}).Decode(&category)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Category not found",
		})
	}

	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid project ID",
		})
	}

	var req ProjectRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	update := bson.M{
		"$set": bson.M{
			"imageUrl":    req.ImageUrl,
			"videoUrl":    req.VideoUrl,
			"category_id": category.ID,
			"updatedAt":   time.Now(),
		},
	}

	result, err := configs.ProjectsColl.UpdateOne(ctx, bson.M{"_id": objID, "category_id": category.ID}, update)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update project",
		})
	}

	if result.MatchedCount == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Project not found or category does not match",
		})
	}

	// Fetch the updated project
	var updatedProject models.Project
	err = configs.ProjectsColl.FindOne(ctx, bson.M{"_id": objID}).Decode(&updatedProject)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch updated project",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Project updated successfully",
		"data":    updatedProject,
	})
}

func DeleteProjectHandler(c *fiber.Ctx) error {
	id := c.Params("id")
	if id == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Project ID is required",
		})
	}

	// Get category from path parameter
	categoryName := strings.Title(strings.ToLower(c.Params("category")))
	if categoryName == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Category is required",
		})
	}

	// Validate category
	if !ValidCategories[categoryName] {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid category. Must be one of: Logo, Advertisement, Product, VisualMotion",
		})
	}

	// Find category_id
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var category models.Category
	err := configs.CategoriesColl.FindOne(ctx, bson.M{"nameCategory": categoryName}).Decode(&category)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Category not found",
		})
	}

	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid project ID",
		})
	}

	// Delete associated service steps
	_, err = configs.ServiceStepsColl.DeleteMany(ctx, bson.M{"project_id": objID})
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to delete associated service steps",
		})
	}

	// Delete project
	result, err := configs.ProjectsColl.DeleteOne(ctx, bson.M{"_id": objID, "category_id": category.ID})
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to delete project",
		})
	}

	if result.DeletedCount == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Project not found or category does not match",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Project deleted successfully",
	})
}

func GetProjectsByCategoryHandler(c *fiber.Ctx) error {
	// Get category from path parameter
	categoryName := strings.Title(strings.ToLower(c.Params("category")))
	if categoryName == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Category is required",
		})
	}

	// Validate category
	if !ValidCategories[categoryName] {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid category. Must be one of: Logo, Advertisement, Product, VisualMotion",
		})
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Find category_id
	var category models.Category
	err := configs.CategoriesColl.FindOne(ctx, bson.M{"nameCategory": categoryName}).Decode(&category)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Category not found",
		})
	}

	// Find projects
	cursor, err := configs.ProjectsColl.Find(ctx, bson.M{"category_id": category.ID}, options.Find().SetSort(bson.M{"createdAt": -1}))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch projects",
		})
	}
	defer cursor.Close(ctx)

	var projects []models.Project
	if err := cursor.All(ctx, &projects); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to process projects",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Projects retrieved successfully",
		"data":    projects,
		"count":   len(projects),
	})
}

func GetAllProjectsHandler(c *fiber.Ctx) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	cursor, err := configs.ProjectsColl.Find(ctx, bson.M{}, options.Find().SetSort(bson.M{"createdAt": -1}))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch projects",
		})
	}
	defer cursor.Close(ctx)

	var projects []models.Project
	if err := cursor.All(ctx, &projects); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to process projects",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Projects retrieved successfully",
		"data":    projects,
		"count":   len(projects),
	})
}