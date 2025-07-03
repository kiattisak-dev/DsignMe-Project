package routers

import (
	"backend/controllers"
	"backend/middleware"
	"github.com/gofiber/fiber/v2"
)

func ProjectRoutes(app *fiber.App) {
	// Apply AuthMiddleware to all project routes except file download
	route := app.Group("/projects", middleware.AuthMiddleware())
	route.Get("/", controllers.GetAllProjectsHandler)

	// Route for file upload
	route.Post("/files", controllers.UploadFileHandler)

	// Route GridFS (no AuthMiddleware for file access)
	app.Get("/files/:id", controllers.GetFileHandler)

	// Categories routes
	route.Post("/categories", controllers.AddCategoryHandler)
	route.Get("/categories", controllers.GetCategoriesHandler)
	route.Put("/categories/:id", controllers.UpdateCategoryHandler)
	route.Delete("/categories/:id", controllers.DeleteCategoryHandler)

	// Dynamic category routes for projects
	categoryRoute := route.Group("/:category")
	categoryRoute.Get("/", controllers.GetProjectsByCategoryHandler)
	categoryRoute.Post("/", controllers.AddProjectHandler)
	categoryRoute.Put("/:id", controllers.UpdateProjectHandler)
	categoryRoute.Delete("/:id", controllers.DeleteProjectHandler)

	// Service steps routes
	serviceStepsRoute := app.Group("/servicesteps", middleware.AuthMiddleware())
	serviceStepsCategoryRoute := serviceStepsRoute.Group("/:category")
	serviceStepsCategoryRoute.Get("/service-steps", controllers.GetAllServiceStepsHandler)
	serviceStepsCategoryRoute.Get("/service-steps/:stepId", controllers.GetServiceStepHandler)
	serviceStepsCategoryRoute.Post("/service-steps", controllers.AddServiceStepHandler)
	serviceStepsCategoryRoute.Put("/service-steps/:stepId", controllers.UpdateServiceStepsHandler)
	serviceStepsCategoryRoute.Delete("/service-steps/:stepId", controllers.DeleteServiceStepHandler)

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
