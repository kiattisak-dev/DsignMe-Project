package routers

import (
	"backend/middleware"
	"github.com/dgrijalva/jwt-go"
	"github.com/gofiber/fiber/v2"
)

func ProtectedRoutes(app *fiber.App) {
	app.Get("/me", middleware.AuthMiddleware(), func(c *fiber.Ctx) error {
		user := c.Locals("user").(jwt.MapClaims)
		return c.JSON(fiber.Map{
			"email": user["email"],
		})
	})
}
