package controllers

import (
	"backend/configs"
	"backend/models"
	"context"
	"fmt"
	"io"
	"log"
	"path/filepath"
	"strings"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/gridfs"
	"go.mongodb.org/mongo-driver/mongo/options"
	"mime/multipart"
)

type CategoryRequest struct {
	NameCategory string `json:"nameCategory"`
}

type ProjectRequest struct {
	ImageUrl string `json:"imageUrl,omitempty"`
	VideoUrl string `json:"videoUrl,omitempty"`
}

type File struct {
	ID        primitive.ObjectID `bson:"_id"`
	Filename  string             `bson:"filename"`
	Type      string             `bson:"type"`
	GridFSID  primitive.ObjectID `bson:"gridfs_id"`
	CreatedAt time.Time          `bson:"created_at"`
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
	log.Printf("GetCategoriesHandler: Received request to fetch categories")

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

	log.Printf("GetCategoriesHandler: Retrieved %d categories", len(categories))
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
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map
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

func uploadToGridFS(file *multipart.FileHeader, fileType string) (string, error) {
	log.Printf("uploadToGridFS: Uploading file %s of type %s", file.Filename, fileType)

	// Validate file size
	maxSize := int64(10 * 1024 * 1024) // 10MB for image
	if fileType == "video" {
		maxSize = 50 * 1024 * 1024 // 50MB for video
	}
	if file.Size > maxSize {
		log.Printf("uploadToGridFS: File %s too large, size: %d bytes, max: %d bytes", file.Filename, file.Size, maxSize)
		return "", fmt.Errorf("file too large, max size is %dMB", maxSize/(1024*1024))
	}

	// Validate file type
	allowedTypes := []string{"image/jpeg", "image/png"}
	if fileType == "video" {
		allowedTypes = []string{"video/mp4", "video/webm"}
	}
	contentType := file.Header.Get("Content-Type")
	isValidType := false
	for _, t := range allowedTypes {
		if contentType == t {
			isValidType = true
			break
		}
	}
	if !isValidType {
		log.Printf("uploadToGridFS: Invalid file type %s for file %s", contentType, file.Filename)
		return "", fmt.Errorf("invalid file type, allowed types are %v", allowedTypes)
	}

	// Open the file
	fileStream, err := file.Open()
	if err != nil {
		log.Printf("uploadToGridFS: Failed to open file %s: %v", file.Filename, err)
		return "", fmt.Errorf("failed to open file: %v", err)
	}
	defer fileStream.Close()

	// Connect to MongoDB GridFS
	bucket, err := gridfs.NewBucket(
		configs.Client.Database("ProjectsDB"),
		&options.BucketOptions{Name: nil},
	)
	if err != nil {
		log.Printf("uploadToGridFS: Failed to create GridFS bucket: %v", err)
		return "", fmt.Errorf("failed to create GridFS bucket: %v", err)
	}

	// Upload file to GridFS
	uploadStream, err := bucket.OpenUploadStream(file.Filename)
	if err != nil {
		log.Printf("uploadToGridFS: Failed to open upload stream for file %s: %v", file.Filename, err)
		return "", fmt.Errorf("failed to open upload stream: %v", err)
	}
	defer uploadStream.Close()

	_, err = io.Copy(uploadStream, fileStream)
	if err != nil {
		log.Printf("uploadToGridFS: Failed to upload file %s to GridFS: %v", file.Filename, err)
		return "", fmt.Errorf("failed to upload file to GridFS: %v", err)
	}

	// Get the file ID
	fileID := uploadStream.FileID.(primitive.ObjectID)

	// Save file metadata to FilesColl
	filesColl := configs.Client.Database("ProjectsDB").Collection("FilesColl")
	_, err = filesColl.InsertOne(context.Background(), bson.M{
		"_id":      fileID,
		"filename": file.Filename,
		"type":     fileType,
		"size":     file.Size,
		"uploaded": time.Now(),
	})
	if err != nil {
		log.Printf("uploadToGridFS: Failed to save file metadata for file %s: %v", file.Filename, err)
		return "", fmt.Errorf("failed to save file metadata: %v", err)
	}

	// Generate file URL
	fileUrl := fmt.Sprintf("http://localhost:8081/files/%s", fileID.Hex())
	log.Printf("uploadToGridFS: File %s uploaded successfully, URL: %s", file.Filename, fileUrl)
	return fileUrl, nil
}

func UploadFileHandler(c *fiber.Ctx) error {
	// Get user email from JWT token
	claims, ok := c.Locals("user").(jwt.MapClaims)
	if !ok {
		log.Printf("UploadFileHandler: Failed to get user claims from token")
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid token claims",
		})
	}
	userEmail, ok := claims["email"].(string)
	if !ok {
		log.Printf("UploadFileHandler: Email not found in token claims")
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid token claims",
		})
	}

	log.Printf("UploadFileHandler: User %s requested to upload file", userEmail)

	// Get file from form data
	file, err := c.FormFile("file")
	if err != nil {
		log.Printf("UploadFileHandler: Failed to get file from form: %v", err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Cannot get file from form",
		})
	}

	// Get file type from form data
	fileType := c.FormValue("type")
	if fileType != "image" && fileType != "video" {
		log.Printf("UploadFileHandler: Invalid file type %s", fileType)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid file type",
		})
	}

	// Upload file to GridFS
	fileUrl, err := uploadToGridFS(file, fileType)
	if err != nil {
		log.Printf("UploadFileHandler: Failed to upload file %s: %v", file.Filename, err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	log.Printf("UploadFileHandler: File %s uploaded successfully by user %s", file.Filename, userEmail)
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "File uploaded successfully",
		"fileUrl": fileUrl,
	})
}

