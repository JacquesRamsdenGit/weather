[<< Back](../README.md)

## Design

The software architecture diagram(s) and design(s).

### Introduction

We leverage the iDesign software architectural principals in the design of this solution.

The below describes the layers of the system and their high-level responsibilities.

### Architecture

The architecture of the solution should be a layered one. Specifically 3 layers deep. These layers are also only allowed to depend on components adjacent of itself or down (never up - e.g. Engines shouldn't depend on managers). All components should be color coded correctly based on the description below for ease of reading.
| Layer | Description |
| --- | --- |
| Managers (Green) | These components orchestrate other code paths and often fascilitate use cases and as such would be the entry point to the application. |
| Engines (Orange) | These components perform complex operations exclusively. |
| Data Access (Grey) | These components perform IO operations exclusively. |
| Models (Purple) | These are simple data structures (DTOs) / models and occasionally enums. |

### Design Documentation

| Content                                                           | Description                              |
| ----------------------------------------------------------------- | ---------------------------------------- |
| [Use Cases](./designs/1-use-cases.md)                             | Use case diagram(s).                     |
| [High-Level System Components](./designs/2-system-components.md)  | High-level system components.            |
| [Class Diagrams](./designs/3-class.md)                            | Class diagram(s).                        |
| [Sequence Diagrams](./designs/4-sequence.md)                      | Sequence diagram(s).                     |
| [Frontend](./designs/5-frontend.md)                               | Frontend design specifications.          |

[<< Back](../README.md)
