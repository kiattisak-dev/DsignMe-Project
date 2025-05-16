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
)

type CategoryRequest struct {
	NameCategory string `json:"nameCategory"`
}

func AddCategoryHandler(c *fiber.Ctx) error {
	var req CategoryRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	if req.NameCategory == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "NameCategory is required",
		})
	}

	// Capitalize nameCategory
	nameCategory := strings.Title(strings.ToLower(req.NameCategory))

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Check if category exists
	var existingCategory models.Category
	err := configs.CategoriesColl.FindOne(ctx, bson.M{"nameCategory": nameCategory}).Decode(&existingCategory)
	if err == nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Category already exists",
		})
	}

	// Validate against ValidCategories
	if !ValidCategories[nameCategory] {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid category. Must be one of: Logo, Advertisement, Product, VisualMotion",
		})
	}

	category := models.Category{
		NameCategory: nameCategory,
	}

	result, err := configs.CategoriesColl.InsertOne(ctx, category)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to create category",
		})
	}

	category.ID = result.InsertedID.(primitive.ObjectID)

	return c.JSON(fiber.Map{
		"message": "Category created successfully",
		"data":    category,
	})
}

func GetCategoriesHandler(c *fiber.Ctx) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	cursor, err := configs.CategoriesColl.Find(ctx, bson.M{})
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch categories",
		})
	}
	defer cursor.Close(ctx)

	var categories []models.Category
	if err := cursor.All(ctx, &categories); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to process categories",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Categories retrieved successfully",
		"data":    categories,
		"count":   len(categories),
	})
}

func UpdateCategoryHandler(c *fiber.Ctx) error {
	id := c.Params("id")
	if id == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Category ID is required",
		})
	}

	var req CategoryRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	if req.NameCategory == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "NameCategory is required",
		})
	}

	// Capitalize nameCategory
	nameCategory := strings.Title(strings.ToLower(req.NameCategory))

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Validate against ValidCategories
	if !ValidCategories[nameCategory] {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid category. Must be one of: Logo, Advertisement, Product, VisualMotion",
		})
	}

	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid category ID",
		})
	}

	// Check if category exists
	var existingCategory models.Category
	err = configs.CategoriesColl.FindOne(ctx, bson.M{"_id": objID}).Decode(&existingCategory)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Category not found",
		})
	}

	// Check if new nameCategory already exists (excluding current category)
	var duplicateCategory models.Category
	err = configs.CategoriesColl.FindOne(ctx, bson.M{"nameCategory": nameCategory, "_id": bson.M{"$ne": objID}}).Decode(&duplicateCategory)
	if err == nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Category name already exists",
		})
	}

	// Update category
	update := bson.M{
		"$set": bson.M{
			"nameCategory": nameCategory,
			"updatedAt":    time.Now(),
		},
	}

	result, err := configs.CategoriesColl.UpdateOne(ctx, bson.M{"_id": objID}, update)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update category",
		})
	}

	if result.MatchedCount == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Category not found",
		})
	}

	// Fetch the updated category
	var updatedCategory models.Category
	err = configs.CategoriesColl.FindOne(ctx, bson.M{"_id": objID}).Decode(&updatedCategory)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch updated category",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Category updated successfully",
		"data":    updatedCategory,
	})
}

func DeleteCategoryHandler(c *fiber.Ctx) error {
	id := c.Params("id")
	if id == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Category ID is required",
		})
	}

	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid category ID",
		})
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Check if category exists
	var category models.Category
	err = configs.CategoriesColl.FindOne(ctx, bson.M{"_id": objID}).Decode(&category)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Category not found",
		})
	}

	// Check if category is used in projects
	projectCount, err := configs.ProjectsColl.CountDocuments(ctx, bson.M{"category_id": objID})
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to check associated projects",
		})
	}
	if projectCount > 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Cannot delete category with associated projects",
		})
	}

	// Check if category is used in service steps
	serviceStepCount, err := configs.ServiceStepsColl.CountDocuments(ctx, bson.M{"category_id": objID})
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to check associated service steps",
		})
	}
	if serviceStepCount > 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Cannot delete category with associated service steps",
		})
	}

	// Delete category
	result, err := configs.CategoriesColl.DeleteOne(ctx, bson.M{"_id": objID})
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to delete category",
		})
	}

	if result.DeletedCount == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Category not found",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Category deleted successfully",
	})
}