func AddProjectHandler(c *fiber.Ctx) error {
	// Get user email from JWT token
	claims, ok := c.Loc sanzibarigoat/fiber/v2")
	if !ok {
		log.Printf("AddProjectHandler: Failed to get user claims from token")
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid token claims",
		})
	}
	userEmail, ok := claims["email"].(string)
	if !ok {
		log.Printf("AddProjectHandler: Email not found in token claims")
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid token claims",
		})
	}

	categoryName := strings.Title(strings.ToLower(c.Params("category")))
	if categoryName == "" {
		log.Printf("AddProjectHandler: Category is missing")
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Category is required",
		})
	}

	log.Printf("AddProjectHandler: User %s requested to add project in category %s", userEmail, categoryName)

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	// Find category_id
	var category models.Category
	err := configs.CategoriesColl.FindOne(ctx, bson.M{"nameCategory": categoryName}).Decode(&category)
	if err != nil {
		log.Printf("AddProjectHandler: Category %s not found: %v", categoryName, err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Category not found",
		})
	}

	// Parse multipart form
	form, err := c.MultipartForm()
	if err != nil {
		log.Printf("AddProjectHandler: Failed to parse form data: %v", err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Failed to parse form data",
		})
	}

	uploadType := form.Value["type"]
	log.Printf("AddProjectHandler: Upload type: %v", uploadType)
	if len(uploadType) == 0 || (uploadType[0] != "image" && uploadType[0] != "video" && uploadType[0] != "videoUrl") {
		if len(form.Value["videoUrl"]) == 0 {
			log.Printf("AddProjectHandler: Invalid or missing upload type or video URL")
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid or missing upload type or video URL",
			})
		}
	}

	project := models.Project{
		CategoryID: category.ID,
		CreatedAt:  time.Now(),
		UpdatedAt:  time.Now(),
	}

	// Handle file upload
	files := form.File["file"]
	if len(files) > 0 {
		file := files[0]
		log.Printf("AddProjectHandler: File received: %s, Size: %d MB", file.Filename, file.Size/(1024*1024))
		fileUrl, err := uploadToGridFS(file, uploadType[0])
		if err != nil {
			log.Printf("AddProjectHandler: Failed to upload file %s: %v", file.Filename, err)
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": err.Error(),
			})
		}
		if uploadType[0] == "image" {
			project.ImageUrl = fileUrl
		} else if uploadType[0] == "video" {
			project.VideoUrl = fileUrl
		}
	} else if len(form.Value["videoUrl"]) > 0 {
		project.VideoUrl = form.Value["videoUrl"][0]
		log.Printf("AddProjectHandler: Video URL received: %s", project.VideoUrl)
	} else {
		log.Printf("AddProjectHandler: No file or video URL provided")
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "No file or video URL provided",
		})
	}

	// Insert project into database
	result, err := configs.ProjectsColl.InsertOne(ctx, project)
	if err != nil {
		log.Printf("AddProjectHandler: Failed to insert project: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to create project",
		})
	}

	project.ID = result.InsertedID.(primitive.ObjectID)
	log.Printf("AddProjectHandler: Project %s created successfully by user %s in category %s", project.ID.Hex(), userEmail, categoryName)
	return c.JSON(fiber.Map{
		"message": "Project created successfully",
		"data":    project,
	})
}

