// package middleware

// import (
// 	"os"

// 	"github.com/gofiber/fiber/v2"
// 	"github.com/gofiber/fiber/v2/middleware/cors"
// )

// func CorsMiddleware() fiber.Handler {
// 	// ใช้ environment variable สำหรับ AllowOrigins (ถ้าไม่กำหนดใช้ค่า default)
// 	allowedOrigins := os.Getenv("CORS_ALLOWED_ORIGINS")
// 	if allowedOrigins == "" {
// 		allowedOrigins = "https://dsignme-admin.vercel.app,https://www.dsignme.co"
// 	}

// 	return cors.New(cors.Config{
// 		AllowOrigins:     allowedOrigins,
// 		AllowMethods:     "GET,POST,PUT,PATCH,DELETE",
// 		AllowHeaders:     "Origin, Content-Type, Accept, Authorization",
// 		AllowCredentials: true,
// 		ExposeHeaders:    "Content-Length", // เพิ่มถ้าต้องการ expose header อื่น
// 	})
// }

package middleware

import (
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func CorsMiddleware() fiber.Handler {
	// อ่านค่า allowed origins จาก environment variable (เช่น "https://example.com,https://foo.com")
	// ถ้าไม่มีค่าใน env ให้ใช้ค่า default ที่เหมาะสม (ไม่มี / ท้าย และไม่มีเว้นวรรค)
	allowedOrigins := os.Getenv("CORS_ALLOWED_ORIGINS")
	if allowedOrigins == "" {
		allowedOrigins = "https://dsignme-admin.vercel.app,https://www.dsignme.co"
	}

	return cors.New(cors.Config{
		AllowOrigins:     "http://localhost:5173, http://localhost:3000, https://dsignme-admin.vercel.app, https://www.dsignme.co",
		AllowMethods:     "GET,POST,PUT,PATCH,DELETE",
		AllowCredentials: true,
		ExposeHeaders:    "Content-Length", // กรณีต้องการ expose header อื่น ๆ
	})
}
