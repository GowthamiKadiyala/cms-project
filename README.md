# Headless CMS Architecture

A distributed, containerized Content Management System designed for high-throughput content delivery. This project implements a **Cache-Aside** strategy using Redis to minimize database load and features a hybrid SQL/NoSQL schema for flexible page layout storage.

## 🏗 System Architecture

The application utilizes a **Microservices-ready** architecture orchestrated via Docker Compose.

* **API Gateway / Backend:** Node.js (Express) utilizing a Layered Architecture (Controller → Service → Data Access Layer) to ensure separation of concerns.
* **Persistent Storage:** PostgreSQL 13. Uses **JSONB** columns to store polymorphic content blocks ("Lego" system), allowing schema-less flexibility within a relational environment.
* **Caching Layer:** Redis (Alpine). Implements **TTL-based expiration** and **event-driven invalidation** (write-through logic) to ensure cache consistency.
* **Frontend Client:** React 18 + Vite. Uses `@dnd-kit` for complex drag-and-drop state management and optimistic UI updates.

## ⚙️ Technical Highlights

### 1. Hybrid Data Modeling
Instead of rigid EAV (Entity-Attribute-Value) tables, this system uses a document-store approach within Postgres:
* **Pages** are stored as relational rows (ID, Slug, CreatedAt).
* **Content Blocks** are serialized into a single `JSONB` array. This allows for $O(1)$ retrieval of complex layouts without expensive SQL `JOIN` operations.

### 2. Cache-Aside Pattern (Read-Through)
To handle high read traffic, the backend intercepts `GET` requests:
1.  **Hit:** Checks Redis key `content:{id}`. If exists, returns compressed JSON string immediately (Sub-millisecond latency).
2.  **Miss:** Queries PostgreSQL, serializes the result, writes to Redis with a 60s TTL, and returns data.
3.  **Invalidation:** `POST/PUT` operations trigger a `redisClient.del()` to prevent stale data propagation.

### 3. Container Orchestration
The stack runs on a custom **Docker Bridge Network**, isolating internal services from the host.
* **Postgres:** Persists data via Docker Volumes (`pgdata`) to survive container lifecycles.
* **Networking:** Backend resolves services via internal DNS (e.g., `redis://redis:6379`) rather than localhost, mimicking a production Kubernetes pod structure.

## 🛠 Tech Stack

| Service | Technology | Role |
| :--- | :--- | :--- |
| **Orchestration** | Docker Compose | Container lifecycle management |
| **Compute** | Node.js / Express | RESTful API |
| **Database** | PostgreSQL | Primary Record Store |
| **Cache** | Redis | In-Memory Key-Value Store |
| **Client** | React / Vite | SPA Interface |

## 🚀 Deployment Instructions

### Prerequisites
* Docker Engine & Docker Compose
* Ports `5432`, `6379`, `5001`, `5173` available.

### Build & Run
Initialize the container cluster:

```bash
docker-compose up --build