func GetFileHandler(c *fiber.Ctx) error {
	fileID := c.Params("id")
	if fileID == "" {
		log.Printf("GetFileHandler: File ID is missing")
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "File ID is required",
		})
	}

	log.Printf("GetFileHandler: Request to fetch file ID %s", fileID)

	// Convert fileID to ObjectID
	objID, err := primitive.ObjectIDFromHex(fileID)
	if err != nil {
		log.Printf("GetFileHandler: Invalid file ID %s: %v", fileID, err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid file ID",
		})
	}

	// Open MongoDB database
	db := configs.Client.Database("ProjectsDB")
	bucket, err := gridfs.NewBucket(db)
	if err != nil {
		log.Printf("GetFileHandler: Failed to initialize GridFS: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to initialize GridFS",
		})
	}

	// Open download stream
	downloadStream, err := bucket.OpenDownloadStream(objID)
	if err != nil {
		log.Printf("GetFileHandler: Failed to find file ID %s: %v", fileID, err)
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "File not found",
		})
	}
	defer downloadStream.Close()

	// Get filename from GridFS file
	filename := downloadStream.GetFile().Name
	log.Printf("GetFileHandler: Serving file %s", filename)

	// Set Content-Type based on file extension
	var contentType string
	ext := filepath.Ext(filename)
	switch strings.ToLower(ext) {
	case ".jpg", ".jpeg":
		contentType = "image/jpeg"
	case ".png":
		contentType = "image/png"
	case ".mp4":
		contentType = "video/mp4"
	case ".webm":
		contentType = "video/webm"
	default:
		contentType = "application/octet-stream"
	}

	// Set headers
	c.Set("Content-Type", contentType)
	c.Set("Content-Disposition", fmt.Sprintf("inline; filename=%q", filename))

	// Stream file to response
	_, err = io.Copy(c, downloadStream)
	if err != nil {
		log.Printf("GetFileHandler: Failed to stream file %s: %v", filename, err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to stream file",
		})
	}

	log.Printf("GetFileHandler: File %s served successfully", filename)
	return nil
}

func UpdateProjectHandler(c *fiber.Ctx) error {
	// Get user email from JWT token
	claims, ok := c.Locals("user").(jwt.MapClaims)
	if !ok {
		log.Printf("UpdateProjectHandler: Failed to get user claims from token")
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid token claims",
		})
	}
	userEmail, ok := claims["email"].(string)
	if !ok {
		log.Printf("UpdateProjectHandler: Email not found in token claims")
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid token claims",
		})
	}

	id := c.Params("id")
	if id == "" {
		log.Printf("UpdateProjectHandler: Project ID is missing")
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Project ID is required",
		})
	}

	categoryName := strings.Title(strings.ToLower(c.Params("category")))
	if categoryName == "" {
		log.Printf("UpdateProjectHandler: Category is missing")
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Category is required",
		})
	}

	log.Printf("UpdateProjectHandler: User %s requested to update project ID %s in category %s", userEmail, id, categoryName)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var category models.Category
	err := configs.CategoriesColl.FindOne(ctx, bson.M{"nameCategory": categoryName}).Decode(&category)
	if err != nil {
		log.Printf("UpdateProjectHandler: Category %s not found: %v", categoryName, err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Category not found",
		})
	}

	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		log.Printf("UpdateProjectHandler: Invalid project ID %s: %v", id, err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid project ID",
		})
	}

	var req ProjectRequest
	if err := c.BodyParser(&req); err != nil {
		log.Printf("UpdateProjectHandler: Failed to parse request body: %v", err)
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
		log.Printf("UpdateProjectHandler: Failed to update project ID %s: %v", id, err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update project",
		})
	}

	if result.MatchedCount == 0 {
		log.Printf("UpdateProjectHandler: No project matched for ID %s in category %s", id, categoryName)
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Project not found or category does not match",
		})
	}

	// Fetch the updated project
	var updatedProject models.Project
	err = configs.ProjectsColl.FindOne(ctx, bson.M{"_id": objID}).Decode(&updatedProject)
	if err != nil {
		log.Printf("UpdateProjectHandler: Failed to fetch updated project ID %s: %v", id, err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch updated project",
		})
	}

	log.Printf("UpdateProjectHandler: Project %s updated successfully by user %s", id, userEmail)
	return c.JSON(fiber.Map{
		"message": "Project updated successfully",
		"data":    updatedProject,
	})
}

