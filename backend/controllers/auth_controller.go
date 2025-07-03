package controllers

import (
	"backend/configs"
	"backend/models"
	"context"
	"log"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
)

func CreateUserHandler(c *fiber.Ctx) error {
	type CreateUserRequest struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	log.Printf("CreateUserHandler: Received request to create user")

	var req CreateUserRequest
	if err := c.BodyParser(&req); err != nil {
		log.Printf("CreateUserHandler: Failed to parse request body: %v", err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	if req.Email == "" || req.Password == "" {
		log.Printf("CreateUserHandler: Missing email or password")
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Email and password are required",
		})
	}

	// Check if user already exists
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var existingUser models.User
	err := configs.UsersColl.FindOne(ctx, fiber.Map{"email": req.Email}).Decode(&existingUser)
	if err == nil {
		log.Printf("CreateUserHandler: User with email %s already exists", req.Email)
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{
			"error": "User with this email already exists",
		})
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		log.Printf("CreateUserHandler: Failed to hash password: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to hash password",
		})
	}

	user := models.User{
		Email:    req.Email,
		Password: string(hashedPassword),
	}

	_, err = configs.UsersColl.InsertOne(ctx, user)
	if err != nil {
		log.Printf("CreateUserHandler: Failed to create user with email %s: %v", req.Email, err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to create user",
		})
	}

	log.Printf("CreateUserHandler: User created successfully with email %s", req.Email)
	return c.JSON(fiber.Map{
		"message": "User created successfully",
		"data": fiber.Map{
			"email": user.Email,
		},
	})
}

func LoginHandler(c *fiber.Ctx) error {
	type LoginRequest struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	log.Printf("LoginHandler: Received login request")

	var req LoginRequest
	if err := c.BodyParser(&req); err != nil {
		log.Printf("LoginHandler: Failed to parse request body: %v", err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	// Find user in database
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var user models.User
	err := configs.UsersColl.FindOne(ctx, fiber.Map{"email": req.Email}).Decode(&user)
	if err != nil {
		log.Printf("Login}')
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid email or password",
		})
	}

	// Verify password
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password))
	if err != nil {
		log.Printf("LoginHandler: Invalid password for email %s", req.Email)
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid email or password",
		})
	}

	// Generate JWT token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"email": user.Email,
		"exp":   time.Now().Add(time.Hour * 24).Unix(),
	})

	tokenString, err := token.SignedString([]byte(configs.EnvSecret()))
	if err != nil {
		log.Printf("LoginHandler: Failed to generate token for email %s: %v", req.Email, err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to generate token",
		})
	}

	log.Printf("LoginHandler: User logged in successfully with email %s", req.Email)
	return c.JSON(fiber.Map{
		"token": tokenString,
	})
}

func ResetPasswordHandler(c *fiber.Ctx) error {
	type ResetPasswordRequest struct {
		Email       string `json:"email"`
		NewPassword string `json:"newPassword"`
	}

	// Get user email from JWT token
	claims, ok := c.Locals("user").(jwt.MapClaims)
	if !ok {
		log.Printf("ResetPasswordHandler: Failed to get user claims from token")
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid token claims",
		})
	}
	tokenEmail, ok := claims["email"].(string)
	if !ok {
		log.Printf("ResetPasswordHandler: Email not found in token claims")
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid token claims",
		})
	}

	log.Printf("ResetPasswordHandler: Received request to reset password for user %s", tokenEmail)

	var req ResetPasswordRequest
	if err := c.BodyParser(&req); err != nil {
		log.Printf("ResetPasswordHandler: Failed to parse request body: %v", err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	if req.Email == "" || req.NewPassword == "" {
		log.Printf("ResetPasswordHandler: Missing email or new password")
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Email and new password are required",
		})
	}

	// Ensure the email in request matches the token
	if req.Email != tokenEmail {
		log.Printf("ResetPasswordHandler: Email mismatch. Token email: %s, Request email: %s", tokenEmail, req.Email)
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"error": "Cannot reset password for another user",
		})
	}

	// Find user in database
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var user models.User
	err := configs.UsersColl.FindOne(ctx, fiber.Map{"email": req.Email}).Decode(&user)
	if err != nil {
		log.Printf("ResetPasswordHandler: User not found with email %s: %v", req.Email, err)
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "User not found",
		})
	}

	// Hash new password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		log.Printf("ResetPasswordHandler: Failed to hash new password for email %s: %v", req.Email, err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to hash new password",
		})
	}

	// Update password in database
	update := fiber.Map{
		"$set": fiber.Map{
			"password": string(hashedPassword),
			"updatedAt": time.Now(),
		},
	}

	result, err := configs.UsersColl.UpdateOne(ctx, fiber.Map{"email": req.Email}, update)
	if err != nil {
		log.Printf("ResetPasswordHandler: Failed to update password for email %s: %v", req.Email, err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update password",
		})
	}

	if result.MatchedCount == 0 {
		log.Printf("ResetPasswordHandler: No user matched for email %s", req.Email)
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "User not found",
		})
	}

	log.Printf("ResetPasswordHandler: Password reset successfully for email %s", req.Email)
	return c.JSON(fiber.Map{
		"message": "Password reset successfully",
	})
}