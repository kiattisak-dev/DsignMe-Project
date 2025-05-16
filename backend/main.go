package main

import (
	"backend/configs"
	"backend/middleware"
	"backend/routers"
	"log"

	"github.com/gofiber/fiber/v2"
)

func main() {
	configs.LoadEnv()

	// Initialize database
	configs.InitDB()
	defer configs.DisconnectDB()

	// Initialize Fiber app
	app := fiber.New()

	// Apply CORS middleware globally
	app.Use(middleware.CorsMiddleware())

	// Setup routes
	routers.AuthRoutes(app)
	routers.ProjectRoutes(app)

	// Start server
	port := configs.EnvPort()
	log.Printf("Server running on port %s", port)
	log.Fatal(app.Listen(":" + port))
}
