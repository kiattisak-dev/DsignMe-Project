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

type ServiceStepRequest struct {
	Categories string   `json:"categories"`
	Title      string   `json:"title"`
	Subtitles  []string `json:"subtitles"`
}

func AddServiceStepHandler(c *fiber.Ctx) error {
	// Get category from path parameter (optional, for consistency)
	categoryName := strings.Title(strings.ToLower(c.Params("category")))
	if categoryName == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Category is required",
		})
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var req ServiceStepRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	// Validate required fields
	if req.Categories == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Categories field is required",
		})
	}
	if req.Title == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Service step title is required",
		})
	}

	// Validate categories as ObjectID
	categoryObjID, err := primitive.ObjectIDFromHex(req.Categories)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid categories ID",
		})
	}

	// Check if category exists
	var category models.Category
	err = configs.CategoriesColl.FindOne(ctx, bson.M{"_id": categoryObjID}).Decode(&category)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Category not found",
		})
	}

	// Validate category name against ValidCategories
	if !ValidCategories[category.NameCategory] {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid category. Must be one of: Logo, Advertisement, Product, VisualMotion",
		})
	}

	// Check if category name matches path parameter
	if category.NameCategory != categoryName {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Category ID does not match category name in URL",
		})
	}

	serviceStep := models.ServiceStep{
		CategoryID: categoryObjID,
		Title:      req.Title,
		Subtitles:  req.Subtitles,
		CreatedAt:  time.Now(),
	}

	result, err := configs.ServiceStepsColl.InsertOne(ctx, serviceStep)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to add service step",
		})
	}

	// Get the inserted service step ID
	serviceStep.ID = result.InsertedID.(primitive.ObjectID)

	return c.JSON(fiber.Map{
		"message": "Service step added successfully",
		"data":    serviceStep,
	})
}

func UpdateServiceStepsHandler(c *fiber.Ctx) error {
	// Get stepId from path parameter
	stepID := c.Params("stepId")
	if stepID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Step ID is required",
		})
	}

	// Get category from path parameter
	categoryName := strings.Title(strings.ToLower(c.Params("category")))
	if categoryName == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Category is required",
		})
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Parse request body
	var req ServiceStepRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	// Validate required fields
	if req.Categories == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Categories field is required",
		})
	}
	if req.Title == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Service step title is required",
		})
	}

	// Validate categories as ObjectID
	categoryObjID, err := primitive.ObjectIDFromHex(req.Categories)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid categories ID",
		})
	}

	// Check if category exists
	var category models.Category
	err = configs.CategoriesColl.FindOne(ctx, bson.M{"_id": categoryObjID}).Decode(&category)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Category not found",
		})
	}

	// Validate category name against ValidCategories
	if !ValidCategories[category.NameCategory] {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid category. Must be one of: Logo, Advertisement, Product, VisualMotion",
		})
	}

	// Check if category name matches path parameter
	if category.NameCategory != categoryName {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Category ID does not match category name in URL",
		})
	}

	// Validate stepId as ObjectID
	stepObjID, err := primitive.ObjectIDFromHex(stepID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid step ID",
		})
	}

	// Check if service step exists
	var existingStep models.ServiceStep
	err = configs.ServiceStepsColl.FindOne(ctx, bson.M{"_id": stepObjID, "category_id": categoryObjID}).Decode(&existingStep)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Service step not found",
		})
	}

	// Update service step
	update := bson.M{
		"$set": bson.M{
			"title":       req.Title,
			"subtitles":   req.Subtitles,
			"category_id": categoryObjID,
			"updatedAt":   time.Now(),
		},
	}

	result, err := configs.ServiceStepsColl.UpdateOne(ctx, bson.M{"_id": stepObjID}, update)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update service step",
		})
	}

	if result.MatchedCount == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Service step not found",
		})
	}

	// Fetch updated service step
	var updatedStep models.ServiceStep
	err = configs.ServiceStepsColl.FindOne(ctx, bson.M{"_id": stepObjID}).Decode(&updatedStep)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch updated service step",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Service step updated successfully",
		"data":    updatedStep,
	})
}

func DeleteServiceStepHandler(c *fiber.Ctx) error {
	stepID := c.Params("stepId")
	if stepID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Step ID is required",
		})
	}

	// Get category from path parameter
	categoryName := strings.Title(strings.ToLower(c.Params("category")))
	if categoryName == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Category is required",
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

	stepObjID, err := primitive.ObjectIDFromHex(stepID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid step ID",
		})
	}

	// Delete service step
	result, err := configs.ServiceStepsColl.DeleteOne(ctx, bson.M{"_id": stepObjID, "category_id": category.ID})
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to delete service step",
		})
	}

	if result.DeletedCount == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Service step not found",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Service step deleted successfully",
	})
}

func GetAllServiceStepsHandler(c *fiber.Ctx) error {
	// Get category from path parameter
	categoryName := strings.Title(strings.ToLower(c.Params("category")))
	if categoryName == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Category is required",
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

	// Fetch all service steps for the category
	cursor, err := configs.ServiceStepsColl.Find(ctx, bson.M{"category_id": category.ID})
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch service steps",
		})
	}
	defer cursor.Close(ctx)

	var serviceSteps []models.ServiceStep
	if err := cursor.All(ctx, &serviceSteps); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to process service steps",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Service steps retrieved successfully",
		"data":    serviceSteps,
	})
}

func GetServiceStepHandler(c *fiber.Ctx) error {
	// Get stepId from path parameter
	stepID := c.Params("stepId")
	if stepID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Step ID is required",
		})
	}

	// Get category from path parameter
	categoryName := strings.Title(strings.ToLower(c.Params("category")))
	if categoryName == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Category is required",
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

	// Validate stepId as ObjectID
	stepObjID, err := primitive.ObjectIDFromHex(stepID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid step ID",
		})
	}

	// Fetch service step
	var serviceStep models.ServiceStep
	err = configs.ServiceStepsColl.FindOne(ctx, bson.M{"_id": stepObjID, "category_id": category.ID}).Decode(&serviceStep)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Service step not found",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Service step retrieved successfully",
		"data":    serviceStep,
	})
}