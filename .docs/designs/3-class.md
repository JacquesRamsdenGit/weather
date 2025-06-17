[<< Back](./../design.md)

# Class Diagrams & ERDs
Below we elaborate on the system's class diagrams and entity relational diagrams, for database projects.

We follow the iDesign principles as highlighted in the [design.md](./../design.md) file in this repository.

## Domain Model Overview

### Core Domain Entities
```mermaid
classDiagram
    %% Define primary domain entities and their relationships
    class Entity1 {
        +Id: Guid
        +Property1: string
        +Property2: int
        +Method1() ReturnType
        +Method2(param Type) ReturnType
    }
    
    class Entity2 {
        +Id: Guid
        +Property1: Type
        +Relationship: Entity1
        +Method1() ReturnType
    }
    
    class Entity3 {
        +Id: Guid
        +Property1: Type
        +Collection: Entity4[]
        +Method1() ReturnType
    }
    
    class Entity4 {
        +Id: Guid
        +Property1: Type
        +Property2: Type
    }
    
    %% Define relationships
    Entity1 "1" --> "0..*" Entity2: has
    Entity2 "1" --> "1" Entity3: references
    Entity3 "1" --> "0..*" Entity4: contains
```

## Manager Layer Classes

### Manager Interfaces
```mermaid
classDiagram
    class IManager1 {
        <<interface>>
        +Method1() Task~ReturnType~
        +Method2(param Type) Task~ReturnType~
    }
    
    class IManager2 {
        <<interface>>
        +Method1() Task~ReturnType~
        +Method2(param Type) Task~ReturnType~
    }
    
    class Manager1 {
        -IEngine1 _engine1
        -IEngine2 _engine2
        +Manager1(IEngine1 engine1, IEngine2 engine2)
        +Method1() Task~ReturnType~
        +Method2(param Type) Task~ReturnType~
    }
    
    class Manager2 {
        -IEngine3 _engine3
        +Manager2(IEngine3 engine3)
        +Method1() Task~ReturnType~
        +Method2(param Type) Task~ReturnType~
    }
    
    IManager1 <|.. Manager1: implements
    IManager2 <|.. Manager2: implements
```

### Manager Dependencies
```mermaid
classDiagram
    class Manager1 {
        -IEngine1 _engine1
        -IEngine2 _engine2
    }
    
    class IEngine1 {
        <<interface>>
    }
    
    class IEngine2 {
        <<interface>>
    }
    
    class Engine1 {
    }
    
    class Engine2 {
    }
    
    Manager1 --> IEngine1: depends on
    Manager1 --> IEngine2: depends on
    IEngine1 <|.. Engine1: implements
    IEngine2 <|.. Engine2: implements
```

## Engine Layer Classes

### Engine Interfaces
```mermaid
classDiagram
    class IEngine1 {
        <<interface>>
        +Method1() Task~ReturnType~
        +Method2(param Type) Task~ReturnType~
    }
    
    class IEngine2 {
        <<interface>>
        +Method1() Task~ReturnType~
        +Method2(param Type) Task~ReturnType~
    }
    
    class Engine1 {
        -IDataAccess1 _dataAccess
        +Engine1(IDataAccess1 dataAccess)
        +Method1() Task~ReturnType~
        +Method2(param Type) Task~ReturnType~
    }
    
    class Engine2 {
        -IDataAccess2 _dataAccess
        +Engine2(IDataAccess2 dataAccess)
        +Method1() Task~ReturnType~
        +Method2(param Type) Task~ReturnType~
    }
    
    IEngine1 <|.. Engine1: implements
    IEngine2 <|.. Engine2: implements
```

### Engine Dependencies
```mermaid
classDiagram
    class Engine1 {
        -IDataAccess1 _dataAccess
    }
    
    class IDataAccess1 {
        <<interface>>
    }
    
    class DataAccess1 {
    }
    
    Engine1 --> IDataAccess1: depends on
    IDataAccess1 <|.. DataAccess1: implements
```

## Data Access Layer Classes

### Data Access Interfaces
```mermaid
classDiagram
    class IDataAccess1 {
        <<interface>>
        +GetByIdAsync(id Guid) Task~Entity~
        +GetAllAsync() Task~List~Entity~~
        +CreateAsync(entity Entity) Task~bool~
        +UpdateAsync(entity Entity) Task~bool~
        +DeleteAsync(id Guid) Task~bool~
    }
    
    class IDataAccess2 {
        <<interface>>
        +GetByIdAsync(id Guid) Task~Entity~
        +GetAllAsync() Task~List~Entity~~
    }
    
    class DataAccess1 {
        -DbContext _context
        +DataAccess1(DbContext context)
        +GetByIdAsync(id Guid) Task~Entity~
        +GetAllAsync() Task~List~Entity~~
        +CreateAsync(entity Entity) Task~bool~
        +UpdateAsync(entity Entity) Task~bool~
        +DeleteAsync(id Guid) Task~bool~
    }
    
    class DataAccess2 {
        -DbContext _context
        +DataAccess2(DbContext context)
        +GetByIdAsync(id Guid) Task~Entity~
        +GetAllAsync() Task~List~Entity~~
    }
    
    IDataAccess1 <|.. DataAccess1: implements
    IDataAccess2 <|.. DataAccess2: implements
```

