package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
	"time"
)

type Category struct {
	ID           primitive.ObjectID `bson:"_id,omitempty"`
	NameCategory string             `bson:"nameCategory"`
}

type Subtitle struct {
	Text     string   `bson:"text" json:"text"`
	Headings []string `bson:"headings" json:"headings"`
}

type ServiceStep struct {
	ID         primitive.ObjectID `bson:"_id,omitempty" json:"_id,omitempty"`
	CategoryID primitive.ObjectID `bson:"category_id" json:"category_id"`
	Title      string             `bson:"title" json:"title"`
	Subtitles  []string           `bson:"subtitles" json:"subtitles"`
	Headings   []string           `bson:"headings" json:"headings"`
	CreatedAt  time.Time          `bson:"createdAt" json:"createdAt"`
	UpdatedAt  *time.Time         `bson:"updatedAt,omitempty" json:"updatedAt,omitempty"`
}

type Project struct {
	ID         primitive.ObjectID `bson:"_id,omitempty"`
	ImageUrl   string             `bson:"imageUrl,omitempty"`
	VideoUrl   string             `bson:"videoUrl,omitempty"`
	CategoryID primitive.ObjectID `bson:"category_id"`
	CreatedAt  time.Time          `bson:"createdAt"`
	UpdatedAt  time.Time          `bson:"updatedAt,omitempty"`
}
