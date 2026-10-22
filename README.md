# College Lost and Found Management System

A beginner-friendly full-stack mini project. Students can report lost or found items, search and filter reports, edit or delete them, and mark them as resolved once the item is returned.

## Tech stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js (Vite), HTML, CSS, JavaScript, Axios |
| Backend | Java 17, Spring Boot 3.3, Spring Web (REST) |
| ORM | Spring Data JPA / Hibernate |
| Database | MySQL 8 |
| Build tool | Maven (backend), npm (frontend) |

## Project structure

```
lost-and-found/
├── README.md
├── CONCEPTS_AND_VIVA.md              # Java concepts + 10 viva Q&A
├── database/
│   └── setup.sql                     # optional manual DB/table script
├── backend/                          # Spring Boot application
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/college/lostfound/
│       │   ├── LostFoundApplication.java        # main class
│       │   ├── model/
│       │   │   ├── Item.java                    # Entity (table "items")
│       │   │   ├── ReportType.java              # enum LOST, FOUND
│       │   │   └── ItemStatus.java              # enum OPEN, RESOLVED
│       │   ├── dto/ItemRequest.java             # request body + validation
│       │   ├── repository/ItemRepository.java   # JPA repository (interface)
│       │   ├── service/ItemService.java         # business logic
│       │   ├── controller/ItemController.java   # REST endpoints
│       │   ├── exception/
│       │   │   ├── ItemNotFoundException.java
│       │   │   └── GlobalExceptionHandler.java  # JSON error responses
│       │   └── config/
│       │       ├── CorsConfig.java              # allow React to call the API
│       │       └── SampleDataLoader.java        # inserts demo records
│       └── resources/application.properties     # MySQL configuration
└── frontend/                         # React application
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx                   # state, filters, calls the API
        ├── App.css
        ├── api/itemApi.js            # all Axios calls
        └── components/
            ├── ItemForm.jsx          # add / edit form
            ├── ItemTable.jsx         # list with action buttons
            └── ItemDetails.jsx       # details popup
```

## How the three parts talk to each other

```
 Browser (React, :5173)  --Axios / JSON-->  Spring Boot (:8080)  --JPA/Hibernate / SQL-->  MySQL (:3306)
 ItemForm, ItemTable        Controller -> Service -> Repository                             lost_found_db.items
```

1. The user clicks a button or types in the search box in React.
2. `itemApi.js` sends an HTTP request with Axios, e.g. `GET http://localhost:8080/api/items?name=bag&type=LOST`.
3. `ItemController` receives it and calls `ItemService`.
4. `ItemService` applies the logic and calls `ItemRepository`.
5. Spring Data JPA / Hibernate turns that into SQL and runs it on MySQL.
6. The result travels back: Entity -> JSON -> React state -> the table on screen.

## Prerequisites

- JDK 17 or newer (`java -version`)
- Maven 3.8+ (`mvn -version`)
- Node.js 18+ and npm (`node -v`)
- MySQL 8 running locally (`mysql --version`)

## 1. Database setup

The app creates the database `lost_found_db` and the `items` table automatically. You only need MySQL running and the right credentials.

Open `backend/src/main/resources/application.properties` and set your MySQL password:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/lost_found_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
spring.jpa.hibernate.ddl-auto=update
```

Prefer to create it manually? Run `database/setup.sql` in MySQL Workbench or the `mysql` client.

## 2. Run the backend

```bash
cd backend
mvn spring-boot:run
```

Wait for `Started LostFoundApplication`. Test it in a browser: <http://localhost:8080/api/items>. You should see the 6 sample records as JSON.

## 3. Run the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open <http://localhost:5173>.

## REST API

| Method | URL | Purpose |
|--------|-----|---------|
| GET | `/api/items` | List all items. Optional `?name=`, `?type=LOST\|FOUND`, `?status=OPEN\|RESOLVED` |
| GET | `/api/items/{id}` | View one item |
| POST | `/api/items` | Add an item |
| PUT | `/api/items/{id}` | Edit an item |
| DELETE | `/api/items/{id}` | Delete an item |
| PATCH | `/api/items/{id}/resolve` | Mark as resolved / returned |

Example request body for POST / PUT:

```json
{
  "name": "Black Backpack",
  "description": "Wildcraft bag with a laptop charger",
  "category": "Bags",
  "location": "Library, 2nd floor",
  "date": "2026-10-20",
  "reportType": "LOST"
}
```

Errors come back as JSON, for example `404 {"status":404,"message":"Item not found with id 99"}` or `400` with a list of validation messages.

## Sample records

On the first start (when the table is empty), `SampleDataLoader` inserts six records: a black backpack (LOST), a Casio calculator (FOUND), a student ID card (FOUND), a blue water bottle (LOST, RESOLVED), wired earphones (LOST) and an umbrella (FOUND).

To reset the demo data: `DROP DATABASE lost_found_db;` and restart the backend.

## Demo checklist for your viva

1. Show the six sample records in the table.
2. Search "bag", then clear it.
3. Filter by Lost / Found and by Open / Resolved.
4. Click View to open the details popup.
5. Report a new item. Try submitting with an empty name to show validation.
6. Edit an item and save.
7. Click Resolve and show the status badge change.
8. Delete an item.
9. Open MySQL and run `SELECT * FROM lost_found_db.items;` to prove the data is real.
10. Open `http://localhost:8080/api/items/999` to show the 404 error response.

## Troubleshooting

- **Access denied for user 'root'**: fix the username/password in `application.properties`.
- **Communications link failure**: MySQL is not running or not on port 3306.
- **Port 8080 already in use**: change `server.port` in `application.properties` and the `baseURL` in `frontend/src/api/itemApi.js`.
- **"Cannot reach the server" in the browser**: the backend is not running.
- **CORS error in the browser console**: open the app at `http://localhost:5173` (the origin allowed in `CorsConfig.java`).
