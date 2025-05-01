package configs

import (
	"github.com/joho/godotenv"
	"log"
	"os"
)

func LoadEnv() {
	err := godotenv.Load()
	if err != nil {
		log.Println("Warning: No .env file found, make sure to set environment variables")
	}
}

func EnvMongoURI() string {
	LoadEnv()
	mongoURI := os.Getenv("MONGOURL")
	if mongoURI == "" {
		log.Fatal("❌ MONGOURL is not set in the environment")
	}
	return mongoURI
}

func EnvSecret() string {
	LoadEnv()
	secret := os.Getenv("SECRET")
	if secret == "" {
		log.Fatal("❌ SECRET is not set in the environment")
	}
	return secret
}

func EnvPort() string {
	LoadEnv()
	port := os.Getenv("PORT")
	if port == "" {
		log.Fatal("❌ PORT is not set in the environment")
	}
	return port
}
