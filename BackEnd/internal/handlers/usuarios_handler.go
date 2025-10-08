package handlers

import (
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"strconv" // Pacote para converter strings para inteiros (necessário para o ID)

	"github.com/gorilla/mux"

	"MeContrate/BackEnd/internal/models"
)

func SetupUserRoutes(router *mux.Router, db *sql.DB) {
	userRouter := router.PathPrefix("/api/usuarios").Subrouter()
	userRouter.HandleFunc("/", GetUsers(db)).Methods("GET")
	userRouter.HandleFunc("/", CreateUser(db)).Methods("POST")
	userRouter.HandleFunc("/{id}", DeleteUser(db)).Methods("DELETE")
}

func VerifyUserExists(db *sql.DB, username, email, cpf string) (bool, error) {
	var exists bool
	query := "SELECT EXISTS(SELECT 1 FROM users WHERE username=$1 OR email=$2 OR cpf=$3)"

	err := db.QueryRow(query, username, email, cpf).Scan(&exists)
	if err != nil && !errors.Is(err, sql.ErrNoRows) {
		return false, fmt.Errorf("erro ao verificar usuário existente: %w", err)
	}
	return exists, nil
}

func GetUsers(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		rows, err := db.Query("SELECT id, username, email, cpf, birthday, created_at FROM users")
		if err != nil {

			http.Error(w, fmt.Sprintf("Erro ao buscar usuários: %v", err), http.StatusInternalServerError)
			return
		}
		defer func(rows *sql.Rows) {
			err := rows.Close()
			if err != nil {
				fmt.Printf("ERRO: Falha ao fechar rows: %v", err)
			}
		}(rows)
		var users []models.User
		// Itera sobre o resultado da query
		for rows.Next() {
			var user models.User

			if err := rows.Scan(&user.ID, &user.Username, &user.Email, &user.Cpf, &user.Birthday, &user.CreatedAt); err != nil {
				http.Error(w, fmt.Sprintf("Erro ao mapear dados: %v", err), http.StatusInternalServerError)
				return
			}
			users = append(users, user)
		}

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(users); err != nil {
			// A resposta já foi iniciada, só podemos registrar o erro no log
			fmt.Printf("ERRO: Falha ao codificar resposta JSON: %v", err)
		}
	}
}

func CreateUser(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var user models.User
		if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
			// Erro na decodificação JSON (JSON inválido), retorna Status 400
			http.Error(w, "Requisição inválida: JSON malformado", http.StatusBadRequest)
			return
		}

		if exists, err := VerifyUserExists(db, user.Username, user.Email, user.Cpf); err != nil {
			http.Error(w, fmt.Sprintf("Erro interno na validação: %v", err), http.StatusInternalServerError)
			return
		} else if exists {

			http.Error(w, "Usuário já existe", http.StatusBadRequest)
			return
		}

		// Executa a query de INSERT, usando RETURNING * para obter o registro criado
		var createdUser models.User
		query := "INSERT INTO users (username, password, cpf, birthday, email) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, email, cpf, birthday, created_at"

		err := db.QueryRow(
			query,
			user.Username, user.Password, user.Cpf, user.Birthday, user.Email,
		).Scan(&createdUser.ID, &createdUser.Username, &createdUser.Email, &createdUser.Cpf, &createdUser.Birthday, &createdUser.CreatedAt)

		if err != nil {

			http.Error(w, fmt.Sprintf("Erro ao inserir usuário: %v", err), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		if err := json.NewEncoder(w).Encode(createdUser); err != nil {
			fmt.Printf("ERRO: Falha ao codificar resposta JSON: %v", err)
		}
	}
}

func DeleteUser(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Pega a variável `id` da URL (equivalente ao req.params.id do JS)
		vars := mux.Vars(r)
		idStr := vars["id"]

		// Converte a string do ID para inteiro
		id, err := strconv.Atoi(idStr)
		if err != nil {
			http.Error(w, "ID inválido", http.StatusBadRequest)
			return
		}

		var deletedUser models.User
		// Executa a query de DELETE, usando RETURNING para obter o registro deletado
		query := "DELETE FROM users WHERE id = $1 RETURNING id, username, email, cpf, birthday, created_at"

		err = db.QueryRow(query, id).
			Scan(&deletedUser.ID, &deletedUser.Username, &deletedUser.Email, &deletedUser.Cpf, &deletedUser.Birthday, &deletedUser.CreatedAt)

		if err != nil {
			// Verifica se o erro é que nenhuma linha foi encontrada
			if errors.Is(err, sql.ErrNoRows) {
				// Usuário não encontrado, retorna Status 404
				http.Error(w, "Usuário não encontrado", http.StatusNotFound)
				return
			}
			// Outro erro de banco de dados, retorna Status 500
			http.Error(w, fmt.Sprintf("Erro ao deletar usuário: %v", err), http.StatusInternalServerError)
			return
		}

		// Envia a resposta de sucesso com Status 200 OK (o JS usava 201, mas 200 ou 204 são mais comuns para DELETE)
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK) // Mantive 200 OK, mas 204 No Content é muitas vezes mais idiomático
		if err := json.NewEncoder(w).Encode(deletedUser); err != nil {

			fmt.Printf("ERRO: Falha ao codificar resposta JSON em DeleteUser: %v\n", err)
		}
	}
}
