package models

import "testing"

func TestIsEmailValid(t *testing.T) {
	tests := []struct {
		email    string
		expected bool
	}{
		{"john@example.com", true},
		{"invalid@", false},
		{"", false},
		{"user@domain.co.th", true},
	}

	for _, test := range tests {
		u := &User{Email: test.email}
		result := u.IsEmailValid()
		if result != test.expected {
			t.Errorf("IsEmailValid(%q) = %v; want %v", test.email, result, test.expected)
		}
	}
}

func TestSetAndCheckPassword(t *testing.T) {
	u := &User{}
	err := u.SetPassword("mysecret")
	if err != nil {
		t.Fatalf("SetPassword failed: %v", err)
	}

	if u.Password == "mysecret" {
		t.Errorf("Password should be hashed, but got raw password")
	}

	if !u.CheckPassword("mysecret") {
		t.Errorf("CheckPassword failed: expected true, got false")
	}

	if u.CheckPassword("wrongpass") {
		t.Errorf("CheckPassword should fail on wrong password")
	}
}
