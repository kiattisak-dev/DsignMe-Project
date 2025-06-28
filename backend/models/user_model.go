package models

import (
	"regexp"

	"golang.org/x/crypto/bcrypt"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID       primitive.ObjectID `bson:"_id,omitempty"`
	Email    string             `bson:"email"`
	Password string             `bson:"password"`
}

func (u *User) IsEmailValid() bool {
	re := regexp.MustCompile(`^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$`)
	return re.MatchString(u.Email)
}

func (u *User) SetPassword(raw string) error {
	hashed, err := bcrypt.GenerateFromPassword([]byte(raw), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	u.Password = string(hashed)
	return nil
}

func (u *User) CheckPassword(raw string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(raw))
	return err == nil
}
