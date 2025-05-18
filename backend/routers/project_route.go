package routers

import (
	"backend/controllers"
	"backend/middleware"

	"github.com/gofiber/fiber/v2"
)

func ProjectRoutes(app *fiber.App) {
	route := app.Group("/projects", middleware.AuthMiddleware())
	route.Get("/", controllers.GetAllProjectsHandler)

	// Route GridFS
	app.Get("/files/:id", controllers.GetFileHandler)

	// Categories routes
	route.Post("/categories", controllers.AddCategoryHandler)
	route.Get("/categories", controllers.GetCategoriesHandler)
	route.Put("/categories/:id", controllers.UpdateCategoryHandler)
	route.Delete("/categories/:id", controllers.DeleteCategoryHandler)

	// Dynamic category routes
	categoryRoute := route.Group("/:category")
	categoryRoute.Get("/", controllers.GetProjectsByCategoryHandler)
	categoryRoute.Post("/", controllers.AddProjectHandler)
	categoryRoute.Put("/:id", controllers.UpdateProjectHandler)
	categoryRoute.Delete("/:id", controllers.DeleteProjectHandler)

	// Service steps routes
	serviceStepsRoute := categoryRoute.Group("/service-steps")
	serviceStepsRoute.Get("/", controllers.GetAllServiceStepsHandler)
	serviceStepsRoute.Get("/:stepId", controllers.GetServiceStepHandler)
	serviceStepsRoute.Post("/", controllers.AddServiceStepHandler)
	serviceStepsRoute.Put("/:stepId", controllers.UpdateServiceStepsHandler)
	serviceStepsRoute.Delete("/:stepId", controllers.DeleteServiceStepHandler)
}
