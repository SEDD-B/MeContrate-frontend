package models

type Offer struct {
	ID          int     `json:"id"`
	Description string  `json:"description"`
	Budget      float64 `json:"budget"`
	IsActive    bool    `json:"isActive"`
	CreatedAt   int64   `json:"createdAt"`
}
