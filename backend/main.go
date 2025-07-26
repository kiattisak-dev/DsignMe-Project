package main

import (
	"backend/configs"
	"backend/middleware"
	"backend/routers"
	"context"
	"log"
	"os"
	"os/signal"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

func main() {
	// Environment variables are loaded via init() in configs/env.go

	// Initialize database
	if err := configs.InitDB(); err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}
	defer configs.DisconnectDB()

	// Initialize Fiber app with configuration
	app := fiber.New(fiber.Config{
		BodyLimit: 50 * 1024 * 1024, // 50 MB limit for video uploads
	})

	// Apply middleware
	app.Use(middleware.CorsMiddleware())
	app.Use(logger.New(logger.Config{
		Format: "${time} ${method} ${path} - ${ip} - ${status} ${latency}\n",
		// Output to stdout (Render will capture this for logs)
	}))

	// Setup routes
	routers.AuthRoutes(app)
	routers.ProjectRoutes(app)

	// Handle 404 for undefined routes
	app.Use(func(c *fiber.Ctx) error {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Route not found",
		})
	})

	// Get port from environment (Render provides PORT automatically)
	port := os.Getenv("PORT")
	if port == "" {
		log.Fatalf("PORT environment variable is not set, expected by Render")
	}

	// Start server with graceful shutdown
	server := make(chan struct{})
	go func() {
		log.Printf("Server running on port %s", port)
		if err := app.Listen(":" + port); err != nil {
			log.Printf("Server failed to start: %v", err)
			close(server)
		}
	}()

	// Handle graceful shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt)
	<-quit
	log.Println("Shutting down server...")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := app.ShutdownWithContext(ctx); err != nil {
		log.Printf("Server shutdown failed: %v", err)
	}
	log.Println("Server stopped gracefully")
	close(server)
}