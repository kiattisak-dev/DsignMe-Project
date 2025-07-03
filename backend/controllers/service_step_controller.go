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

type ServiceStepRequest struct {
	Categories string            `json:"categories"`
	Title      string            `json:"title"`
	Subtitles  []models.Subtitle `json:"subtitles"`
}

func AddServiceStepHandler(c *fiber.Ctx) error {
	// Get user email from JWT token
	claims, ok := c.Locals("user").(jwt.MapClaims)
	if !ok {
		log.Printf("AddServiceStepHandler: Failed to get user claims from token")
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid token claims",
		})
	}
	userEmail, ok := claims["email"].(string)
	if !ok {
		log.Printf("AddServiceStepHandler: Email not found in token claims")
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid token claims",
		})
	}

	categoryName := strings.Title(strings.ToLower(c.Params("category")))
	if categoryName == "" {
		log.Printf("AddServiceStepHandler: Category is missing")
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Category is required",
		})
	}

	log.Printf("AddServiceStepHandler: User %s requested to add service step in category %s", userEmail, categoryName)

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var req ServiceStepRequest
	if err := c.BodyParser(&req); err != nil {
		log.Printf("AddServiceStepHandler: Failed to parse request body: %v", err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	if req.Categories == "" {
		log.Printf("AddServiceStepHandler: Categories field is missing")
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Categories field is required",
		})
	}
	if req.Title == "" {
		log.Printf("AddServiceStepHandler: Service step title is missing")
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
		log.Printf("AddServiceStepHandler: No subtitle or heading provided")
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "At least one subtitle or heading is required",
		})
	}

	categoryObjID, err := primitive.ObjectIDFromHex(req.Categories)
	if err != nil {
		log.Printf("AddServiceStepHandler: Invalid categories ID %s: %v", req.Categories, err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid categories ID",
		})
	}

	var category models.Category
	err = configs.CategoriesColl.FindOne(ctx, bson.M{"_id": categoryObjID}).Decode(&category)
	if err != nil {
		log.Printf("AddServiceStepHandler: Category ID %s not found: %v", categoryObjID, err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Category not found",
		})
	}

	if category.NameCategory != categoryName {
		log.Printf("AddServiceStepHandler: Category ID %s does not match name %s", categoryObjID, categoryName)
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
		log.Printf("AddServiceStepHandler: Failed to add service step: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to add service step",
		})
	}

	serviceStep.ID = result.InsertedID.(primitive.ObjectID)
	log.Printf("AddServiceStepHandler: Service step %s added successfully by user %s in category %s", serviceStep.ID.Hex(), userEmail, categoryName)
	return c.JSON(fiber.Map{
		"message": "Service step added successfully",
		"data":    serviceStep,
	})
}

