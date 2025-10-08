package handlers

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5" // Para geração e validação de JWTs
	"github.com/gorilla/mux"
	"golang.org/x/crypto/bcrypt" // Para hashing de senha

	"MeContrate/BackEnd/internal/models"
)

// Constante JWT_SECRET lida das variáveis de ambiente na inicialização
var jwtSecret = []byte(os.Getenv("JWT_KEY"))

// Definição da Claims (Payload do JWT)
// Deve ser uma struct Go que inclui a struct padrão jwt.RegisteredClaims
type AuthClaims struct {
	ID    int    `json:"id"`
	Email string `json:"email"`
	jwt.RegisteredClaims
}

// Structs auxiliares para payloads de requisição
type RegisterRequest struct {
	Fullname string `json:"fullname"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// Struct auxiliar para a resposta de login
type LoginResponse struct {
	Message string `json:"message"`
	Token   string `json:"token"`
}

// SetupAuthRoutes registra as rotas de autenticação no roteador principal.
func SetupAuthRoutes(router *mux.Router, db *sql.DB) {
	// Cria um sub-roteador para o prefixo /api/auth
	authRouter := router.PathPrefix("/api/auth").Subrouter()

	authRouter.HandleFunc("/register", RegisterUser(db)).Methods("POST")
	authRouter.HandleFunc("/login", LoginUser(db)).Methods("POST")

	// Rota Protegida: Usa o middleware AuthMiddleware
	authRouter.HandleFunc("/protected", AuthMiddleware(ProtectedHandler(), db)).Methods("GET")
}

// ---------------------------------------------------------------------------------------------------------------------

// RegisterUser lida com o registro de novos usuários (POST /api/auth/register).
func RegisterUser(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req RegisterRequest
		// 1. Decodificação do JSON e Validação de campos obrigatórios
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Requisição inválida.", http.StatusBadRequest)
			return
		}
		if req.Fullname == "" || req.Email == "" || req.Password == "" {
			http.Error(w, "Nome, email e senha são obrigatórios.", http.StatusBadRequest)
			return
		}

		// 2. Verifica se o email já existe
		var exists bool
		err := db.QueryRow("SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)", req.Email).Scan(&exists)
		if err != nil && !errors.Is(err, sql.ErrNoRows) {
			log.Printf("ERRO [DB]: Falha ao verificar email: %v", err)
			http.Error(w, "Erro interno do servidor.", http.StatusInternalServerError)
			return
		}
		if exists {
			http.Error(w, "Este email já está registrado.", http.StatusConflict) // Status 409
			return
		}

		// 3. Hash da senha (equivalente ao bcrypt.hash do JS)
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
		if err != nil {
			log.Printf("ERRO [Bcrypt]: Falha ao gerar hash: %v", err)
			http.Error(w, "Erro interno do servidor.", http.StatusInternalServerError)
			return
		}

		// 4. Inserção no banco de dados
		var newUser models.User
		// NOTE: Assumindo que a tabela 'users' tem 'fullname', 'email', 'password'
		query := "INSERT INTO users (fullname, email, password) VALUES ($1, $2, $3) RETURNING id, fullname, email"

		err = db.QueryRow(query, req.Fullname, req.Email, string(hashedPassword)).
			Scan(&newUser.ID, &newUser.Username, &newUser.Email) // Assumindo que 'fullname' mapeia para 'Username' na struct

		if err != nil {
			log.Printf("ERRO [DB]: Falha ao inserir usuário: %v", err)
			http.Error(w, "Erro interno do servidor.", http.StatusInternalServerError)
			return
		}

		// 5. Resposta de Sucesso
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		if err := json.NewEncoder(w).Encode(map[string]interface{}{"message": "Usuário registrado com sucesso.", "user": newUser}); err != nil {
			log.Printf("ERRO [Encode]: Falha ao codificar resposta: %v", err)
		}
	}
}

// ---------------------------------------------------------------------------------------------------------------------

// LoginUser lida com o login de usuários (POST /api/auth/login).
func LoginUser(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req LoginRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Requisição inválida.", http.StatusBadRequest)
			return
		}
		if req.Email == "" || req.Password == "" {
			http.Error(w, "Email e senha são obrigatórios.", http.StatusBadRequest)
			return
		}

		// 1. Busca o usuário pelo email
		var foundUser models.User
		var hashedPassword string // Variável para armazenar a senha hash do DB

		query := "SELECT id, email, password FROM users WHERE email = $1"
		err := db.QueryRow(query, req.Email).Scan(&foundUser.ID, &foundUser.Email, &hashedPassword)

		if err != nil {
			if errors.Is(err, sql.ErrNoRows) {
				http.Error(w, "Credenciais inválidas.", http.StatusUnauthorized) // 401
				return
			}
			log.Printf("ERRO [DB]: Falha ao buscar usuário: %v", err)
			http.Error(w, "Erro interno do servidor.", http.StatusInternalServerError)
			return
		}

		// 2. Compara a senha (equivalente ao bcrypt.compare do JS)
		if err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(req.Password)); err != nil {
			if errors.Is(err, bcrypt.ErrMismatchedHashAndPassword) {
				http.Error(w, "Credenciais inválidas.", http.StatusUnauthorized) // 401
				return
			}
			log.Printf("ERRO [Bcrypt]: Falha na comparação: %v", err)
			http.Error(w, "Erro interno do servidor.", http.StatusInternalServerError)
			return
		}

		// 3. Gera o Token JWT (equivalente ao jwt.sign do JS)
		expirationTime := time.Now().Add(1 * time.Hour) // 1h de expiração
		claims := &AuthClaims{
			ID:    foundUser.ID,
			Email: foundUser.Email,
			RegisteredClaims: jwt.RegisteredClaims{
				ExpiresAt: jwt.NewNumericDate(expirationTime),
			},
		}

		token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
		tokenString, err := token.SignedString(jwtSecret)

		if err != nil {
			log.Printf("ERRO [JWT]: Falha ao assinar o token: %v", err)
			http.Error(w, "Erro interno do servidor.", http.StatusInternalServerError)
			return
		}

		// 4. Resposta de Sucesso
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		if err := json.NewEncoder(w).Encode(LoginResponse{Message: "Login bem-sucedido!", Token: tokenString}); err != nil {
			log.Printf("ERRO [Encode]: Falha ao codificar resposta: %v", err)
		}
	}
}

// ---------------------------------------------------------------------------------------------------------------------

// AuthMiddleware é um middleware para verificar a autenticidade do token JWT.
func AuthMiddleware(next http.HandlerFunc, db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Pega o cabeçalho 'Authorization'
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "Token não fornecido.", http.StatusUnauthorized) // 401
			return
		}

		// Isola o token: Espera o formato "Bearer <token>"
		tokenString := ""
		if len(authHeader) > 7 && authHeader[:7] == "Bearer " {
			tokenString = authHeader[7:]
		}

		if tokenString == "" {
			http.Error(w, "Token não fornecido ou formato incorreto.", http.StatusUnauthorized) // 401
			return
		}

		// 1. Parse e Verificação do Token (equivalente ao jwt.verify do JS)
		claims := &AuthClaims{}
		token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
			// Verifica se o método de assinatura é o esperado (HS256)
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("método de assinatura inesperado: %v", token.Header["alg"])
			}
			return jwtSecret, nil
		})

		if err != nil || !token.Valid {
			log.Printf("ERRO [JWT]: Falha na validação do token: %v", err)
			http.Error(w, "Token inválido.", http.StatusForbidden) // 403
			return
		}

		// 2. Anexa os dados do usuário (claims) na requisição (equivalente ao req.user = user do JS)
		// Isso requer o uso de Context, que é a forma idiomática em Go.
		ctx := r.Context()
		ctx = context.WithValue(ctx, "userClaims", claims)

		// Passa a requisição com o novo Context para o próximo handler (next())
		next.ServeHTTP(w, r.WithContext(ctx))
	}
}

func ProtectedHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		claims, ok := r.Context().Value("userClaims").(*AuthClaims)
		if !ok {
			// Se o middleware falhou em anexar as claims, é um erro de servidor
			http.Error(w, "Erro interno: dados do usuário não disponíveis.", http.StatusInternalServerError)
			return
		}

		// Envia a resposta de sucesso com os dados do usuário
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		if err := json.NewEncoder(w).Encode(map[string]interface{}{"message": "Rota protegida!", "user": claims}); err != nil {
			log.Printf("ERRO [Encode]: Falha ao codificar resposta: %v", err)
		}
	}
}
