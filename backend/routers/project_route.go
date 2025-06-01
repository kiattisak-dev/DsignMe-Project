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
	servicestepsRoute := app.Group("/servicesteps", middleware.AuthMiddleware())
	servicestepsCategoryRoute := servicestepsRoute.Group("/:category")
	servicestepsServiceStepsRoute := servicestepsCategoryRoute.Group("/service-steps")
	servicestepsServiceStepsRoute.Get("/", controllers.GetAllServiceStepsHandler)
	servicestepsServiceStepsRoute.Get("/:stepId", controllers.GetServiceStepHandler)
	servicestepsServiceStepsRoute.Post("/", controllers.AddServiceStepHandler)
	servicestepsServiceStepsRoute.Put("/:stepId", controllers.UpdateServiceStepsHandler)
	servicestepsServiceStepsRoute.Delete("/:stepId", controllers.DeleteServiceStepHandler)
}
