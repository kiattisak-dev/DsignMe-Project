package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
	"time"
)

// Valid project categories
const (
	CategoryLogo          = "Logo"
	CategoryAdvertisement = "Advertisement"
	CategoryProduct       = "Product"
	CategoryVisualMotion  = "VisualMotion"
)

type Category struct {
	ID           primitive.ObjectID `bson:"_id,omitempty"`
	NameCategory string             `bson:"nameCategory"`
}

type ServiceStep struct {
	ID         primitive.ObjectID `bson:"_id,omitempty" json:"_id,omitempty"`
	CategoryID primitive.ObjectID `bson:"category_id" json:"category_id"`
	Title      string             `bson:"title" json:"title"`
	Subtitles  []string           `bson:"subtitles" json:"subtitles"`
	CreatedAt  time.Time          `bson:"createdAt" json:"createdAt"`
	UpdatedAt  time.Time          `bson:"updatedAt,omitempty" json:"updatedAt,omitempty"`
}
type Project struct {
	ID         primitive.ObjectID `bson:"_id,omitempty"`
	ImageUrl   string             `bson:"imageUrl,omitempty"`
	VideoUrl   string             `bson:"videoUrl,omitempty"`
	CategoryID primitive.ObjectID `bson:"category_id"`
	CreatedAt  time.Time          `bson:"createdAt"`
	UpdatedAt  time.Time          `bson:"updatedAt,omitempty"`
}
