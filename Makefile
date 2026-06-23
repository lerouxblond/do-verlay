# do-verlay — Makefile
# Prérequis : Node >= 20, Go >= 1.22

ifeq ($(OS),Windows_NT)
	BIN = do-verlay.exe
else
	BIN = do-verlay
endif

.PHONY: install build run start dev test clean help

help:
	@echo ""
	@echo "  make install   Installe les dépendances Node"
	@echo "  make build     Compile le frontend + le binaire Go"
	@echo "  make run       Lance l'app (build frontend + go run)"
	@echo "  make start     Lance le binaire compilé (après make build)"
	@echo "  make dev       Lance le serveur de dev Vite seul (frontend)"
	@echo "  make test      Lance les tests frontend"
	@echo "  make clean     Supprime le build frontend et le binaire"
	@echo ""

install:
	cd frontend && npm install

build: install
	cd frontend && npm run build
	cd server && go build -o ../$(BIN) ./cmd/api

run: install
	cd frontend && npm run build
	cd server && go run ./cmd/api

start:
	STATIC_DIR=frontend/dist ./$(BIN)

dev:
	cd frontend && npm run dev

test:
	cd frontend && npm test

clean:
	rm -rf frontend/dist
	rm -f $(BIN)
