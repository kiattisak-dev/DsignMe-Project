package configs

import (
	"context"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var (
	Client           *mongo.Client
	UsersColl        *mongo.Collection
	ProjectsColl     *mongo.Collection
	CategoriesColl   *mongo.Collection
	ServiceStepsColl *mongo.Collection
)

// InitDB initializes the MongoDB connection and sets up collections
func InitDB() {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Use environment variable for MongoDB URI
	clientOptions := options.Client().ApplyURI(EnvMongoURI())
	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		log.Fatal("Failed to connect to MongoDB:", err)
	}

	// Verify connection
	err = client.Ping(ctx, nil)
	if err != nil {
		log.Fatal("Failed to ping MongoDB:", err)
	}

	// Assign to global variables
	Client = client
	db := client.Database("admin_dashboard")
	UsersColl = db.Collection("users")
	ProjectsColl = db.Collection("projects")
	CategoriesColl = db.Collection("categories")
	ServiceStepsColl = db.Collection("serviceSteps")

	// Create indexes
	_, err = ProjectsColl.Indexes().CreateMany(ctx, []mongo.IndexModel{
		{Keys: bson.M{"category_id": 1}},
	})
	if err != nil {
		log.Fatal("Failed to create indexes for projects:", err)
	}

	_, err = ServiceStepsColl.Indexes().CreateMany(ctx, []mongo.IndexModel{
		{Keys: bson.M{"project_id": 1}},
		{Keys: bson.M{"category_id": 1}},
	})
	if err != nil {
		log.Fatal("Failed to create indexes for serviceSteps:", err)
	}

	_, err = CategoriesColl.Indexes().CreateMany(ctx, []mongo.IndexModel{
		{Keys: bson.M{"nameCategory": 1}, Options: options.Index().SetUnique(true)},
	})
	if err != nil {
		log.Fatal("Failed to create indexes for categories:", err)
	}

	log.Println("Successfully connected to MongoDB")
}

// DisconnectDB closes the MongoDB connection
func DisconnectDB() {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if Client == nil {
		return
	}

	if err := Client.Disconnect(ctx); err != nil {
		log.Println("Error disconnecting from MongoDB:", err)
	}
	log.Println("Disconnected from MongoDB")
}
