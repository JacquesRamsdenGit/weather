[<< Back](./../design.md)

# Sequence Diagrams

Below we elaborate on the system's sequence diagrams that are based on the [system components](./2-system-components.md) and the [class diagrams](./3-class.md).

We follow the iDesign principles as highlighted in the [design.md](./../design.md) file in this repository.

## Core Business Processes

### Primary User Flow: [Process Name]

```mermaid
sequenceDiagram
    autonumber
    participant Client as Client/UI
    participant API as API Controller
    participant Manager as Manager (Green)
    participant Engine as Engine (Orange)
    participant DataAccess as Data Access (Grey)
    participant DB as Database

    Client->>API: HTTP Request (POST /resource)
    Note over Client,API: Request includes required data

    API->>API: Validate request

    alt Invalid Request
        API-->>Client: 400 Bad Request
    else Valid Request
        API->>Manager: Process Request

        Manager->>Engine: Execute Business Logic

        Engine->>DataAccess: Retrieve Data
        DataAccess->>DB: Query Database
        DB-->>DataAccess: Return Data
        DataAccess-->>Engine: Return Data

        Engine->>Engine: Process Data

        Engine->>DataAccess: Save Results
        DataAccess->>DB: Update Database
        DB-->>DataAccess: Confirm Update
        DataAccess-->>Engine: Return Success

        Engine-->>Manager: Return Result
        Manager-->>API: Return Result
        API-->>Client: 200 OK with Response
    end
```

### Authentication Flow

```mermaid
sequenceDiagram
    autonumber
    participant Client as Client/UI
    participant API as Authentication API
    participant Auth as Auth Manager (Green)
    participant UserEng as User Engine (Orange)
    participant TokenEng as Token Engine (Orange)
    participant UserData as User Data Access (Grey)
    participant DB as Database

    Client->>API: Login Request (username/password)
    API->>Auth: Authenticate User
    Auth->>UserEng: Validate Credentials

    UserEng->>UserData: Find User
    UserData->>DB: Query User
    DB-->>UserData: Return User
    UserData-->>UserEng: Return User

    alt Invalid Credentials
        UserEng-->>Auth: Authentication Failed
        Auth-->>API: Return Error
        API-->>Client: 401 Unauthorized
    else Valid Credentials
        UserEng-->>Auth: User Authenticated
        Auth->>TokenEng: Generate JWT
        TokenEng-->>Auth: Return Token
        Auth-->>API: Return Authentication Result
        API-->>Client: 200 OK with JWT
    end
```

### Data Modification Flow

```mermaid
sequenceDiagram
    autonumber
    participant Client as Client/UI
    participant API as API Controller
    participant AuthMid as Auth Middleware
    participant Manager as Resource Manager (Green)
    participant ValidEng as Validation Engine (Orange)
    participant BusEng as Business Engine (Orange)
    participant DataAccess as Data Access (Grey)
    participant DB as Database
    participant Event as Event System

    Client->>API: Update Request
    API->>AuthMid: Validate Token

    alt Invalid Token
        AuthMid-->>API: Authentication Failed
        API-->>Client: 401 Unauthorized
    else Valid Token
        AuthMid-->>API: User Authenticated
        API->>Manager: Update Resource

        Manager->>ValidEng: Validate Input

        alt Invalid Input
            ValidEng-->>Manager: Validation Failed
            Manager-->>API: Return Error
            API-->>Client: 400 Bad Request
        else Valid Input
            ValidEng-->>Manager: Input Valid
            Manager->>BusEng: Process Update

            BusEng->>DataAccess: Retrieve Current Data
            DataAccess->>DB: Query Database
            DB-->>DataAccess: Return Current Data
            DataAccess-->>BusEng: Return Current Data

            BusEng->>BusEng: Apply Business Rules

            BusEng->>DataAccess: Save Updated Data
            DataAccess->>DB: Update Database
            DB-->>DataAccess: Confirm Update
            DataAccess-->>BusEng: Return Success

            BusEng->>Event: Publish Change Event

            BusEng-->>Manager: Return Result
            Manager-->>API: Return Result
            API-->>Client: 200 OK with Response
        end
    end
```

## Exception Handling Flows

### Error Handling Sequence

```mermaid
sequenceDiagram
    autonumber
    participant Client as Client/UI
    participant API as API Controller
    participant Manager as Manager (Green)
    participant Engine as Engine (Orange)
    participant DataAccess as Data Access (Grey)
    participant DB as Database
    participant Logger as Logging System

    Client->>API: HTTP Request
    API->>Manager: Process Request
    Manager->>Engine: Execute Business Logic

    alt Database Error
        Engine->>DataAccess: Retrieve Data
        DataAccess->>DB: Query Database
        DB--xDataAccess: Database Error
        DataAccess->>Logger: Log Error
        DataAccess-->>Engine: Throw DataAccessException
        Engine-->>Manager: Propagate Exception
        Manager-->>API: Return Error Details
        API-->>Client: 503 Service Unavailable
    else Business Logic Error
        Engine->>Engine: Process Data
        Engine->>Logger: Log Business Error
        Engine-->>Manager: Throw BusinessLogicException
        Manager-->>API: Return Error Details
        API-->>Client: 400 Bad Request
    else Unexpected Error
        Engine->>Engine: Unknown Error Occurs
        Engine->>Logger: Log Critical Error
        Engine-->>Manager: Throw Exception
        Manager-->>API: Return Generic Error
        API-->>Client: 500 Internal Server Error
    end
```

### Retry Pattern Flow

