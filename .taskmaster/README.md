# Task Master - SaaSquatch Project

Task management system for the SaaSquatch CLI project.

## Quick Start

### View All Tasks
```bash
cat .taskmaster/tasks.json | jq '.tasks'
```

### Task Status
- `pending` - Not started
- `in_progress` - Currently being worked on
- `review` - Ready for review
- `completed` - Done
- `blocked` - Waiting on dependencies

## Project Structure

```
.taskmaster/
├── tasks.json      # All project tasks
├── config.json     # Task Master configuration
└── README.md       # This file
```

## Current Project: SaaSquatch

**Description:** Production-ready CLI tool for generating Fastify microservices

**Phase:** Week 1 - CLI Foundation (Complete)
**Next:** Week 2 - Fastify Auth Service Template

## Integration with Claude Code

Task Master integrates with Claude Code's TodoWrite tool for seamless task tracking during development sessions.
