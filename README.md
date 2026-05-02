# Banking Customer Microservice

A full-stack, containerized microservice system for managing banking customers and KYC (Know Your Customer) workflows.

## 🚀 Quick Start

Ensure you have **Docker** and **Docker Compose** installed.

```bash
# Clone the repository
git clone https://github.com/Naseeruddin2024tm93510/customer-service.git
cd customer-service

# Start the entire stack
docker compose up -d --build
```

## 🏗️ Architecture
The system consists of five main components:
- **Banking Frontend**: React-based dashboard (Port 3000)
- **Customer Service**: Spring Boot microservice (Port 9090)
- **Database**: MySQL 8.0 (Port 3307)
- **Message Broker**: Apache Kafka & Zookeeper (Port 29092)
- **Logging**: Persistent file logs mounted to `./logs/customer-service/`

## 🔗 Access Links
| Service | URL |
| :--- | :--- |
| **Web Dashboard** | [http://localhost:3000](http://localhost:3000) |
| **Swagger API Docs** | [http://localhost:9090/swagger-ui/index.html](http://localhost:9090/swagger-ui/index.html) |
| **API Base URL** | [http://localhost:9090/api/v1/customers](http://localhost:9090/api/v1/customers) |

## ✨ Key Features
- **Manual Registration**: Add customers via a modern UI modal.
- **Bulk CSV Upload**: Import large datasets using the provided `bank_customers.csv`.
- **KYC Workflow**: Approve or reject customers, triggering asynchronous Kafka events.
- **Real-time Logging**: All service activities are tracked in `logs/customer-service.log`.

## 🛠️ Technology Stack
- **Frontend**: React 19, Vite, Axios, Lucide Icons.
- **Backend**: Java 17, Spring Boot 3.2.5, Spring Data JPA, Spring Kafka.
- **Messaging**: Confluent Kafka 7.4.0.
- **Infrastructure**: Docker, Docker Compose.

## 🧪 Testing
### Unit Tests
Run backend tests using Maven:
```bash
cd customer-service
./mvnw test
```

### API Testing
- Import the `Customer_Service_Postman.json` into Postman.
- Use Swagger UI at the link provided above.

## 📁 Project Structure
```text
.
├── banking-frontend/      # React application
├── customer-service/      # Spring Boot microservice
├── logs/                 # Persistent system logs
├── docker-compose.yml     # Orchestration script
├── technical_design_document.md
└── project_final_report.md
```

## 🤝 Contribution
1. Work on `develop` branch.
2. Merge into `master` for production releases.
