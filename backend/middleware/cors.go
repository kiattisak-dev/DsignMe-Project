package middleware

import (
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func CorsMiddleware() fiber.Handler {
	// ใช้ environment variable สำหรับ AllowOrigins (ถ้าไม่กำหนดใช้ค่า default)
	allowedOrigins := os.Getenv("CORS_ALLOWED_ORIGINS")
	if allowedOrigins == "" {
		allowedOrigins = "https://dsignme-admin.vercel.app" // ค่า default สำหรับ production
	}

	return cors.New(cors.Config{
		AllowOrigins:     allowedOrigins,
		AllowMethods:     "GET,POST,PUT,PATCH,DELETE",
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization",
		AllowCredentials: true,
		ExposeHeaders:    "Content-Length", // เพิ่มถ้าต้องการ expose header อื่น
	})
}