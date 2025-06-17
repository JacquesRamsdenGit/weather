[<< Back](../README.md)

## Repo Structure
This document describes the desired repository structure. This may be used for AI coding when scaffolding the solution from scratch, for example.

### Structure
- ROOT (The repository root)
  - /.ai (AI coding framework files - the core intelligence system)
    - init.md (Main AI prompt and instructions)
    - plan.md (Generated project plan and milestones)
    - session-state.md (Current session progress tracking)
  - /.docs (The collection of repository documents and system designs etc. This directory should be documented in [README.md](../README.md) too.)
    - /designs (System designs)
      - <DESIGN_NAME>.md (A system design file)
    - <DOCUMENT_NAME>.md (a system documentation file)
  - /.github (GitHub-related content)
    - / workflows (GitHub action workflows)
      - <WORKFLOW_NAME>_workflow.yml (Singular GitHub action)
  - /.vscode (VS Code workspace settings & recommended extensions)
    - settings.json
    - extensions.json
  - /src
    - / backend (where services go)
      - / <PROJECT_NAME>.Api
      - / <PROJECT_NAME>.Core
        - / Services
          - / Managers
            ...
          - / Engines
            ...
          - / Data
            ...
      - / <PROJECT_NAME>.Shared
        - / Interfaces
          - / Managers
          - / Engines
          - / Data
            - IDatabaseContext.cs
            - ...
          - ...
        - / Const
          ...
        - / Enums
          ...
        - / Models
          ...
      - <PROJECT_NAME>.sln
    - / frontend (where frontend apps go)
    - ...
  - .gitignore
  - docker-compose.yml (Wire up the entire stack with all the dockerfiles)
  - Dockerfile.<PROJECT_NAME> (frontend / backend etc)
  - LICENSE
    - MIT
  - README.icon.png (The project thumbnail / icon)
  - README.md
    - Link to various documents in the .docs dir, in a neat table format.

# Description
This repository follows a structured approach designed for AI-enhanced software development. Each directory serves a specific purpose in the development lifecycle:

## Core Directories

### `.ai/` - AI Framework Intelligence
The heart of the AI coding framework, containing the orchestration files that guide the AI through the development process:
- **init.md**: The master prompt containing comprehensive instructions for AI agents
- **plan.md**: Auto-generated project plan with milestones and deliverables
- **session-state.md**: Live tracking of development progress and current status

### `.docs/` - Documentation Hub
Centralized location for all project documentation:
- **designs/**: System architecture and design documents following the 5-template structure
- **design.md**: Main design document with links to all architectural templates
- **repo-structure.md**: This document explaining the repository organization
- **docker-support.md**: Container setup and deployment guidelines

### `src/` - Source Code Organization
Following clean architecture principles with clear separation of concerns:
- **backend/**: API and business logic layers with proper dependency injection
- **frontend/**: User interface applications (web, mobile, desktop)

## Configuration & DevOps

### `.github/` - CI/CD Pipeline
- **workflows/**: Automated build, test, and deployment processes
- Supports containerization, security scanning, and multi-environment deployments

### `.vscode/` - Development Environment
- **settings.json**: Consistent code formatting and linting rules
- **extensions.json**: Recommended extensions for optimal development experience

## Project Files
- **README.md**: Main project documentation with quick start guide
- **docker-compose.yml**: Multi-service container orchestration
- **Dockerfile.***: Service-specific container definitions
- **.gitignore**: Version control exclusion patterns
- **LICENSE**: MIT license for open source distribution

This structure ensures that AI agents can navigate the codebase efficiently while maintaining clean separation between documentation, source code, and infrastructure components.

[<< Back](../README.md)