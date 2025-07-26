package middleware

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func CorsMiddleware() fiber.Handler {
	return cors.New(cors.Config{
		AllowOrigins:     "http://localhost:5173, http://localhost:3000, https://dsignme-admin.vercel.app, https://www.dsignme.co",
		AllowMethods:     "GET,POST,PUT,PATCH,DELETE",
		AllowCredentials: true,
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization",
	})
}