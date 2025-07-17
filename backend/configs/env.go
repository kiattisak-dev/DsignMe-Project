package configs

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

func init() {
	// Load .env file only if exists (useful for local development)
	err := godotenv.Load()
	if err != nil {
		log.Println("⚠️ .env file not found. Using system environment variables.")
	}
}

func EnvMongoURI() string {
	mongoURI := os.Getenv("MONGOURL")
	if mongoURI == "" {
		log.Fatal("❌ MONGOURL is not set")
	}
	return mongoURI
}

func EnvSecret() string {
	secret := os.Getenv("SECRET")
	if secret == "" {
		log.Fatal("❌ SECRET is not set")
	}
	return secret
}

func EnvPort() string {
	port := os.Getenv("PORT")
	if port == "" {
		log.Println("⚠️ PORT not set, using default 8080")
		return "8080"
	}
	return port
}
