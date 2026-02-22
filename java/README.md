# Java (Spring Boot)

Learning backend development with Java and Spring Boot — a convention-over-configuration framework for building production-ready web APIs.

## Syntax Topics

- Variables, primitive types (`int`, `long`, `double`, `boolean`, `char`) and wrapper classes
- Classes, objects, constructors, and access modifiers (`public`, `private`, `protected`)
- Inheritance, interfaces, and abstract classes
- Generics (`List<T>`, `Map<K, V>`, `Optional<T>`)
- Collections framework — `ArrayList`, `HashMap`, `HashSet`
- Streams API — `stream()`, `filter()`, `map()`, `collect()`
- Lambda expressions and functional interfaces
- Exception handling (`try/catch/finally`, checked vs unchecked exceptions)
- Annotations (`@Override`, `@Component`, `@Autowired`, custom annotations)
- `Optional<T>` — avoiding null pointer exceptions
- Records (Java 16+) — immutable data classes
- `var` keyword (Java 10+) — local type inference
- Dependency Injection with Spring IoC container

## CRUD Lifecycle

```
Client → DispatcherServlet → Filter → Controller → Service → Repository → Database → Response
```

1. **Filter** — pre-processes request (security, logging, CORS) — `javax.servlet.Filter`
2. **DispatcherServlet** — Spring MVC front controller, routes to correct controller
3. **Controller** — `@RestController` handles HTTP request, delegates to service
4. **Service** — `@Service` contains business logic
5. **Repository** — `@Repository` / `JpaRepository` handles database queries
6. **Database** — JPA/Hibernate executes SQL
7. **Response** — serialized to JSON via Jackson

## Application Lifecycle

Spring Boot application lifecycle phases:

| Phase | Description |
|-------|-------------|
| `SpringApplication.run()` | Bootstraps the application context |
| `ApplicationContext` refresh | Instantiates and wires all beans |
| `ApplicationRunner` / `CommandLineRunner` | Runs after context is ready |
| `@PostConstruct` | Called after bean initialization |
| `@PreDestroy` | Called before bean destruction |
| `ContextClosedEvent` | Published when context is closing |

```java
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}

@Component
public class StartupRunner implements ApplicationRunner {
    @Override
    public void run(ApplicationArguments args) {
        // Runs after application starts
    }
}
```

## Project Structure (CRUD)

```
java/
└── crud-project/
    └── src/main/java/com/example/
        ├── controller/
        │   └── ItemController.java
        ├── service/
        │   ├── ItemService.java
        │   └── ItemServiceImpl.java
        ├── repository/
        │   └── ItemRepository.java
        ├── model/
        │   └── Item.java
        ├── dto/
        │   └── CreateItemDto.java
        └── Application.java
```

## Setup

```bash
# Maven
./mvnw spring-boot:run

# Gradle
./gradlew bootRun

# With live reload (DevTools)
# Add spring-boot-devtools dependency — auto-restart on file change
```

## Key Dependencies (Maven / Gradle)

- `spring-boot-starter-web` — embedded Tomcat + Spring MVC
- `spring-boot-starter-data-jpa` — JPA + Hibernate ORM
- `spring-boot-starter-validation` — Bean Validation (`@NotNull`, `@Size`, etc.)
- `spring-boot-starter-security` — authentication and authorization
- `spring-boot-devtools` — live reload during development
- `postgresql` / `h2` — database drivers
- `springdoc-openapi-starter-webmvc-ui` — Swagger / OpenAPI docs
- `lombok` — reduces boilerplate (`@Getter`, `@Setter`, `@Builder`, `@Data`)
