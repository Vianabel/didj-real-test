# Wallet Service
## Запуск

1. Postgres (Docker):

```bash
docker compose up -d db
```

2. Создать `.env` по образцу `.env.example`.
3. Установить зависимости и собрать:

```bash
npm install
npm run build
```

4. Применить миграции и запустить:

```bash
npm run migration:run
npm run start:dev
```

При старте, если юзера с id=1 нет, он создастся с балансом 500 и пополнением в истории.

## Docker

```bash
docker compose up --build
```

При старте контейнера миграции применяются автоматически.

## Миграции

```bash
npm run migration:generate -- src/database/migrations/migration_name
npm run build
npm run migration:run
```

## Тесты

```bash
npm run test
```

## Эндпоинты

- `POST /users/:id/payments` — списание (тело: `{"amount": 50}`)
- `GET /users/:id/balance` — баланс
- `GET /users/:id/payments` — история
- `GET /api/docs` — Swagger

Каждая операция пишется в payment_history, а после неё баланс пересчитывается из истории (пополнение/возврат – в плюс, покупка – в минус) в одной транзакции.
