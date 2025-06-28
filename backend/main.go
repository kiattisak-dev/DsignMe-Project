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

	// Initialize Fiber app with BodyLimit
	app := fiber.New(fiber.Config{
		BodyLimit: 10 * 1024 * 1024, // Set limit to 10 MB
	})

	// Apply CORS middleware globally
	app.Use(middleware.CorsMiddleware())

	// Setup routes
	routers.AuthRoutes(app)
	routers.ProjectRoutes(app)

	// **เพิ่มตรงนี้เพื่อใช้ protected routes เช่น /me**
	routers.ProtectedRoutes(app)

	// Start server
	port := configs.EnvPort()
	log.Printf("Server running on port %s", port)
	log.Fatal(app.Listen(":" + port))
}