```mermaid
sequenceDiagram
    autonumber
    participant Client as Client/UI
    participant API as API Controller
    participant Manager as Manager (Green)
    participant Engine as Engine (Orange)
    participant RetryPolicy as Retry Policy
    participant ExternalAPI as External API

    Client->>API: HTTP Request
    API->>Manager: Process Request
    Manager->>Engine: Execute Business Logic

    Engine->>RetryPolicy: Execute With Retry

    loop Retry Logic (max 3 attempts)
        RetryPolicy->>ExternalAPI: API Call

        alt Successful Response
            ExternalAPI-->>RetryPolicy: Return Data
            RetryPolicy-->>Engine: Return Success
            Engine-->>Manager: Return Result
            Manager-->>API: Return Result
            API-->>Client: 200 OK with Response
        else Transient Error
            ExternalAPI--xRetryPolicy: 503 Service Unavailable
            RetryPolicy->>RetryPolicy: Wait (Exponential Backoff)
            Note over RetryPolicy: Retry if attempts < max
        end
    end

    alt Max Retries Exceeded
        RetryPolicy-->>Engine: Throw Exception
        Engine-->>Manager: Propagate Exception
        Manager-->>API: Return Error Details
        API-->>Client: 503 Service Unavailable
    end
```

## Cross-Cutting Concerns

### Caching Sequence

```mermaid
sequenceDiagram
    autonumber
    participant Client as Client/UI
    participant API as API Controller
    participant Manager as Manager (Green)
    participant Cache as Cache Service
    participant Engine as Engine (Orange)
    participant DataAccess as Data Access (Grey)
    participant DB as Database

    Client->>API: HTTP Request (GET /resource)
    API->>Manager: Get Resource

    Manager->>Cache: Check Cache

    alt Cache Hit
        Cache-->>Manager: Return Cached Data
        Manager-->>API: Return Result
        API-->>Client: 200 OK with Response
    else Cache Miss
        Cache-->>Manager: Cache Miss
        Manager->>Engine: Execute Retrieval
        Engine->>DataAccess: Retrieve Data
        DataAccess->>DB: Query Database
        DB-->>DataAccess: Return Data
        DataAccess-->>Engine: Return Data
        Engine-->>Manager: Return Result

        Manager->>Cache: Update Cache

        Manager-->>API: Return Result
        API-->>Client: 200 OK with Response
    end
```

### Logging and Monitoring Flow

```mermaid
sequenceDiagram
    autonumber
    participant Client as Client/UI
    participant API as API Controller
    participant Metrics as Metrics Collector
    participant Manager as Manager (Green)
    participant Engine as Engine (Orange)
    participant Logger as Logging System
    participant DataAccess as Data Access (Grey)
    participant DB as Database

    Client->>API: HTTP Request

    API->>Metrics: Record Request Start
    API->>Logger: Log Request

    API->>Manager: Process Request

    Manager->>Logger: Log Operation Start
    Manager->>Engine: Execute Business Logic

    Engine->>Logger: Log Processing Start
    Engine->>DataAccess: Retrieve Data

    DataAccess->>Logger: Log Query
    DataAccess->>DB: Query Database
    DB-->>DataAccess: Return Data
    DataAccess-->>Engine: Return Data

    Engine->>Logger: Log Processing Complete
    Engine-->>Manager: Return Result

    Manager->>Logger: Log Operation Complete
    Manager-->>API: Return Result

    API->>Metrics: Record Request End
    API->>Logger: Log Response
    API-->>Client: HTTP Response

    Note over Metrics,Logger: Metrics and logs are collected and processed asynchronously
```

## Transaction Management

### Transactional Process Flow

```mermaid
sequenceDiagram
    autonumber
    participant Client as Client/UI
    participant API as API Controller
    participant Manager as Manager (Green)
    participant TxManager as Transaction Manager
    participant Engine as Engine (Orange)
    participant DataAccess as Data Access (Grey)
    participant DB as Database

    Client->>API: HTTP Request (POST /operation)
    API->>Manager: Execute Operation

    Manager->>TxManager: Begin Transaction

    TxManager->>Manager: Transaction Started

    Manager->>Engine: Execute Step 1
    Engine->>DataAccess: Update Resource A
    DataAccess->>DB: Update Database
    DB-->>DataAccess: Update Successful
    DataAccess-->>Engine: Return Success
    Engine-->>Manager: Step 1 Complete

    Manager->>Engine: Execute Step 2

    alt Step 2 Fails
        Engine->>DataAccess: Update Resource B
        DataAccess->>DB: Update Database
        DB--xDataAccess: Error Occurs
        DataAccess-->>Engine: Return Error
        Engine-->>Manager: Return Error

        Manager->>TxManager: Rollback Transaction
        TxManager->>DB: Rollback
        DB-->>TxManager: Rollback Complete

        Manager-->>API: Return Error
        API-->>Client: 500 Error
    else Step 2 Succeeds
        Engine->>DataAccess: Update Resource B
        DataAccess->>DB: Update Database
        DB-->>DataAccess: Update Successful
        DataAccess-->>Engine: Return Success
        Engine-->>Manager: Step 2 Complete

        Manager->>TxManager: Commit Transaction
        TxManager->>DB: Commit
        DB-->>TxManager: Commit Complete

        Manager-->>API: Return Success
        API-->>Client: 200 OK
    end
```

---

**Template Instructions**:

1. Replace all placeholder names and descriptions with actual project-specific elements
2. Ensure the sequence diagrams follow the iDesign layer principles:
   - API Controllers call Managers (Green)
   - Managers call Engines (Orange)
   - Engines call Data Access (Grey)
   - Data Access interacts with external systems
3. Include proper error handling and alternative flows in each diagram
4. Consider adding sequence diagrams for each major use case in your system
5. Use standard Mermaid sequenceDiagram syntax with proper participant labeling

[<< Back](./../design.md)
