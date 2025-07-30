package controllers

import (
    "context"
    "log"
    "time"
    "backend/configs"
    "backend/models"
    "github.com/gofiber/fiber/v2"
    "go.mongodb.org/mongo-driver/bson"
    "go.mongodb.org/mongo-driver/bson/primitive"
    "github.com/golang-jwt/jwt/v5" // ใช้ jwt/v5 แทน jwt-go
)

type ServiceStepRequest struct {
    Categories string   `json:"categories"`
    Title      string   `json:"title"`
    Subtitles  []string `json:"subtitles"`
    Headings   []string `json:"headings"`
}

func AddServiceStepHandler(c *fiber.Ctx) error {
    // Get user email from JWT token
    claims, ok := c.Locals("user").(jwt.MapClaims)
    if !ok {
        log.Printf("AddServiceStepHandler: ไม่สามารถดึงข้อมูลผู้ใช้จาก token ได้")
        return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
            "error": "token ไม่ถูกต้อง",
        })
    }
    userEmail, ok := claims["email"].(string)
    if !ok {
        log.Printf("AddServiceStepHandler: ไม่พบอีเมลใน token")
        return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
            "error": "token ไม่ถูกต้อง",
        })
    }

    categoryName := c.Params("category") // ใช้โดยตรง ไม่แปลง case
    if categoryName == "" {
        log.Printf("AddServiceStepHandler: ต้องระบุหมวดหมู่")
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
            "error": "ต้องระบุหมวดหมู่",
        })
    }

    log.Printf("AddServiceStepHandler: ผู้ใช้ %s ร้องขอเพิ่มขั้นตอนบริการในหมวดหมู่ %s", userEmail, categoryName)

    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()

    var req ServiceStepRequest
    if err := c.BodyParser(&req); err != nil {
        log.Printf("AddServiceStepHandler: ไม่สามารถ解析ข้อมูลคำขอได้: %v", err)
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
            "error": "ข้อมูลคำขอไม่ถูกต้อง",
        })
    }

    if req.Categories == "" {
        log.Printf("AddServiceStepHandler: ไม่ระบุฟิลด์หมวดหมู่")
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
            "error": "ต้องระบุฟิลด์หมวดหมู่",
        })
    }
    if req.Title == "" {
        log.Printf("AddServiceStepHandler: ไม่ระบุชื่อขั้นตอนบริการ")
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
            "error": "ต้องระบุชื่อขั้นตอนบริการ",
        })
    }
    if len(req.Subtitles) == 0 && len(req.Headings) == 0 {
        log.Printf("AddServiceStepHandler: ไม่มี subtitle หรือ heading")
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
            "error": "ต้องมี subtitle หรือ heading อย่างน้อยหนึ่งรายการ",
        })
    }

    categoryObjID, err := primitive.ObjectIDFromHex(req.Categories)
    if err != nil {
        log.Printf("AddServiceStepHandler: ID หมวดหมู่ %s ไม่ถูกต้อง: %v", req.Categories, err)
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
            "error": "ID หมวดหมู่ไม่ถูกต้อง",
        })
    }

    var category models.Category
    err = configs.CategoriesColl.FindOne(ctx, bson.M{"_id": categoryObjID}).Decode(&category)
    if err != nil {
        log.Printf("AddServiceStepHandler: ไม่พบหมวดหมู่ ID %s: %v", categoryObjID, err)
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
            "error": "ไม่พบหมวดหมู่",
        })
    }

    if category.NameCategory != categoryName {
        log.Printf("AddServiceStepHandler: ID หมวดหมู่ %s ไม่ตรงกับชื่อ %s", categoryObjID, categoryName)
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
            "error": "ID หมวดหมู่ไม่ตรงกับชื่อใน URL",
        })
    }

    // Filter out empty subtitles and headings
    filteredSubtitles := []string{}
    for _, subtitle := range req.Subtitles {
        if subtitle != "" {
            filteredSubtitles = append(filteredSubtitles, subtitle)
        }
    }
    filteredHeadings := []string{}
    for _, heading := range req.Headings {
        if heading != "" {
            filteredHeadings = append(filteredHeadings, heading)
        }
    }

    serviceStep := models.ServiceStep{
        CategoryID: categoryObjID,
        Title:      req.Title,
        Subtitles:  filteredSubtitles,
        Headings:   filteredHeadings,
        CreatedAt:  time.Now(),
    }

    result, err := configs.ServiceStepsColl.InsertOne(ctx, serviceStep)
    if err != nil {
        log.Printf("AddServiceStepHandler: ไม่สามารถเพิ่มขั้นตอนบริการได้: %v", err)
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
            "error": "ไม่สามารถเพิ่มขั้นตอนบริการ",
        })
    }

    serviceStep.ID = result.InsertedID.(primitive.ObjectID)
    log.Printf("AddServiceStepHandler: เพิ่มขั้นตอนบริการ %s สำเร็จโดยผู้ใช้ %s ในหมวดหมู่ %s", serviceStep.ID.Hex(), userEmail, categoryName)
    return c.JSON(fiber.Map{
        "message": "เพิ่มขั้นตอนบริการสำเร็จ",
        "data":    serviceStep,
    })
}

