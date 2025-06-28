
package controllers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gofiber/fiber/v2"
	"github.com/stretchr/testify/assert"
)

func TestAddCategoryHandler_InvalidRequest(t *testing.T) {
	app := fiber.New()
	app.Post("/categories", AddCategoryHandler)

	// Invalid body (not JSON)
	req := httptest.NewRequest(http.MethodPost, "/categories", bytes.NewBuffer([]byte("invalid json")))
	req.Header.Set("Content-Type", "application/json")
	resp, _ := app.Test(req)

	assert.Equal(t, fiber.StatusBadRequest, resp.StatusCode)
}

func TestAddCategoryHandler_EmptyName(t *testing.T) {
	app := fiber.New()
	app.Post("/categories", AddCategoryHandler)

	// Empty nameCategory field
	body := map[string]string{"nameCategory": ""}
	b, _ := json.Marshal(body)

	req := httptest.NewRequest(http.MethodPost, "/categories", bytes.NewBuffer(b))
	req.Header.Set("Content-Type", "application/json")
	resp, _ := app.Test(req)

	assert.Equal(t, fiber.StatusBadRequest, resp.StatusCode)
}
