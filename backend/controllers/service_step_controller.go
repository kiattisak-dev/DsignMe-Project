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
	Categories string            `json:"categories"`
	Title      string            `json:"title"`
	Subtitles  []models.Subtitle `json:"subtitles"`
}

func AddServiceStepHandler(c *fiber.Ctx) error {
	categoryName := strings.Title(strings.ToLower(c.Params("category")))
	if categoryName == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Category is required",
		})
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var req ServiceStepRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

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
	hasContent := false
	for _, subtitle := range req.Subtitles {
		if subtitle.Text != "" || len(subtitle.Headings) > 0 {
			hasContent = true
			break
		}
	}
	if !hasContent {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "At least one subtitle or heading is required",
		})
	}

	categoryObjID, err := primitive.ObjectIDFromHex(req.Categories)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid categories ID",
		})
	}

	var category models.Category
	err = configs.CategoriesColl.FindOne(ctx, bson.M{"_id": categoryObjID}).Decode(&category)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Category not found",
		})
	}

	if category.NameCategory != categoryName {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Category ID does not match category name in URL",
		})
	}

	// Filter out empty subtitles and headings
	filteredSubtitles := []models.Subtitle{}
	for _, subtitle := range req.Subtitles {
		if subtitle.Text != "" || len(subtitle.Headings) > 0 {
			// Filter out empty headings
			filteredHeadings := []string{}
			for _, heading := range subtitle.Headings {
				if heading != "" {
					filteredHeadings = append(filteredHeadings, heading)
				}
			}
			filteredSubtitles = append(filteredSubtitles, models.Subtitle{
				Text:     subtitle.Text,
				Headings: filteredHeadings,
			})
		}
	}

	serviceStep := models.ServiceStep{
		CategoryID: categoryObjID,
		Title:      req.Title,
		Subtitles:  filteredSubtitles,
		CreatedAt:  time.Now(),
	}

	result, err := configs.ServiceStepsColl.InsertOne(ctx, serviceStep)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to add service step",
		})
	}

	serviceStep.ID = result.InsertedID.(primitive.ObjectID)

	return c.JSON(fiber.Map{
		"message": "Service step added successfully",
		"data":    serviceStep,
	})
}

func UpdateServiceStepsHandler(c *fiber.Ctx) error {
	stepID := c.Params("stepId")
	if stepID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Step ID is required",
		})
	}

	categoryName := strings.Title(strings.ToLower(c.Params("category")))
	if categoryName == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Category is required",
		})
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var req ServiceStepRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

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
	hasContent := false
	for _, subtitle := range req.Subtitles {
		if subtitle.Text != "" || len(subtitle.Headings) > 0 {
			hasContent = true
			break
		}
	}
	if !hasContent {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "At least one subtitle or heading is required",
		})
	}

	categoryObjID, err := primitive.ObjectIDFromHex(req.Categories)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid categories ID",
		})
	}

	var category models.Category
	err = configs.CategoriesColl.FindOne(ctx, bson.M{"_id": categoryObjID}).Decode(&category)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Category not found",
		})
	}

	if category.NameCategory != categoryName {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Category ID does not match category name in URL",
		})
	}

	stepObjID, err := primitive.ObjectIDFromHex(stepID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid step ID",
		})
	}

	var existingStep models.ServiceStep
	err = configs.ServiceStepsColl.FindOne(ctx, bson.M{"_id": stepObjID, "category_id": categoryObjID}).Decode(&existingStep)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Service step not found",
		})
	}

	// Filter out empty subtitles and headings
	filteredSubtitles := []models.Subtitle{}
	for _, subtitle := range req.Subtitles {
		if subtitle.Text != "" || len(subtitle.Headings) > 0 {
			// Filter out empty headings
			filteredHeadings := []string{}
			for _, heading := range subtitle.Headings {
				if heading != "" {
					filteredHeadings = append(filteredHeadings, heading)
				}
			}
			filteredSubtitles = append(filteredSubtitles, models.Subtitle{
				Text:     subtitle.Text,
				Headings: filteredHeadings,
			})
		}
	}

	update := bson.M{
		"$set": bson.M{
			"title":       req.Title,
			"subtitles":   filteredSubtitles,
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

	categoryName := strings.Title(strings.ToLower(c.Params("category")))
	if categoryName == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Category is required",
		})
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

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
	categoryName := strings.Title(strings.ToLower(c.Params("category")))
	if categoryName == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Category is required",
		})
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var category models.Category
	err := configs.CategoriesColl.FindOne(ctx, bson.M{"nameCategory": categoryName}).Decode(&category)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Category not found",
		})
	}

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
	stepID := c.Params("stepId")
	if stepID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Step ID is required",
		})
	}

	categoryName := strings.Title(strings.ToLower(c.Params("category")))
	if categoryName == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Category is required",
		})
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

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
