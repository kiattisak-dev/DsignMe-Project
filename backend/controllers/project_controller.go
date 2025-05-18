package controllers

import (
	"backend/configs"
	"backend/models"
	"context"
	"fmt"
	"io"
	"path/filepath"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/gridfs"
	"go.mongodb.org/mongo-driver/mongo/options"
	"mime/multipart"
)

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

// uploadToGridFS uploads a file to GridFS and returns the file URL
func uploadToGridFS(file *multipart.FileHeader, fileType string) (string, error) {
	// Validate file size
	maxSize := int64(5 * 1024 * 1024) // 5MB for image
	if fileType == "video" {
		maxSize = 50 * 1024 * 1024 // 50MB for video
	}
	if file.Size > maxSize {
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
		return "", fmt.Errorf("invalid file type, allowed types are %v", allowedTypes)
	}

	// Open the file
	fileStream, err := file.Open()
	if err != nil {
		return "", fmt.Errorf("failed to open file: %v", err)
	}
	defer fileStream.Close()

	// Connect to MongoDB GridFS
	bucket, err := gridfs.NewBucket(
		configs.Client.Database("ProjectsDB"),
		&options.BucketOptions{Name: nil}, // Use default bucket name "fs"
	)
	if err != nil {
		return "", fmt.Errorf("failed to create GridFS bucket: %v", err)
	}

	// Upload file to GridFS
	uploadStream, err := bucket.OpenUploadStream(file.Filename)
	if err != nil {
		return "", fmt.Errorf("failed to open upload stream: %v", err)
	}
	defer uploadStream.Close()

	_, err = io.Copy(uploadStream, fileStream)
	if err != nil {
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
		return "", fmt.Errorf("failed to save file metadata: %v", err)
	}

	// Generate file URL
	fileUrl := fmt.Sprintf("http://localhost:8081/files/%s", fileID.Hex())
	return fileUrl, nil
}

func UploadFileHandler(c *fiber.Ctx) error {
	// Get file from form data
	file, err := c.FormFile("file")
	if err != nil {
		fmt.Println("Error: Failed to get file from form:", err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Cannot get file from form",
		})
	}

	// Get file type from form data
	fileType := c.FormValue("type")
	if fileType != "image" && fileType != "video" {
		fmt.Println("Error: Invalid file type:", fileType)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid file type",
		})
	}

	// Upload file to GridFS
	fileUrl, err := uploadToGridFS(file, fileType)
	if err != nil {
		fmt.Println("Error: Failed to upload file:", err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "File uploaded successfully",
		"fileUrl": fileUrl,
	})
}

func AddProjectHandler(c *fiber.Ctx) error {
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

	// Parse multipart form
	form, err := c.MultipartForm()
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Failed to parse form data",
		})
	}

	uploadType := form.Value["type"]
	if len(uploadType) == 0 || (uploadType[0] != "image" && uploadType[0] != "video" && uploadType[0] != "videoUrl") {
		if len(form.Value["videoUrl"]) == 0 {
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
		fileUrl, err := uploadToGridFS(file, uploadType[0])
		if err != nil {
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
	} else {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "No file or video URL provided",
		})
	}

	// Insert project into database
	result, err := configs.ProjectsColl.InsertOne(ctx, project)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to create project",
		})
	}

	project.ID = result.InsertedID.(primitive.ObjectID)

	return c.JSON(fiber.Map{
		"message": "Project created successfully",
		"data":    project,
	})
}

func GetFileHandler(c *fiber.Ctx) error {
	// Get fileID from URL parameter
	fileID := c.Params("id")
	if fileID == "" {
		fmt.Println("Error: File ID is required")
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "File ID is required",
		})
	}

	// Convert fileID to ObjectID
	objID, err := primitive.ObjectIDFromHex(fileID)
	if err != nil {
		fmt.Println("Error: Invalid file ID:", err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid file ID",
		})
	}

	// Open MongoDB database
	db := configs.Client.Database("ProjectsDB")
	bucket, err := gridfs.NewBucket(db)
	if err != nil {
		fmt.Println("Error: Failed to initialize GridFS:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to initialize GridFS",
		})
	}

	// Open download stream
	downloadStream, err := bucket.OpenDownloadStream(objID)
	if err != nil {
		fmt.Println("Error: Failed to find file:", err)
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "File not found",
		})
	}
	defer downloadStream.Close()

	// Get filename from GridFS file
	filename := downloadStream.GetFile().Name
	fmt.Println("Serving file:", filename)

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
		fmt.Println("Error: Failed to stream file:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to stream file",
		})
	}

	return nil
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