func UpdateServiceStepsHandler(c *fiber.Ctx) error {
    // Get user email from JWT token
    claims, ok := c.Locals("user").(jwt.MapClaims)
    if !ok {
        log.Printf("UpdateServiceStepsHandler: ไม่สามารถดึงข้อมูลผู้ใช้จาก token ได้")
        return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
            "error": "token ไม่ถูกต้อง",
        })
    }
    userEmail, ok := claims["email"].(string)
    if !ok {
        log.Printf("UpdateServiceStepsHandler: ไม่พบอีเมลใน token")
        return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
            "error": "token ไม่ถูกต้อง",
        })
    }

    stepID := c.Params("stepId")
    if stepID == "" {
        log.Printf("UpdateServiceStepsHandler: ต้องระบุ ID ขั้นตอน")
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
            "error": "ต้องระบุ ID ขั้นตอน",
        })
    }

    categoryName := c.Params("category") // ใช้โดยตรง ไม่แปลง case
    if categoryName == "" {
        log.Printf("UpdateServiceStepsHandler: ต้องระบุหมวดหมู่")
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
            "error": "ต้องระบุหมวดหมู่",
        })
    }

    log.Printf("UpdateServiceStepsHandler: ผู้ใช้ %s ร้องขออัปเดตขั้นตอนบริการ ID %s ในหมวดหมู่ %s", userEmail, stepID, categoryName)

    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()

    var req ServiceStepRequest
    if err := c.BodyParser(&req); err != nil {
        log.Printf("UpdateServiceStepsHandler: ไม่สามารถ解析ข้อมูลคำขอได้: %v", err)
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
            "error": "ข้อมูลคำขอไม่ถูกต้อง",
        })
    }

    if req.Categories == "" {
        log.Printf("UpdateServiceStepsHandler: ไม่ระบุฟิลด์หมวดหมู่")
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
            "error": "ต้องระบุฟิลด์หมวดหมู่",
        })
    }
    if req.Title == "" {
        log.Printf("UpdateServiceStepsHandler: ไม่ระบุชื่อขั้นตอนบริการ")
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
            "error": "ต้องระบุชื่อขั้นตอนบริการ",
        })
    }
    if len(req.Subtitles) == 0 && len(req.Headings) == 0 {
        log.Printf("UpdateServiceStepsHandler: ไม่มี subtitle หรือ heading")
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
            "error": "ต้องมี subtitle หรือ heading อย่างน้อยหนึ่งรายการ",
        })
    }

    categoryObjID, err := primitive.ObjectIDFromHex(req.Categories)
    if err != nil {
        log.Printf("UpdateServiceStepsHandler: ID หมวดหมู่ %s ไม่ถูกต้อง: %v", req.Categories, err)
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
            "error": "ID หมวดหมู่ไม่ถูกต้อง",
        })
    }

    var category models.Category
    err = configs.CategoriesColl.FindOne(ctx, bson.M{"_id": categoryObjID}).Decode(&category)
    if err != nil {
        log.Printf("UpdateServiceStepsHandler: ไม่พบหมวดหมู่ ID %s: %v", categoryObjID, err)
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
            "error": "ไม่พบหมวดหมู่",
        })
    }

    if category.NameCategory != categoryName {
        log.Printf("UpdateServiceStepsHandler: ID หมวดหมู่ %s ไม่ตรงกับชื่อ %s", categoryObjID, categoryName)
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
            "error": "ID หมวดหมู่ไม่ตรงกับชื่อใน URL",
        })
    }

    stepObjID, err := primitive.ObjectIDFromHex(stepID)
    if err != nil {
        log.Printf("UpdateServiceStepsHandler: ID ขั้นตอน %s ไม่ถูกต้อง: %v", stepID, err)
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
            "error": "ID ขั้นตอนไม่ถูกต้อง",
        })
    }

    var existingStep models.ServiceStep
    err = configs.ServiceStepsColl.FindOne(ctx, bson.M{"_id": stepObjID, "category_id": categoryObjID}).Decode(&existingStep)
    if err != nil {
        log.Printf("UpdateServiceStepsHandler: ไม่พบขั้นตอนบริการ ID %s ในหมวดหมู่ %s: %v", stepID, categoryName, err)
        return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
            "error": "ไม่พบขั้นตอนบริการ",
        })
    }

    // Filter out empty subtitles and headings
    filteredSubtitles := []string{}
    for _, subtitle := range req.Subtitles {
        if subtitle != "" {
            filteredSubtitles = append(filteredSubtitles, subtitle)
        }
    }
    filteredHeadings := []string{}
    for _, heading := range req.Headings {
        if heading != "" {
            filteredHeadings = append(filteredHeadings, heading)
        }
    }

    update := bson.M{
        "$set": bson.M{
            "title":       req.Title,
            "subtitles":   filteredSubtitles,
            "headings":    filteredHeadings,
            "category_id": categoryObjID,
            "updatedAt":   time.Now(),
        },
    }

    result, err := configs.ServiceStepsColl.UpdateOne(ctx, bson.M{"_id": stepObjID}, update)
    if err != nil {
        log.Printf("UpdateServiceStepsHandler: ไม่สามารถอัปเดตขั้นตอนบริการ ID %s: %v", stepID, err)
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
            "error": "ไม่สามารถอัปเดตขั้นตอนบริการ",
        })
    }

    if result.MatchedCount == 0 {
        log.Printf("UpdateServiceStepsHandler: ไม่พบขั้นตอนบริการที่ตรงกับ ID %s", stepID)
        return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
            "error": "ไม่พบขั้นตอนบริการ",
        })
    }

    var updatedStep models.ServiceStep
    err = configs.ServiceStepsColl.FindOne(ctx, bson.M{"_id": stepObjID}).Decode(&updatedStep)
    if err != nil {
        log.Printf("UpdateServiceStepsHandler: ไม่สามารถดึงขั้นตอนบริการที่อัปเดต ID %s: %v", stepID, err)
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
            "error": "ไม่สามารถดึงขั้นตอนบริการที่อัปเดต",
        })
    }

    log.Printf("UpdateServiceStepsHandler: อัปเดตขั้นตอนบริการ %s สำเร็จโดยผู้ใช้ %s", stepID, userEmail)
    return c.JSON(fiber.Map{
        "message": "อัปเดตขั้นตอนบริการสำเร็จ",
        "data":    updatedStep,
    })
}

