package models

import "time"

type User struct {
	ID        int       `json:"id"`
	Username  string    `json:"username"`
	Password  string    `json:"-"`
	Email     string    `json:"email" `
	Cpf       string    `json:"cpf"`
	Birthday  time.Time `json:"birthday"`
	CreatedAt time.Time `json:"created_at"`
}
