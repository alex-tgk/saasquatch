# MCPTools Quick Start Guide

## ✅ Installation Complete

MCPTools (v0.7.1) has been successfully installed via Go.

**Binary Location**: `~/go/bin/mcptools`
**Command**: `mcp` (or `mcptools`)

## 🔧 Setup

### PATH Configuration

The Go bin directory has been added to your `~/.zshrc`. To activate it:

```bash
# Restart your terminal OR
source ~/.zshrc

# Verify installation
mcptools version
# or
mcp version
```

### Quick Test

```bash
# Show help
mcp --help

# Check version
mcp version
```

## 🚀 Key Commands for SaaSaaS Project

### 1. Create New MCP Components

```bash
# Create a new tool
mcp new tool:calculate --sdk=ts --transport=stdio

# Create multiple components at once
mcp new tool:hello_world resource:file prompt:greet

# Specify TypeScript SDK
mcp new tool:myTool --sdk=ts

# Specify transport type
mcp new tool:myTool --transport=stdio   # For CLI tools
mcp new tool:myTool --transport=sse     # For HTTP servers
```

**Use Case for SaaSaaS**:
```bash
# Scaffold CLI command structure
mcp new tool:init --sdk=ts --transport=stdio
mcp new tool:generate --sdk=ts --transport=stdio
mcp new resource:config --sdk=ts
```

### 2. Manage MCP Server Aliases

```bash
# Add a server alias (saves typing long commands)
mcp alias add myfs npx -y @modelcontextprotocol/server-filesystem ~/

# List all aliases
mcp alias list

# Remove an alias
mcp alias remove myfs

# Use an alias
mcp tools myfs
```

**Use Case for SaaSaaS**:
```bash
# Create aliases for testing generated services
mcp alias add auth-test npx @saasquatch/auth-service
mcp alias add user-test npx @saasquatch/user-service

# Test tools on services
mcp tools auth-test
mcp tools user-test
```

### 3. Interact with MCP Servers

```bash
# List available tools
mcp tools <server-command>

# List available resources
mcp resources <server-command>

# List available prompts
mcp prompts <server-command>

# Call a tool
mcp call <tool-name> --params '{"key":"value"}' <server-command>

# Read a resource
mcp read-resource <resource-uri> <server-command>
```

**Example**:
```bash
# List tools from filesystem server
mcp tools npx -y @modelcontextprotocol/server-filesystem ~

# Read a file
mcp call read_file --params '{"path":"README.md"}' \
  npx -y @modelcontextprotocol/server-filesystem ~
```

### 4. Interactive Shell

```bash
# Start interactive shell for a server
mcp shell <server-command>

# Example
mcp shell npx -y @modelcontextprotocol/server-filesystem ~
```

**Use Case for SaaSaaS**:
```bash
# Interactive exploration of generated service capabilities
mcp shell npx @saasquatch/cli
```

### 5. Web Interface

```bash
# Start web interface for MCP commands
mcp web <server-command>

# Example
mcp web npx -y @modelcontextprotocol/server-filesystem ~
```

### 6. Mock MCP Server

```bash
# Create a mock server for testing
mcp mock
```

**Use Case for SaaSaaS**:
- Test CLI tool behavior
- Prototype MCP interactions
- Development testing

### 7. Proxy MCP Requests to Shell Scripts

```bash
# Proxy MCP tool requests to shell scripts
mcp proxy
```

### 8. Server Configurations

```bash
# Manage MCP server configurations
mcp configs --help
```

## 📋 Common Workflows for SaaSaaS

### Workflow 1: Scaffold New CLI Command

```bash
# 1. Create tool structure
mcp new tool:init --sdk=ts --transport=stdio

# 2. Create related resources
mcp new resource:project_config --sdk=ts

# 3. Create prompts for guidance
mcp new prompt:setup_guide --sdk=ts
```

### Workflow 2: Test Generated Services

```bash
# 1. Create alias for service
mcp alias add auth npx @saasquatch/auth-service

# 2. List available tools
mcp tools auth

# 3. Test specific tool
mcp call register --params '{"email":"test@example.com","password":"pass123"}' auth

# 4. Interactive testing
mcp shell auth
```

### Workflow 3: Develop with Web Interface

```bash
# Start web UI for visual development
mcp web npx @saasquatch/cli

# Opens browser interface for:
# - Exploring tools
# - Testing calls
# - Viewing resources
# - Running prompts
```

## 🎯 SaaSaaS-Specific Use Cases

### 1. CLI Tool Development (Week 1)

```bash
# Create CLI command structure
cd packages/cli
mcp new tool:init tool:add tool:generate --sdk=ts --transport=stdio

# Create config resources
mcp new resource:saasquatch_config resource:template_list --sdk=ts

# Create interactive prompts
mcp new prompt:project_setup prompt:database_choice --sdk=ts
```

### 2. Template Generation Testing (Week 2)

```bash
# Test Fastify service templates
mcp alias add fastify-test npx @saasquatch/templates/auth-service

# List generated tools
mcp tools fastify-test

# Test auth endpoints
mcp call login --params '{"email":"test@example.com","password":"pass123"}' fastify-test
```

### 3. Service Integration Testing (Week 3)

```bash
# Create aliases for all services
mcp alias add auth npx @saasquatch/auth-service
mcp alias add users npx @saasquatch/user-service
mcp alias add gateway npx @saasquatch/api-gateway

# Test multi-service flows
mcp shell auth
> call register
> call login
> [copy JWT token]

mcp shell users
> call list_users [with JWT from auth]
```

### 4. Documentation Testing (Week 4)

```bash
# Verify OpenAPI docs are exposed
mcp resources auth

# Read API documentation
mcp read-resource api://docs auth
```

## 🎨 Output Formats

```bash
# Table format (default)
mcp tools <server>

# JSON format
mcp tools <server> -f json

# Pretty JSON format
mcp tools <server> -f pretty
```

## 📁 Configuration Files

### Aliases File
**Location**: `~/.mcpt/aliases.json`

```json
{
  "auth": "npx @saasquatch/auth-service",
  "users": "npx @saasquatch/user-service",
  "gateway": "npx @saasquatch/api-gateway"
}
```

## 🔍 Debugging

```bash
# Verbose output for debugging
mcp tools <server> -f pretty

# Test with mock server
mcp mock

# Interactive exploration
mcp shell <server>
```

## 📚 Additional Resources

- **GitHub**: https://github.com/f/mcptools
- **MCP Specification**: https://modelcontextprotocol.io
- **TypeScript SDK**: https://github.com/modelcontextprotocol/typescript-sdk

## 🚀 Next Steps for SaaSaaS

1. **Week 1 - CLI Foundation**:
   ```bash
   cd packages/cli
   mcp new tool:init tool:add --sdk=ts --transport=stdio
   ```

2. **Week 2 - Fastify Templates**:
   - Add MCP support to generated services
   - Test with `mcp tools` and `mcp call`

3. **Week 3 - Integration**:
   - Create aliases for all services
   - Test multi-service workflows

4. **Week 4 - Documentation**:
   - Expose OpenAPI as MCP resources
   - Generate MCP-aware documentation

---

**Installation Date**: 2025-10-30
**Version**: v0.7.1
**Status**: ✅ Ready to use
