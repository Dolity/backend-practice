# Rust

Learning backend development with Rust — a systems programming language focused on safety, performance, and concurrency.

## Syntax Topics

- Variables (`let`, `let mut`), shadowing, constants
- Scalar types: `i32`, `u64`, `f64`, `bool`, `char`
- Compound types: tuples, arrays
- Ownership, borrowing, and lifetimes
- References (`&`, `&mut`) and the borrow checker
- Structs, enums, and pattern matching (`match`)
- `Option<T>` and `Result<T, E>` — Rust's error handling model
- Traits and generics
- Closures and iterators
- Modules and the `use` keyword
- `async`/`await` with Tokio runtime
- `cargo` — package manager and build tool

## CRUD Lifecycle

```
Client → Axum Router → Middleware (Tower) → Handler → Service → Repository → Database → Response
```

1. **Router** — `axum::Router` maps routes to async handler functions
2. **Middleware** — Tower layers (logging, auth, CORS)
3. **Handler** — async function, extracts data via `axum::extract`
4. **Service** — business logic, calls repository
5. **Repository** — database queries via `sqlx` or `diesel`
6. **Response** — returns `impl IntoResponse` (JSON via `axum::Json`)

## Error Handling Pattern

```rust
// Using Result and custom error types
#[derive(thiserror::Error, Debug)]
pub enum AppError {
    #[error("Not found")]
    NotFound,
    #[error("Database error: {0}")]
    Database(#[from] sqlx::Error),
}

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        let status = match self {
            AppError::NotFound => StatusCode::NOT_FOUND,
            AppError::Database(_) => StatusCode::INTERNAL_SERVER_ERROR,
        };
        (status, self.to_string()).into_response()
    }
}
```

## Application Lifecycle

```rust
#[tokio::main]
async fn main() {
    let app = Router::new().route("/items", get(list_items).post(create_item));

    let listener = tokio::net::TcpListener::bind("0.0.0.0:8080").await.unwrap();
    axum::serve(listener, app)
        .with_graceful_shutdown(shutdown_signal())
        .await
        .unwrap();
}
```

## Project Structure (CRUD)

```
rust/
└── crud-project/
    ├── src/
    │   ├── main.rs
    │   ├── routes/
    │   ├── handlers/
    │   ├── services/
    │   ├── models/
    │   └── errors.rs
    ├── Cargo.toml
    └── Cargo.lock
```

## Setup

```bash
cargo run

# With live reload
cargo install cargo-watch
cargo watch -x run
```

## Key Crates

- `axum` — web framework built on Tokio + Tower
- `actix-web` — alternative high-performance framework
- `tokio` — async runtime
- `sqlx` — async SQL toolkit (compile-time checked queries)
- `diesel` — ORM
- `serde` / `serde_json` — serialization/deserialization
- `thiserror` — ergonomic error types
- `dotenvy` — `.env` loader
