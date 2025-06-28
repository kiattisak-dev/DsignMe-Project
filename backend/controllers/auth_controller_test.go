package controllers

import (
	"backend/configs"
	"backend/models"
	"context"
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

	var req CreateUserRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	if req.Email == "" || req.Password == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Email and password are required",
		})
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var existingUser models.User
	err := configs.UsersColl.FindOne(ctx, fiber.Map{"email": req.Email}).Decode(&existingUser)
	if err == nil {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{
			"error": "User with this email already exists",
		})
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
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
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to create user",
		})
	}

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

	var req LoginRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var user models.User
	err := configs.UsersColl.FindOne(ctx, fiber.Map{"email": req.Email}).Decode(&user)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid email or password",
		})
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password))
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid email or password",
		})
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"email": user.Email,
		"exp":   time.Now().Add(time.Hour * 24).Unix(),
	})

	tokenString, err := token.SignedString([]byte(configs.EnvSecret()))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to generate token",
		})
	}

	return c.JSON(fiber.Map{
		"token": tokenString,
	})
}

func ResetPasswordHandler(c *fiber.Ctx) error {
	type ResetPasswordRequest struct {
		Email       string `json:"email"`
		NewPassword string `json:"newPassword"`
	}

	var req ResetPasswordRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	if req.Email == "" || req.NewPassword == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Email and new password are required",
		})
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var user models.User
	err := configs.UsersColl.FindOne(ctx, fiber.Map{"email": req.Email}).Decode(&user)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "User not found",
		})
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to hash new password",
		})
	}

	update := fiber.Map{
		"$set": fiber.Map{
			"password":  string(hashedPassword),
			"updatedAt": time.Now(),
		},
	}

	result, err := configs.UsersColl.UpdateOne(ctx, fiber.Map{"email": req.Email}, update)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update password",
		})
	}

	if result.MatchedCount == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "User not found",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Password reset successfully",
	})
}
