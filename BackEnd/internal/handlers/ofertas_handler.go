package handlers

import (
	"database/sql"
	"encoding/json"
	"errors"
	"log" // Importado para logar erros no servidor
	"net/http"
	"strconv" // Para converter o ID da URL de string para int

	"github.com/gorilla/mux"

	"MeContrate/BackEnd/internal/models" // Importa o modelo de Oferta
)

// SetupOfferRoutes registra todas as rotas de ofertas no roteador principal.
func SetupOfferRoutes(router *mux.Router, db *sql.DB) {
	// Cria um sub-roteador para o prefixo /api/ofertas, conforme configurado no main.go
	offerRouter := router.PathPrefix("/api/ofertas").Subrouter()

	offerRouter.HandleFunc("/", GetOffers(db)).Methods("GET")
	offerRouter.HandleFunc("/", CreateOffer(db)).Methods("POST")
	offerRouter.HandleFunc("/{id}", UpdateOffer(db)).Methods("PUT")
	offerRouter.HandleFunc("/{id}", DeleteOffer(db)).Methods("DELETE")
}

// GetOffers lida com a requisição GET /api/ofertas para buscar todas as propostas.
func GetOffers(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Executa a query para buscar todas as propostas da tabela 'contracts'
		rows, err := db.Query("SELECT id, description, budget, isActive, date FROM contracts")
		if err != nil {
			log.Printf("ERRO [DB]: Falha na query GetOffers: %v", err)
			http.Error(w, "Erro ao buscar propostas", http.StatusInternalServerError)
			return
		}
		defer func(rows *sql.Rows) {
			err := rows.Close()
			if err != nil {
				log.Printf("ERRO [DB]: Falha ao fechar rows: %v", err)
			}
		}(rows) // Garante o fechamento das linhas

		var offers []models.Offer

		// Itera sobre as linhas do resultado
		for rows.Next() {
			var offer models.Offer
			// Escaneia os valores do DB para a struct Offer
			if err := rows.Scan(&offer.ID, &offer.Description, &offer.Budget, &offer.IsActive, &offer.CreatedAt); err != nil {
				log.Printf("ERRO [Mapeamento]: Falha ao escanear linha de oferta: %v", err)
				http.Error(w, "Erro interno ao processar dados", http.StatusInternalServerError)
				return
			}
			offers = append(offers, offer)
		}

		// Verifica se não foi encontrada nenhuma linha (lógica do JS: result.rows.length === 0)
		if len(offers) == 0 {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusNotFound) // Status 404
			// Usa o Map para criar o JSON de resposta de erro
			json.NewEncoder(w).Encode(map[string]string{"message": "Nenhuma proposta encontrada"})
			return
		}

		// Envia a resposta de sucesso
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		if err := json.NewEncoder(w).Encode(offers); err != nil {
			log.Printf("ERRO [Encode]: Falha ao codificar resposta GetOffers: %v", err)
		}
	}
}

// CreateOffer lida com a requisição POST /api/ofertas para criar uma nova proposta.
func CreateOffer(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var input struct {
			Description string  `json:"description"`
			Budget      float64 `json:"budget"`
		}

		// Decodifica o JSON de entrada para a struct auxiliar
		if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
			http.Error(w, "Requisição inválida: JSON malformado", http.StatusBadRequest)
			return
		}

		var newOffer models.Offer
		// Executa o INSERT. Assumimos que 'sales' na query JS é na verdade 'contracts' ou 'ofertas'.
		// Usamos 'date' (CreatedAt) para a data e a função NOW() do PostgreSQL.
		query := "INSERT INTO contracts (date, description, budget, isActive) VALUES (NOW(), $1, $2, TRUE) RETURNING id, date, description, budget, isActive"

		// QueryRow para comandos que retornam uma única linha
		err := db.QueryRow(
			query,
			input.Description, input.Budget,
		).Scan(&newOffer.ID, &newOffer.CreatedAt, &newOffer.Description, &newOffer.Budget, &newOffer.IsActive)

		if err != nil {
			log.Printf("ERRO [DB]: Falha ao inserir proposta: %v", err)
			http.Error(w, "Erro ao inserir proposta", http.StatusInternalServerError)
			return
		}

		// Envia a resposta de sucesso com Status 201 Created
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		if err := json.NewEncoder(w).Encode(newOffer); err != nil {
			log.Printf("ERRO [Encode]: Falha ao codificar resposta CreateOffer: %v", err)
		}
	}
}

// UpdateOffer lida com a requisição PUT /api/ofertas/{id} para atualizar uma proposta.
func UpdateOffer(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		idStr := vars["id"]

		// Converte o ID da URL para inteiro
		id, err := strconv.Atoi(idStr)
		if err != nil {
			http.Error(w, "ID inválido", http.StatusBadRequest)
			return
		}

		var input models.Offer
		// Decodifica o corpo da requisição, esperando description e isActive
		if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
			http.Error(w, "Requisição inválida: JSON malformado", http.StatusBadRequest)
			return
		}

		var updatedOffer models.Offer
		query := `
			UPDATE contracts
			SET description = $1, isActive = $2
			WHERE id = $3
			RETURNING id, description, budget, isActive, date`

		// Executa a atualização
		err = db.QueryRow(
			query,
			input.Description, input.IsActive, id,
		).Scan(&updatedOffer.ID, &updatedOffer.Description, &updatedOffer.Budget, &updatedOffer.IsActive, &updatedOffer.CreatedAt)

		if err != nil {
			if errors.Is(err, sql.ErrNoRows) {
				// Proposta não encontrada, retorna 404
				http.Error(w, "Proposta não encontrada", http.StatusNotFound)
				return
			}
			log.Printf("ERRO [DB]: Falha ao atualizar proposta: %v", err)
			http.Error(w, "Erro ao atualizar proposta", http.StatusInternalServerError)
			return
		}

		// Envia a resposta de sucesso
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		if err := json.NewEncoder(w).Encode(updatedOffer); err != nil {
			log.Printf("ERRO [Encode]: Falha ao codificar resposta UpdateOffer: %v", err)
		}
	}
}

// DeleteOffer lida com a requisição DELETE /api/ofertas/{id} para excluir uma proposta.
func DeleteOffer(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		idStr := vars["id"]

		id, err := strconv.Atoi(idStr)
		if err != nil {
			http.Error(w, "ID inválido", http.StatusBadRequest)
			return
		}

		var deletedID int
		// Executa o DELETE e tenta escanear o ID retornado
		err = db.QueryRow("DELETE FROM contracts WHERE id = $1 RETURNING id", id).Scan(&deletedID)

		if err != nil {
			if errors.Is(err, sql.ErrNoRows) {
				// Proposta não encontrada, retorna 404
				http.Error(w, "Proposta não encontrada", http.StatusNotFound)
				return
			}
			log.Printf("ERRO [DB]: Falha ao deletar proposta: %v", err)
			http.Error(w, "Erro ao deletar proposta", http.StatusInternalServerError)
			return
		}

		// Envia a resposta de sucesso
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		if err := json.NewEncoder(w).Encode(map[string]string{"message": "Proposta excluída com sucesso"}); err != nil {
			log.Printf("ERRO [Encode]: Falha ao codificar resposta DeleteOffer: %v", err)
		}
	}
}
