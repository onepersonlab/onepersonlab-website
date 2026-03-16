# Universal Skills

## Overview

All OnePersonLab agents have **6 universal skills** installed by default.

---

## Skills List

| Skill | Purpose | Configuration |
|-------|---------|---------------|
| **memory-setup** | Persistent memory and context | `~/.openclaw/openclaw.json` |
| **tavily-search** | Web search for current information | API key required |
| **academic-research-hub** | Academic paper search | API keys for services |
| **self-improving** | Self-reflection and learning | Automatic |
| **find-skills** | Discover new skills | Automatic |
| **nano-pdf** | PDF reading and editing | Automatic |

---

## Installation

```bash
# Install all universal skills
clawhub install memory-setup
clawhub install tavily-search
clawhub install academic-research-hub
clawhub install self-improving
clawhub install find-skills
clawhub install nano-pdf

# Verify installation
clawhub list
```

---

## Configuration

### memory-setup

Enable in `~/.openclaw/openclaw.json`:

```json
{
  "agents": {
    "defaults": {
      "memorySearch": {
        "enabled": true,
        "provider": "local",
        "sources": ["memory", "sessions"]
      }
    }
  }
}
```

### tavily-search

```bash
export TAVILY_API_KEY="your-api-key"
```

---

## Discipline-Specific Skills

Discovered via `find-skills` based on project needs:

```
"Find skills for [your task description]"
```

Examples:
- "Find skills for RNA-seq analysis"
- "Find skills for molecular generation"
- "Find skills for climate modeling"

---

## See Also

- [Skills Configuration Protocol](../protocols/skills.md)
- [Discipline-Specific Skills](../protocols/skills-specific.md)