func DeleteServiceStepHandler(c *fiber.Ctx) error {
    // Get user email from JWT token
    claims, ok := c.Locals("user").(jwt.MapClaims)
    if !ok {
        log.Printf("DeleteServiceStepHandler: ไม่สามารถดึงข้อมูลผู้ใช้จาก token ได้")
        return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
            "error": "token ไม่ถูกต้อง",
        })
    }
    userEmail, ok := claims["email"].(string)
    if !ok {
        log.Printf("DeleteServiceStepHandler: ไม่พบอีเมลใน token")
        return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
            "error": "token ไม่ถูกต้อง",
        })
    }

    stepID := c.Params("stepId")
    if stepID == "" {
        log.Printf("DeleteServiceStepHandler: ต้องระบุ ID ขั้นตอน")
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
            "error": "ต้องระบุ ID ขั้นตอน",
        })
    }

    categoryName := c.Params("category") // ใช้โดยตรง ไม่แปลง case
    if categoryName == "" {
        log.Printf("DeleteServiceStepHandler: ต้องระบุหมวดหมู่")
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
            "error": "ต้องระบุหมวดหมู่",
        })
    }

    log.Printf("DeleteServiceStepHandler: ผู้ใช้ %s ร้องขอลบขั้นตอนบริการ ID %s ในหมวดหมู่ %s", userEmail, stepID, categoryName)

    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()

    var category models.Category
    err := configs.CategoriesColl.FindOne(ctx, bson.M{"nameCategory": categoryName}).Decode(&category)
    if err != nil {
        log.Printf("DeleteServiceStepHandler: ไม่พบหมวดหมู่ %s: %v", categoryName, err)
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
            "error": "ไม่พบหมวดหมู่",
        })
    }

    stepObjID, err := primitive.ObjectIDFromHex(stepID)
    if err != nil {
        log.Printf("DeleteServiceStepHandler: ID ขั้นตอน %s ไม่ถูกต้อง: %v", stepID, err)
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
            "error": "ID ขั้นตอนไม่ถูกต้อง",
        })
    }

    result, err := configs.ServiceStepsColl.DeleteOne(ctx, bson.M{"_id": stepObjID, "category_id": category.ID})
    if err != nil {
        log.Printf("DeleteServiceStepHandler: ไม่สามารถลบขั้นตอนบริการ ID %s: %v", stepID, err)
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
            "error": "ไม่สามารถลบขั้นตอนบริการ",
        })
    }

    if result.DeletedCount == 0 {
        log.Printf("DeleteServiceStepHandler: ไม่พบขั้นตอนบริการที่ตรงกับ ID %s ในหมวดหมู่ %s", stepID, categoryName)
        return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
            "error": "ไม่พบขั้นตอนบริการ",
        })
    }

    log.Printf("DeleteServiceStepHandler: ลบขั้นตอนบริการ %s สำเร็จโดยผู้ใช้ %s", stepID, userEmail)
    return c.JSON(fiber.Map{
        "message": "ลบขั้นตอนบริการสำเร็จ",
    })
}

