package controllers

import (
	"backend/configs"
	"backend/models"
	"context"
	"log"
	"strings"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type CategoryRequest struct {
	NameCategory string `json:"nameCategory"`
}

func AddCategoryHandler(c *fiber.Ctx) error {
	// Get user email from JWT token
	claims, ok := c.Locals("user").(jwt.MapClaims)
	if !ok {
		log.Printf("AddCategoryHandler: Failed to get user claims from token")
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid token claims",
		})
	}
	userEmail, ok := claims["email"].(string)
	if !ok {
		log.Printf("AddCategoryHandler: Email not found in token claims")
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid token claims",
		})
	}

	log.Printf("AddCategoryHandler: User %s requested to add category", userEmail)

	var req CategoryRequest
	if err := c.BodyParser(&req); err != nil {
		log.Printf("AddCategoryHandler: Failed to parse request body: %v", err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	if req.NameCategory == "" {
		log.Printf("AddCategoryHandler: NameCategory is missing")
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
		log.Printf("AddCategoryHandler: Category %s already exists", nameCategory)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Category already exists",
		})
	}

	category := models.Category{
		NameCategory: nameCategory,
	}

	result, err := configs.CategoriesColl.InsertOne(ctx, category)
	if err != nil {
		log.Printf("AddCategoryHandler: Failed to create category %s: %v", nameCategory, err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to create category",
		})
	}

	category.ID = result.InsertedID.(primitive.ObjectID)
	log.Printf("AddCategoryHandler: Category %s created successfully by user %s", nameCategory, userEmail)
	return c.JSON(fiber.Map{
		"message": "Category created successfully",
		"data":    category,
	})
}

func GetCategoriesHandler(c *fiber.Ctx) error {
	// Get user email from JWT token (optional, since this endpoint requires auth)
	claims, ok := c.Locals("user").(jwt.MapClaims)
	userEmail := "anonymous"
	if ok {
		if email, ok := claims["email"].(string); ok {
			userEmail = email
		}
	}

	log.Printf("GetCategoriesHandler: User %s requested to fetch categories", userEmail)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	cursor, err := configs.CategoriesColl.Find(ctx, bson.M{})
	if err != nil {
		log.Printf("GetCategoriesHandler: Failed to fetch categories: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch categories",
		})
	}
	defer cursor.Close(ctx)

	var categories []models.Category
	if err := cursor.All(ctx, &categories); err != nil {
		log.Printf("GetCategoriesHandler: Failed to process categories: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to process categories",
		})
	}

	log.Printf("GetCategoriesHandler: Retrieved %d categories by user %s", len(categories), userEmail)
	return c.JSON(fiber.Map{
		"message": "Categories retrieved successfully",
		"data":    categories,
		"count":   len(categories),
	})
}

