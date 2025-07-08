package routers

import (
	"backend/controllers"
	"backend/middleware"
	"github.com/gofiber/fiber/v2"
)

func ProjectRoutes(app *fiber.App) {
	// Public routes (no authentication required)
	app.Get("/projects", controllers.GetAllProjectsHandler)
	// Move /projects/categories before /projects/:category
	app.Get("/projects/categories", controllers.GetCategoriesHandler)
	app.Get("/projects/:category", controllers.GetProjectsByCategoryHandler)
	app.Get("/servicesteps/:category/service-steps", controllers.GetAllServiceStepsHandler)

	// Authenticated routes
	route := app.Group("/projects", middleware.AuthMiddleware())

	// Route for file upload
	route.Post("/files", controllers.UploadFileHandler)

	// Categories routes (authenticated CRUD operations)
	route.Post("/categories", controllers.AddCategoryHandler)
	route.Put("/categories/:id", controllers.UpdateCategoryHandler)
	route.Delete("/categories/:id", controllers.DeleteCategoryHandler)

	// Dynamic category routes for projects (authenticated CRUD operations)
	categoryRoute := route.Group("/:category")
	categoryRoute.Post("/", controllers.AddProjectHandler)
	categoryRoute.Put("/:id", controllers.UpdateProjectHandler)
	categoryRoute.Delete("/:id", controllers.DeleteProjectHandler)

	// Service steps routes (authenticated)
	serviceStepsRoute := app.Group("/servicesteps", middleware.AuthMiddleware())
	serviceStepsCategoryRoute := serviceStepsRoute.Group("/:category")
	serviceStepsCategoryRoute.Get("/service-steps/:stepId", controllers.GetServiceStepHandler)
	serviceStepsCategoryRoute.Post("/service-steps", controllers.AddServiceStepHandler)
	serviceStepsCategoryRoute.Put("/service-steps/:stepId", controllers.UpdateServiceStepsHandler)
	serviceStepsCategoryRoute.Delete("/service-steps/:stepId", controllers.DeleteServiceStepHandler)

	// Route for file download (no authentication required)
	app.Get("/files/:id", controllers.GetFileHandler)

	// Handle 404 for /projects routes
	route.Use(func(c *fiber.Ctx) error {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Route not found",
		})
	})

	// Handle 404 for /servicesteps routes
	serviceStepsRoute.Use(func(c *fiber.Ctx) error {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Route not found",
		})
	})
}