### Data Context
```mermaid
classDiagram
    class DbContext {
        +DbSet~Entity1~ Entities1
        +DbSet~Entity2~ Entities2
        +OnModelCreating(ModelBuilder builder) void
    }
    
    class Entity1 {
    }
    
    class Entity2 {
    }
    
    DbContext --> Entity1: contains
    DbContext --> Entity2: contains
```

## Model Classes

### Domain Models
```mermaid
classDiagram
    class BaseEntity {
        +Id: Guid
        +CreatedAt: DateTime
        +UpdatedAt: DateTime?
    }
    
    class DomainModel1 {
        +Property1: string
        +Property2: int
        +Relationship: DomainModel2
    }
    
    class DomainModel2 {
        +Property1: string
        +Property2: DateTime
        +Items: List~DomainModel3~
    }
    
    class DomainModel3 {
        +Property1: string
        +Property2: decimal
    }
    
    BaseEntity <|-- DomainModel1: inherits
    BaseEntity <|-- DomainModel2: inherits
    BaseEntity <|-- DomainModel3: inherits
    DomainModel1 "1" --> "1" DomainModel2: has
    DomainModel2 "1" --> "0..*" DomainModel3: contains
```

### DTOs (Data Transfer Objects)
```mermaid
classDiagram
    class CreateDto1 {
        +Property1: string
        +Property2: int
    }
    
    class UpdateDto1 {
        +Id: Guid
        +Property1: string
        +Property2: int
    }
    
    class ResponseDto1 {
        +Id: Guid
        +Property1: string
        +Property2: int
        +RelatedData: ResponseDto2
    }
    
    class ResponseDto2 {
        +Id: Guid
        +Property1: string
    }
    
    ResponseDto1 --> ResponseDto2: contains
```

### Enumerations
```mermaid
classDiagram
    class EnumType1 {
        <<enumeration>>
        Value1
        Value2
        Value3
    }
    
    class EnumType2 {
        <<enumeration>>
        Value1
        Value2
        Value3
    }
```

## Entity-Relationship Diagram (ERD)

### Database Schema
```mermaid
erDiagram
    ENTITY1 ||--o{ ENTITY2 : has
    ENTITY1 {
        uuid id PK
        string property1
        integer property2
        datetime created_at
        datetime updated_at
    }
    
    ENTITY2 ||--|| ENTITY3 : references
    ENTITY2 {
        uuid id PK
        string property1
        uuid entity1_id FK
        datetime created_at
        datetime updated_at
    }
    
    ENTITY3 ||--o{ ENTITY4 : contains
    ENTITY3 {
        uuid id PK
        string property1
        boolean property2
        datetime created_at
        datetime updated_at
    }
    
    ENTITY4 {
        uuid id PK
        string property1
        uuid entity3_id FK
        datetime created_at
        datetime updated_at
    }
```

### Database Relationships
- **ENTITY1** to **ENTITY2**: One-to-Many (1:N)
  - A single ENTITY1 can have multiple ENTITY2s
  - Each ENTITY2 belongs to exactly one ENTITY1
  - Foreign key `entity1_id` in ENTITY2 table
  
- **ENTITY2** to **ENTITY3**: One-to-One (1:1)
  - Each ENTITY2 is associated with exactly one ENTITY3
  - Foreign key `entity2_id` could be in either table
  
- **ENTITY3** to **ENTITY4**: One-to-Many (1:N)
  - A single ENTITY3 can have multiple ENTITY4s
  - Each ENTITY4 belongs to exactly one ENTITY3
  - Foreign key `entity3_id` in ENTITY4 table

## Dependency Injection Setup
```csharp
// Register interfaces and implementations
services.AddScoped<IManager1, Manager1>();
services.AddScoped<IManager2, Manager2>();
services.AddScoped<IEngine1, Engine1>();
services.AddScoped<IEngine2, Engine2>();
services.AddScoped<IDataAccess1, DataAccess1>();
services.AddScoped<IDataAccess2, DataAccess2>();

// Register database context
services.AddDbContext<ApplicationDbContext>(options => 
    options.UseNpgsql(Configuration.GetConnectionString("DefaultConnection")));
```

## SOLID Principles Application

### Single Responsibility Principle
Each class in our design has a single responsibility:
- **Managers**: Orchestrate business operations and use cases
- **Engines**: Execute complex business logic
- **Data Access**: Handle persistence and retrieval operations
- **Models**: Hold data structure and validation rules

### Open/Closed Principle
Our design enables extension without modification:
- Interfaces define contracts that can be implemented by new classes
- New functionality can be added via new implementations without changing existing code

### Liskov Substitution Principle
- All implementations can be used anywhere their interfaces are expected
- Base classes can be replaced with derived classes without affecting functionality

### Interface Segregation Principle
- Interfaces are kept focused and specific
- Clients don't depend on methods they don't use

### Dependency Inversion Principle
- High-level modules depend on abstractions (interfaces)
- Low-level modules also depend on abstractions
- All dependencies are injected through constructors

---

**Template Instructions**:
1. Replace all placeholder classes, methods, and properties with actual project-specific elements
2. Ensure each interface explicitly states what its corresponding implementation will do
3. Maintain color coding: Managers (Green), Engines (Orange), Data Access (Grey), Models (Purple)
4. Include all relationships between classes with proper cardinality notation
5. Follow C# naming conventions for all elements

[<< Back](./../design.md)