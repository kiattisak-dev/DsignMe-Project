package routers

import (
	"backend/controllers"
	"backend/middleware"
	"github.com/gofiber/fiber/v2"
)

func AuthRoutes(app *fiber.App) {
	// Register and Login routes without AuthMiddleware
	app.Post("/auth/register", controllers.CreateUserHandler)
	app.Post("/auth/login", controllers.LoginHandler)
	app.Post("/auth/verify", controllers.VerifyTokenHandler)

	// All other auth routes with AuthMiddleware
	authRoute := app.Group("/auth", middleware.AuthMiddleware())
	authRoute.Post("/reset-password", controllers.ResetPasswordHandler)

	// Handle 404 for /auth routes
	authRoute.Use(func(c *fiber.Ctx) error {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Route not found",
		})
	})
}