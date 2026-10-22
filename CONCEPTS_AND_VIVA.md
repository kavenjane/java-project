# Important Java Concepts and Viva Questions

## Part 1: Java concepts used in this project

### Classes and objects
A **class** is a blueprint; an **object** is one instance of it. `Item` is a class, and each row in the table becomes an `Item` object, e.g. `new Item("Umbrella", ...)`. The fields (`name`, `date` ...) are private and accessed through getters and setters (**encapsulation**).

### Annotations
Annotations are labels that tell Spring or Hibernate what a class or method is for.

| Annotation | Meaning |
|-----------|---------|
| `@SpringBootApplication` | Starts the app, enables auto-configuration and component scanning |
| `@Entity`, `@Table` | This class maps to a database table |
| `@Id`, `@GeneratedValue` | Primary key, auto-incremented by MySQL |
| `@Column`, `@Enumerated` | Column rules; store enums as text |
| `@Service` | Marks the business-logic class |
| `@RestController`, `@RequestMapping` | Class that handles HTTP requests and returns JSON |
| `@GetMapping`, `@PostMapping`, `@PutMapping`, `@PatchMapping`, `@DeleteMapping` | Map HTTP methods to Java methods |
| `@PathVariable`, `@RequestParam`, `@RequestBody` | Read data from the URL, query string or JSON body |
| `@Valid`, `@NotBlank`, `@NotNull`, `@Size`, `@PastOrPresent` | Request validation |
| `@RestControllerAdvice`, `@ExceptionHandler` | Central exception handling |
| `@Configuration`, `@Bean` | Define configuration and objects managed by Spring |

### Dependency injection (DI) and Inversion of Control
We never write `new ItemService()` or `new ItemRepository()`. Spring creates these objects (beans) and passes them in through the constructor:

```java
public ItemService(ItemRepository itemRepository) {
    this.itemRepository = itemRepository;
}
```

This is **constructor injection**. It makes classes loosely coupled and easy to test.

### Interfaces
`ItemRepository` is an **interface** that extends `JpaRepository<Item, Long>`. We write no implementation: Spring Data JPA generates it at runtime and gives us `save`, `findById`, `findAll`, `delete` and more. We added one custom `@Query` method for search and filtering.

### Enums
`ReportType` (LOST, FOUND) and `ItemStatus` (OPEN, RESOLVED) are enums: a fixed set of allowed values, which prevents typos.

### Exception handling
- `ItemNotFoundException` is a custom unchecked exception (extends `RuntimeException`).
- The service throws it with `orElseThrow(...)` when an id does not exist.
- `GlobalExceptionHandler` catches it, plus validation errors and bad input, and returns a clean JSON body with the right HTTP status (404 or 400). Controllers contain no try/catch.

### CRUD operations

| Operation | HTTP | Service method | Repository call |
|-----------|------|---------------|-----------------|
| Create | POST | `createItem` | `save()` |
| Read | GET | `getItems`, `getItemById` | `search()`, `findById()` |
| Update | PUT / PATCH | `updateItem`, `markAsResolved` | `save()` on an existing entity |
| Delete | DELETE | `deleteItem` | `delete()` |

### Layered architecture
Controller (HTTP) -> Service (logic) -> Repository (database) -> MySQL. Each layer has one job. The **DTO** (`ItemRequest`) carries and validates incoming data so the client cannot directly set fields like `id`.

---

## Part 2: 10 viva questions and answers

**1. What is the aim of this project and which technologies did you use?**
It lets college students report lost or found items and track them until they are returned. Frontend: React with Axios. Backend: Java 17 with Spring Boot REST APIs. Database: MySQL accessed through Spring Data JPA / Hibernate. Build tool: Maven.

**2. Explain the architecture of your application.**
It is a three-tier application. React (presentation) sends HTTP requests to Spring Boot (application). Inside Spring Boot, the Controller handles requests, the Service holds the logic, and the Repository talks to MySQL (data). Data moves as JSON between React and Spring Boot.

**3. What is Spring Boot and why use it instead of plain Spring?**
Spring Boot is a framework built on Spring that removes most manual configuration. It gives auto-configuration, starter dependencies, and an embedded Tomcat server, so I can run the backend with one command without installing a separate server or writing XML.

**4. What is dependency injection? Where did you use it?**
DI means a class receives the objects it depends on instead of creating them. `ItemController` receives `ItemService` and `ItemService` receives `ItemRepository`, both through constructors. Spring creates and wires these beans, which reduces coupling and makes testing easier.

**5. What is the difference between `@Controller` and `@RestController`?**
`@Controller` is mainly for returning view pages. `@RestController` combines `@Controller` and `@ResponseBody`, so every method returns data (JSON) written directly to the HTTP response. I used `@RestController` because React consumes JSON.

**6. What is JPA and Hibernate? What does `JpaRepository` provide?**
JPA is the Java specification for object-relational mapping, and Hibernate is the implementation Spring uses. Together they map classes to tables so I do not write SQL for basic operations. `JpaRepository` gives ready-made methods such as `save`, `findById`, `findAll` and `delete`, plus paging and sorting.

**7. What does `@Entity` do, and how is the primary key generated?**
`@Entity` marks the class as mapped to a table (`items`). `@Id` marks the primary key, and `@GeneratedValue(strategy = GenerationType.IDENTITY)` lets MySQL auto-increment it. `ddl-auto=update` makes Hibernate create or update the table from the entity.

**8. How does searching and filtering work?**
React sends `GET /api/items?name=bag&type=LOST&status=OPEN`. The controller reads these with `@RequestParam` (all optional). The repository's JPQL query uses `LIKE` on the lower-cased name for partial, case-insensitive search, and `(:type IS NULL OR ...)` so a missing filter is simply ignored.

**9. How do you handle errors and validation?**
Validation annotations like `@NotBlank` and `@PastOrPresent` on the DTO are triggered by `@Valid` in the controller; failures return HTTP 400 with messages. If an id is missing, the service throws `ItemNotFoundException`, and `@RestControllerAdvice` converts it to a 404 JSON response. React reads the message and shows it in a red banner.

**10. What is CORS and why did you configure it? How does React call the backend?**
Browsers block a page on one origin (`localhost:5173`) from calling an API on another (`localhost:8080`) unless the server allows it. `CorsConfig` allows the React origin and the HTTP methods used. React calls the API with Axios (`axios.get`, `post`, `put`, `patch`, `delete`) and updates its state with the response.

### Bonus questions you may get

- **PUT vs PATCH?** PUT replaces the full item's editable fields; PATCH changes only part of it. I used PATCH for "mark as resolved" because only the status changes.
- **Why a DTO and not the Entity directly?** It separates the API contract from the database model and lets me add validation without polluting the entity.
- **Why store enums as `EnumType.STRING`?** Text values stay correct if the enum order changes; ordinal numbers would not.
- **What does `spring.jpa.hibernate.ddl-auto=update` do?** It updates the schema to match the entities without dropping data. For production you would use migrations instead.
- **How would you extend this?** Add pagination, image upload, user login, or email notifications.