func UpdateCategoryHandler(c *fiber.Ctx) error {
	// Get user email from JWT token
	claims, ok := c.Locals("user").(jwt.MapClaims)
	if !ok {
		log.Printf("UpdateCategoryHandler: Failed to get user claims from token")
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid token claims",
		})
	}
	userEmail, ok := claims["email"].(string)
	if !ok {
		log.Printf("UpdateCategoryHandler: Email not found in token claims")
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid token claims",
		})
	}

	id := c.Params("id")
	if id == "" {
		log.Printf("UpdateCategoryHandler: Category ID is missing")
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Category ID is required",
		})
	}

	log.Printf("UpdateCategoryHandler: User %s requested to update category ID %s", userEmail, id)

	var req CategoryRequest
	if err := c.BodyParser(&req); err != nil {
		log.Printf("UpdateCategoryHandler: Failed to parse request body: %v", err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	if req.NameCategory == "" {
		log.Printf("UpdateCategoryHandler: NameCategory is missing")
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "NameCategory is required",
		})
	}

	// Capitalize nameCategory
	nameCategory := strings.Title(strings.ToLower(req.NameCategory))

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		log.Printf("UpdateCategoryHandler: Invalid category ID %s: %v", id, err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid category ID",
		})
	}

	// Check if category exists
	var existingCategory models.Category
	err = configs.CategoriesColl.FindOne(ctx, bson.M{"_id": objID}).Decode(&existingCategory)
	if err != nil {
		log.Printf("UpdateCategoryHandler: Category ID %s not found: %v", id, err)
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Category not found",
		})
	}

	// Check if new nameCategory already exists (excluding current category)
	var duplicateCategory models.Category
	err = configs.CategoriesColl.FindOne(ctx, bson.M{"nameCategory": nameCategory, "_id": bson.M{"$ne": objID}}).Decode(&duplicateCategory)
	if err == nil {
		log.Printf("UpdateCategoryHandler: Category name %s already exists", nameCategory)
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
		log.Printf("UpdateCategoryHandler: Failed to update category ID %s: %v", id, err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update category",
		})
	}

	if result.MatchedCount == 0 {
		log.Printf("UpdateCategoryHandler: No category matched for ID %s", id)
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Category not found",
		})
	}

	// Fetch the updated category
	var updatedCategory models.Category
	err = configs.CategoriesColl.FindOne(ctx, bson.M{"_id": objID}).Decode(&updatedCategory)
	if err != nil {
		log.Printf("UpdateCategoryHandler: Failed to fetch updated category ID %s: %v", id, err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch updated category",
		})
	}

	log.Printf("UpdateCategoryHandler: Category %s updated successfully by user %s", nameCategory, userEmail)
	return c.JSON(fiber.Map{
		"message": "Category updated successfully",
		"data":    updatedCategory,
	})
}

func DeleteCategoryHandler(c *fiber.Ctx) error {
	// Get user email from JWT token
	claims, ok := c.Locals("user").(jwt.MapClaims)
	if !ok {
		log.Printf("DeleteCategoryHandler: Failed to get user claims from token")
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid token claims",
		})
	}
	userEmail, ok := claims["email"].(string)
	if !ok {
		log.Printf("DeleteCategoryHandler: Email not found in token claims")
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid token claims",
		})
	}

	id := c.Params("id")
	if id == "" {
		log.Printf("DeleteCategoryHandler: Category ID is missing")
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Category ID is required",
		})
	}

	log.Printf("DeleteCategoryHandler: User %s requested to delete category ID %s", userEmail, id)

	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		log.Printf("DeleteCategoryHandler: Invalid category ID %s: %v", id, err)
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
		log.Printf("DeleteCategoryHandler: Category ID %s not found: %v", id, err)
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Category not found",
		})
	}

	// Check if category is used in projects
	projectCount, err := configs.ProjectsColl.CountDocuments(ctx, bson.M{"category_id": objID})
	if err != nil {
		log.Printf("DeleteCategoryHandler: Failed to check associated projects for category ID %s: %v", id, err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to check associated projects",
		})
	}
	if projectCount > 0 {
		log.Printf("DeleteCategoryHandler: Category ID %s has %d associated projects", id, projectCount)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Cannot delete category with associated projects",
		})
	}

	// Check if category is used in service steps
	serviceStepCount, err := configs.ServiceStepsColl.CountDocuments(ctx, bson.M{"category_id": objID})
	if err != nil {
		log.Printf("DeleteCategoryHandler: Failed to check associated service steps for category ID %s: %v", id, err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to check associated service steps",
		})
	}
	if serviceStepCount > 0 {
		log.Printf("DeleteCategoryHandler: Category ID %s has %d associated service steps", id, serviceStepCount)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Cannot delete category with associated service steps",
		})
	}

	// Delete category
	result, err := configs.CategoriesColl.DeleteOne(ctx, bson.M{"_id": objID})
	if err != nil {
		log.Printf("DeleteCategoryHandler: Failed to delete category ID %s: %v", id, err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to delete category",
		})
	}

	if result.DeletedCount == 0 {
		log.Printf("DeleteCategoryHandler: No category matched for ID %s", id)
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Category not found",
		})
	}

	log.Printf("DeleteCategoryHandler: Category ID %s deleted successfully by user %s", id, userEmail)
	return c.JSON(fiber.Map{
		"message": "Category deleted successfully",
	})
}