func DeleteProjectHandler(c *fiber.Ctx) error {
	// Get user email from JWT token
	claims, ok := c.Locals("user").(jwt.MapClaims)
	if !ok {
		log.Printf("DeleteProjectHandler: Failed to get user claims from token")
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid token claims",
		})
	}
	userEmail, ok := claims["email"].(string)
	if !ok {
		log.Printf("DeleteProjectHandler: Email not found in token claims")
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid token claims",
		})
	}

	id := c.Params("id")
	if id == "" {
		log.Printf("DeleteProjectHandler: Project ID is missing")
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Project ID is required",
		})
	}

	categoryName := strings.Title(strings.ToLower(c.Params("category")))
	if categoryName == "" {
		log.Printf("DeleteProjectHandler: Category is missing")
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Category is required",
		})
	}

	log.Printf("DeleteProjectHandler: User %s requested to delete project ID %s in category %s", userEmail, id, categoryName)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var category models.Category
	err := configs.CategoriesColl.FindOne(ctx, bson.M{"nameCategory": categoryName}).Decode(&category)
	if err != nil {
		log.Printf("DeleteProjectHandler: Category %s not found: %v", categoryName, err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Category not found",
		})
	}

	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		log.Printf("DeleteProjectHandler: Invalid project ID %s: %v", id, err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid project ID",
		})
	}

	// Delete associated service steps
	_, err = configs.ServiceStepsColl.DeleteMany(ctx, bson.M{"project_id": objID})
	if err != nil {
		log.Printf("DeleteProjectHandler: Failed to delete associated service steps for project ID %s: %v", id, err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to delete associated service steps",
		})
	}

	// Delete project
	result, err := configs.ProjectsColl.DeleteOne(ctx, bson.M{"_id": objID, "category_id": category.ID})
	if err != nil {
		log.Printf("DeleteProjectHandler: Failed to delete project ID %s: %v", id, err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to delete project",
		})
	}

	if result.DeletedCount == 0 {
		log.Printf("DeleteProjectHandler: No project matched for ID %s in category %s", id, categoryName)
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Project not found or category does not match",
		})
	}

	log.Printf("DeleteProjectHandler: Project %s deleted successfully by user %s", id, userEmail)
	return c.JSON(fiber.Map{
		"message": "Project deleted successfully",
	})
}

func GetProjectsByCategoryHandler(c *fiber.Ctx) error {
	categoryName := strings.Title(strings.ToLower(c.Params("category")))
	if categoryName == "" {
		log.Printf("GetProjectsByCategoryHandler: Category is missing")
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Category is required",
		})
	}

	log.Printf("GetProjectsByCategoryHandler: Request to fetch projects in category %s", categoryName)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var category models.Category
	err := configs.CategoriesColl.FindOne(ctx, bson.M{"nameCategory": categoryName}).Decode(&category)
	if err != nil {
		log.Printf("GetProjectsByCategoryHandler: Category %s not found: %v", categoryName, err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Category not found",
		})
	}

	cursor, err := configs.ProjectsColl.Find(ctx, bson.M{"category_id": category.ID}, options.Find().SetSort(bson.M{"createdAt": -1}))
	if err != nil {
		log.Printf("GetProjectsByCategoryHandler: Failed to fetch projects for category %s: %v", categoryName, err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch projects",
		})
	}
	defer cursor.Close(ctx)

	var projects []models.Project
	if err := cursor.All(ctx, &projects); err != nil {
		log.Printf("GetProjectsByCategoryHandler: Failed to process projects for category %s: %v", categoryName, err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to process projects",
		})
	}

	log.Printf("GetProjectsByCategoryHandler: Retrieved %d projects for category %s", len(projects), categoryName)
	return c.JSON(fiber.Map{
		"message": "Projects retrieved successfully",
		"data":    projects,
		"count":   len(projects),
	})
}

func GetAllProjectsHandler(c *fiber.Ctx) error {
	log.Printf("GetAllProjectsHandler: Request to fetch all projects")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	cursor, err := configs.ProjectsColl.Find(ctx, bson.M{}, options.Find().SetSort(bson.M{"createdAt": -1}))
	if err != nil {
		log.Printf("GetAllProjectsHandler: Failed to fetch projects: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch projects",
		})
	}
	defer cursor.Close(ctx)

	var projects []models.Project
	if err := cursor.All(ctx, &projects); err != nil {
		log.Printf("GetAllProjectsHandler: Failed to process projects: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to process projects",
		})
	}

	log.Printf("GetAllProjectsHandler: Retrieved %d projects", len(projects))
	return c.JSON(fiber.Map{
		"message": "Projects retrieved successfully",
		"data":    projects,
		"count":   len(projects),
	})
}