# Discord Git Webhook Makefile

.PHONY: test build version release workspace

# Test commands
test-build:
	docker compose -f compose.test.yaml build test

test: test-build
	docker compose -f compose.test.yaml run --rm test

# Build commands
build:
	docker compose build release

# Version commands
version:
	docker compose run --rm release standard-version

# Release commands
release:
	git push --follow-tags origin main
	docker compose run --rm release conventional-github-releaser

# Development workspace
workspace:
	docker compose build workspace
	docker compose run --rm workspace

# Clean up
clean:
	docker compose down 