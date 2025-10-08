package database

import (
	"database/sql"
	"fmt"
	"os"

	_ "github.com/lib/pq" //Esse GitHub contém o driver do PostgreSQL
)

//nil é o zero value do Go, ou seja, é o valor padrão de um ponteiro que não aponta para lugar nenhum.

func NewConnection() (*sql.DB, error) {
	message := "não foi possivel conectar ao banco de dados"

	connectionWithDB := os.Getenv("DATABASE_URL")
	if connectionWithDB == "" {
		return nil, fmt.Errorf("DATABASE_URL não está definida no ambiente")
	}
	db, err := sql.Open("postgres", connectionWithDB)

	if err != nil {
		return nil, fmt.Errorf("%s %v", message, err)

	}

	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("%s mesmo utilizando o ping %v", message, err)
	}
	return db, nil
}
