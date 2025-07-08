package db

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/lib/pq"
)

var DB *sql.DB

func ConnectPostgres() error {
	connStr := os.Getenv("DATABASE_URL")
	if connStr == "" {
		connStr = "postgres://app:secret@db:5432/app?sslmode=disable"
	}

	var err error
	DB, err = sql.Open("postgres", connStr)
	if err != nil {
		return fmt.Errorf("PostgreSQL connect error: %v", err)
	}

	if err = DB.Ping(); err != nil {
		return fmt.Errorf("PostgreSQL ping failed: %v", err)
	}

	// Create agents table if it doesn't exist
	createTableSQL := `CREATE TABLE IF NOT EXISTS agents (
		hostname TEXT PRIMARY KEY,
		uptime INTEGER,
		os TEXT,
		last_seen TIMESTAMP
	);`

	_, err = DB.Exec(createTableSQL)
	if err != nil {
		return fmt.Errorf("Failed to create agents table: %v", err)
	}
	log.Println("Agents table ensured.")

	return nil
}
