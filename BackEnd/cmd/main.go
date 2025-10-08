package main

import (
	"database/sql"
	"log"      // Para logging de erros e mensagens de inicialização
	"net/http" // Pacote padrão para servidor web
	"os"       // Para acessar variáveis de ambiente (PORT, JWT_KEY)

	"github.com/gorilla/mux"   // Roteador HTTP
	"github.com/joho/godotenv" // Biblioteca para carregar o arquivo .env
	"github.com/rs/cors"       // Middleware para CORS

	// Importa os pacotes internos do nosso projeto
	"MeContrate/BackEnd/internal/database"
	"MeContrate/BackEnd/internal/handlers"
)

// A função main é o ponto de entrada da sua aplicação Go
func main() {
	// 1. Carrega as variáveis de ambiente do arquivo .env
	// Isto é o equivalente ao 'require('dotenv').config()'
	err := godotenv.Load()
	if err != nil {
		// Log.Fatal encerra a aplicação se o arquivo .env não for encontrado
		log.Fatal("Erro ao carregar o arquivo .env. Certifique-se de que ele existe.")
	}

	// 2. Inicializa a conexão com o banco de dados
	// Chama a função que definimos em internal/database/db.go
	db, err := database.NewConnection()
	if err != nil {
		// Encerra a aplicação se não conseguir conectar ao DB
		log.Fatalf("Não foi possível conectar ao banco de dados: %v", err)
	}
	// Garante que a conexão com o DB seja fechada quando main() terminar
	defer func(db *sql.DB) {
		err := db.Close()
		if err != nil {
			log.Printf("ERRO: Falha ao fechar conexão com o DB: %v", err)
		}
	}(db)

	// 3. Cria uma nova instância do roteador Mux
	// Isto é o equivalente ao 'const app = express()'
	router := mux.NewRouter()

	// 4. Configura o Middleware de CORS (equivalente ao app.use(cors))
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"}, // Permite qualquer front-end (Mudar em produção!)
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"}, // 'Authorization' é crucial para o JWT
		AllowCredentials: true,
		Debug:            false,
	})

	// Aplica o middleware CORS ao roteador
	handler := c.Handler(router)

	// 5. Configura e Registra as Rotas dos Handlers

	// Rota de Teste (equivalente ao app.get('/', ...))
	router.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("API MeContrate funcionando!"))
	}).Methods("GET")

	// Configura as rotas de autenticação (Login, Registro, Protegida)
	handlers.SetupAuthRoutes(router, db)
	// Configura as rotas de usuários
	handlers.SetupUserRoutes(router, db)
	// Configura as rotas de ofertas/propostas
	handlers.SetupOfferRoutes(router, db)

	// 6. Inicia o Servidor HTTP

	// Obtém a porta da variável de ambiente ou usa 5000 como padrão
	port := os.Getenv("PORT")
	if port == "" {
		port = "5000"
	}

	serverAddr := ":" + port

	log.Printf("Servidor MeContrate iniciando na porta %s", port)

	// Inicia o servidor e passa o handler com o CORS aplicado
	// Isto é o equivalente ao 'app.listen(PORT, ...)'
	if err := http.ListenAndServe(serverAddr, handler); err != nil {
		log.Fatalf("Erro ao iniciar o servidor: %v", err)
	}
}