func UpdateServiceStepsHandler(c *fiber.Ctx) error {
	// Get user email from JWT token
	claims, ok := c.Locals("user").(jwt.MapClaims)
	if !ok {
		log.Printf("UpdateServiceStepsHandler: Failed to get user claims from token")
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid token claims",
		})
	}
	userEmail, ok := claims["email"].(string)
	if !ok {
		log.Printf("UpdateServiceStepsHandler: Email not found in token claims")
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid token claims",
		})
	}

	stepID := c.Params("stepId")
	if stepID == "" {
		log.Printf("UpdateServiceStepsHandler: Step ID is missing")
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Step ID is required",
		})
	}

	categoryName := strings.Title(strings.ToLower(c.Params("category")))
	if categoryName == "" {
		log.Printf("UpdateServiceStepsHandler: Category is missing")
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Category is required",
		})
	}

	log.Printf("UpdateServiceStepsHandler: User %s requested to update service step ID %s in category %s", userEmail, stepID, categoryName)

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var req ServiceStepRequest
	if err := c.BodyParser(&req); err != nil {
		log.Printf("UpdateServiceStepsHandler: Failed to parse request body: %v", err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	if req.Categories == "" {
		log.Printf("UpdateServiceStepsHandler: Categories field is missing")
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Categories field is required",
		})
	}
	if req.Title == "" {
		log.Printf("UpdateServiceStepsHandler: Service step title is missing")
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
		log.Printf("UpdateServiceStepsHandler: No subtitle or heading provided")
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "At least one subtitle or heading is required",
		})
	}

	categoryObjID, err := primitive.ObjectIDFromHex(req.Categories)
	if err != nil {
		log.Printf("UpdateServiceStepsHandler: Invalid categories ID %s: %v", req.Categories, err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid categories ID",
		})
	}

	var category models.Category
	err = configs.CategoriesColl.FindOne(ctx, bson.M{"_id": categoryObjID}).Decode(&category)
	if err != nil {
		log.Printf("UpdateServiceStepsHandler: Category ID %s not found: %v", categoryObjID, err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Category not found",
		})
	}

	if category.NameCategory != categoryName {
		log.Printf("UpdateServiceStepsHandler: Category ID %s does not match name %s", categoryObjID, categoryName)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Category ID does not match category name in URL",
		})
	}

	stepObjID, err := primitive.ObjectIDFromHex(stepID)
	if err != nil {
		log.Printf("UpdateServiceStepsHandler: Invalid step ID %s: %v", stepID, err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid step ID",
		})
	}

	var existingStep models.ServiceStep
	err = configs.ServiceStepsColl.FindOne(ctx, bson.M{"_id": stepObjID, "category_id": categoryObjID}).Decode(&existingStep)
	if err != nil {
		log.Printf("UpdateServiceStepsHandler: Service step ID %s not found in category %s: %v", stepID, categoryName, err)
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
		log.Printf("UpdateServiceStepsHandler: Failed to update service step ID %s: %v", stepID, err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update service step",
		})
	}

	if result.MatchedCount == 0 {
		log.Printf("UpdateServiceStepsHandler: No service step matched for ID %s", stepID)
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Service step not found",
		})
	}

	var updatedStep models.ServiceStep
	err = configs.ServiceStepsColl.FindOne(ctx, bson.M{"_id": stepObjID}).Decode(&updatedStep)
	if err != nil {
		log.Printf("UpdateServiceStepsHandler: Failed to fetch updated service step ID %s: %v", stepID, err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch updated service step",
		})
	}

	log.Printf("UpdateServiceStepsHandler: Service step %s updated successfully by user %s", stepID, userEmail)
	return c.JSON(fiber.Map{
		"message": "Service step updated successfully",
		"data":    updatedStep,
	})
}

func DeleteServiceStepHandler(c *fiber.Ctx) error {
	// Get user email from JWT token
	claims, ok := c.Locals("user").(jwt.MapClaims)
	if !ok {
		log.Printf("DeleteServiceStepHandler: Failed to get user claims from token")
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid token claims",
		})
	}
	userEmail, ok := claims["email"].(string)
	if !ok {
		log.Printf("DeleteServiceStepHandler: Email not found in token claims")
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid token claims",
		})
	}

	stepID := c.Params("stepId")
	if stepID == "" {
		log.Printf("DeleteServiceStepHandler: Step ID is missing")
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Step ID is required",
		})
	}

	categoryName := strings.Title(strings.ToLower(c.Params("category")))
	if categoryName == "" {
		log.Printf("DeleteServiceStepHandler: Category is missing")
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Category is required",
		})
	}

	log.Printf("DeleteServiceStepHandler: User %s requested to delete service step ID %s in category %s", userEmail, stepID, categoryName)

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var category models.Category
	err := configs.CategoriesColl.FindOne(ctx, bson.M{"nameCategory": categoryName}).Decode(&category)
	if err != nil {
		log.Printf("DeleteServiceStepHandler: Category %s not found: %v", categoryName, err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Category not found",
		})
	}

	stepObjID, err := primitive.ObjectIDFromHex(stepID)
	if err != nil {
		log.Printf("DeleteServiceStepHandler: Invalid step ID %s: %v", stepID, err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid step ID",
		})
	}

	result, err := configs.ServiceStepsColl.DeleteOne(ctx, bson.M{"_id": stepObjID, "category_id": category.ID})
	if err != nil {
		log.Printf("DeleteServiceStepHandler: Failed to delete service step ID %s: %v", stepID, err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to delete service step",
		})
	}

	if result.DeletedCount == 0 {
		log.Printf("DeleteServiceStepHandler: No service step matched for ID %s in category %s", stepID, categoryName)
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Service step not found",
		})
	}

	log.Printf("DeleteServiceStepHandler: Service step %s deleted successfully by user %s", stepID, userEmail)
	return c.JSON(fiber.Map{
		"message": "Service step deleted successfully",
	})
}

