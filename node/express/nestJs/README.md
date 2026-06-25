# NestJS

Learning backend development with NestJS — an opinionated, TypeScript-first Node.js framework inspired by Angular.

## Syntax Topics

- Decorators (`@Controller`, `@Get`, `@Post`, `@Body`, `@Param`, `@Query`)
- Dependency Injection and `@Injectable` providers
- Modules (`@Module`) — organizing features
- Pipes — request validation and transformation (`ValidationPipe`, `ParseIntPipe`)
- Guards — authentication/authorization (`@UseGuards`)
- Interceptors — response transformation, logging
- Exception filters — centralized error handling
- TypeScript interfaces, DTOs (Data Transfer Objects), and `class-validator`

## CRUD Lifecycle

```
Client → Controller → Pipe (validation) → Service → Repository → Database → Response
```

1. **Controller** — receives HTTP request, delegates to service
2. **Pipe** — validates and transforms incoming data (DTOs)
3. **Service** — business logic layer (`@Injectable`)
4. **Repository** — data access layer (TypeORM / Prisma)
5. **Database** — executes query
6. **Response** — serialized and returned to client

## Application Lifecycle Hooks

NestJS provides lifecycle hooks for startup and shutdown:

| Hook | When it runs |
|------|-------------|
| `onModuleInit` | After module is initialized |
| `onApplicationBootstrap` | After all modules bootstrapped |
| `onModuleDestroy` | Before module is destroyed |
| `beforeApplicationShutdown` | Before app shuts down |
| `onApplicationShutdown` | After app shuts down |

## Project Structure (CRUD)

```
nestJs/
└── crud-project/
    ├── src/
    │   ├── items/
    │   │   ├── items.module.ts
    │   │   ├── items.controller.ts
    │   │   ├── items.service.ts
    │   │   ├── dto/
    │   │   └── entities/
    │   ├── app.module.ts
    │   └── main.ts
    ├── package.json
    └── tsconfig.json
```

## Setup

```bash
npm install
npm run start:dev
```

## Key Packages

- `@nestjs/common`, `@nestjs/core` — core framework
- `@nestjs/typeorm` / `@nestjs/mongoose` — database integration
- `class-validator`, `class-transformer` — DTO validation
- `@nestjs/config` — environment configuration
- `@nestjs/swagger` — auto-generated API docs