func GetAllServiceStepsHandler(c *fiber.Ctx) error {
    categoryName := c.Params("category") // ใช้โดยตรง ไม่แปลง case
    if categoryName == "" {
        log.Printf("GetAllServiceStepsHandler: ต้องระบุหมวดหมู่")
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
            "error": "ต้องระบุหมวดหมู่",
        })
    }

    log.Printf("GetAllServiceStepsHandler: กำลังดึงข้อมูลขั้นตอนบริการในหมวดหมู่ %s", categoryName)

    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()

    var category models.Category
    err := configs.CategoriesColl.FindOne(ctx, bson.M{"nameCategory": categoryName}).Decode(&category)
    if err != nil {
        log.Printf("GetAllServiceStepsHandler: ไม่พบหมวดหมู่ %s: %v", categoryName, err)
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
            "error": "ไม่พบหมวดหมู่",
        })
    }

    cursor, err := configs.ServiceStepsColl.Find(ctx, bson.M{"category_id": category.ID})
    if err != nil {
        log.Printf("GetAllServiceStepsHandler: ไม่สามารถดึงข้อมูลขั้นตอนบริการสำหรับหมวดหมู่ %s: %v", categoryName, err)
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
            "error": "ไม่สามารถดึงข้อมูลขั้นตอนบริการ",
        })
    }
    defer cursor.Close(ctx)

    var serviceSteps []models.ServiceStep
    if err := cursor.All(ctx, &serviceSteps); err != nil {
        log.Printf("GetAllServiceStepsHandler: ไม่สามารถประมวลผลขั้นตอนบริการสำหรับหมวดหมู่ %s: %v", categoryName, err)
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
            "error": "ไม่สามารถประมวลผลขั้นตอนบริการ",
        })
    }

    log.Printf("GetAllServiceStepsHandler: ดึงข้อมูล %d ขั้นตอนบริการสำหรับหมวดหมู่ %s สำเร็จ", len(serviceSteps), categoryName)
    return c.JSON(fiber.Map{
        "message": "ดึงข้อมูลขั้นตอนบริการสำเร็จ",
        "data":    serviceSteps,
    })
}

func GetServiceStepHandler(c *fiber.Ctx) error {
    stepID := c.Params("stepId")
    if stepID == "" {
        log.Printf("GetServiceStepHandler: ต้องระบุ ID ขั้นตอน")
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
            "error": "ต้องระบุ ID ขั้นตอน",
        })
    }

    categoryName := c.Params("category") // ใช้โดยตรง ไม่แปลง case
    if categoryName == "" {
        log.Printf("GetServiceStepHandler: ต้องระบุหมวดหมู่")
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
            "error": "ต้องระบุหมวดหมู่",
        })
    }

    log.Printf("GetServiceStepHandler: ร้องขอดึงขั้นตอนบริการ ID %s ในหมวดหมู่ %s", stepID, categoryName)

    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()

    var category models.Category
    err := configs.CategoriesColl.FindOne(ctx, bson.M{"nameCategory": categoryName}).Decode(&category)
    if err != nil {
        log.Printf("GetServiceStepHandler: ไม่พบหมวดหมู่ %s: %v", categoryName, err)
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
            "error": "ไม่พบหมวดหมู่",
        })
    }

    stepObjID, err := primitive.ObjectIDFromHex(stepID)
    if err != nil {
        log.Printf("GetServiceStepHandler: ID ขั้นตอน %s ไม่ถูกต้อง: %v", stepID, err)
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
            "error": "ID ขั้นตอนไม่ถูกต้อง",
        })
    }

    var serviceStep models.ServiceStep
    err = configs.ServiceStepsColl.FindOne(ctx, bson.M{"_id": stepObjID, "category_id": category.ID}).Decode(&serviceStep)
    if err != nil {
        log.Printf("GetServiceStepHandler: ไม่พบขั้นตอนบริการ ID %s ในหมวดหมู่ %s: %v", stepID, categoryName, err)
        return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
            "error": "ไม่พบขั้นตอนบริการ",
        })
    }

    log.Printf("GetServiceStepHandler: ดึงขั้นตอนบริการ %s สำเร็จ", stepID)
    return c.JSON(fiber.Map{
        "message": "ดึงขั้นตอนบริการสำเร็จ",
        "data":    serviceStep,
    })
}