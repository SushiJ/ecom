PROD_ENV=.env.prod
PROD_TEST_ENV=.env.test_prod

DC=docker compose

# Local Dev and testing mongo container
dev:
	$(DC) -f docker-compose.yaml up

dev-down:
	$(DC) -f docker-compose.yaml down

# Production [(server + db) inside Docker]
prod:
	ENV_FILE=$(PROD_ENV) $(DC) -f docker-compose.prod.yaml up

prod-down:
	ENV_FILE=$(PROD_ENV) $(DC) -f docker-compose.prod.yaml down

# Full Containerized Test [(server + test db) inside, e.g. CI]
prod-test:
	ENV_FILE=$(PROD_TEST_ENV) $(DC) -f docker-compose.prod.yaml up

prod-test-down:
	ENV_FILE=$(PROD_TEST_ENV) $(DC) -f docker-compose.prod.yaml down

prod-full:
	ENV_FILE=$(PROD_ENV) docker compose -f docker-compose.test.yaml up

prod-full-down:
	ENV_FILE=$(PROD_ENV) docker compose -f docker-compose.test.yaml down