func GetAllServiceStepsHandler(c *fiber.Ctx) error {
	// Get user email from JWT token
	claims, ok := c.Locals("user").(jwt.MapClaims)
	if !ok {
		log.Printf("GetAllServiceStepsHandler: Failed to get user claims from token")
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid token claims",
		})
	}
	userEmail, ok := claims["email"].(string)
	if !ok {
		log.Printf("GetAllServiceStepsHandler: Email not found in token claims")
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid token claims",
		})
	}

	categoryName := strings.Title(strings.ToLower(c.Params("category")))
	if categoryName == "" {
		log.Printf("GetAllServiceStepsHandler: Category is missing")
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Category is required",
		})
	}

	log.Printf("GetAllServiceStepsHandler: User %s requested to fetch service steps in category %s", userEmail, categoryName)

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var category models.Category
	err := configs.CategoriesColl.FindOne(ctx, bson.M{"nameCategory": categoryName}).Decode(&category)
	if err != nil {
		log.Printf("GetAllServiceStepsHandler: Category %s not found: %v", categoryName, err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Category not found",
		})
	}

	cursor, err := configs.ServiceStepsColl.Find(ctx, bson.M{"category_id": category.ID})
	if err != nil {
		log.Printf("GetAllServiceStepsHandler: Failed to fetch service steps for category %s: %v", categoryName, err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch service steps",
		})
	}
	defer cursor.Close(ctx)

	var serviceSteps []models.ServiceStep
	if err := cursor.All(ctx, &serviceSteps); err != nil {
		log.Printf("GetAllServiceStepsHandler: Failed to process service steps for category %s: %v", categoryName, err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to process service steps",
		})
	}

	log.Printf("GetAllServiceStepsHandler: Retrieved %d service steps for category %s by user %s", len(serviceSteps), categoryName, userEmail)
	return c.JSON(fiber.Map{
		"message": "Service steps retrieved successfully",
		"data":    serviceSteps,
	})
}

func GetServiceStepHandler(c *fiber.Ctx) error {
	// Get user email from JWT token
	claims, ok := c.Locals("user").(jwt.MapClaims)
	if !ok {
		log.Printf("GetServiceStepHandler: Failed to get user claims from token")
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid token claims",
		})
	}
	userEmail, ok := claims["email"].(string)
	if !ok {
		log.Printf("GetServiceStepHandler: Email not found in token claims")
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid token claims",
		})
	}

	stepID := c.Params("stepId")
	if stepID == "" {
		log.Printf("GetServiceStepHandler: Step ID is missing")
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Step ID is required",
		})
	}

	categoryName := strings.Title(strings.ToLower(c.Params("category")))
	if categoryName == "" {
		log.Printf("GetServiceStepHandler: Category is missing")
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Category is required",
		})
	}

	log.Printf("GetServiceStepHandler: User %s requested to fetch service step ID %s in category %s", userEmail, stepID, categoryName)

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var category models.Category
	err := configs.CategoriesColl.FindOne(ctx, bson.M{"nameCategory": categoryName}).Decode(&category)
	if err != nil {
		log.Printf("GetServiceStepHandler: Category %s not found: %v", categoryName, err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Category not found",
		})
	}

	stepObjID, err := primitive.ObjectIDFromHex(stepID)
	if err != nil {
		log.Printf("GetServiceStepHandler: Invalid step ID %s: %v", stepID, err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid step ID",
		})
	}

	var serviceStep models.ServiceStep
	err = configs.ServiceStepsColl.FindOne(ctx, bson.M{"_id": stepObjID, "category_id": category.ID}).Decode(&serviceStep)
	if err != nil {
		log.Printf("GetServiceStepHandler: Service step ID %s not found in category %s: %v", stepID, categoryName, err)
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Service step not found",
		})
	}

	log.Printf("GetServiceStepHandler: Service step %s retrieved successfully by user %s", stepID, userEmail)
	return c.JSON(fiber.Map{
		"message": "Service step retrieved successfully",
		"data":    serviceStep,
	})
}