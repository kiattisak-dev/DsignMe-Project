package routers

import (
	"backend/controllers"

	"github.com/gofiber/fiber/v2"
)

func AuthRoutes(app *fiber.App) {
	
	app.Post("/register", controllers.CreateUserHandler)
	app.Post("/login", controllers.LoginHandler)
	app.Post("/reset-password", controllers.ResetPasswordHandler)
}
