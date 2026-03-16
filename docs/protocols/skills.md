# Skills Configuration Protocol

## Overview

This document defines the **universal skills** that all OnePersonLab agents must have installed.

---

## Universal Skills (Required)

| Skill | Purpose |
|-------|---------|
| memory-setup | Persistent memory and context |
| tavily-search | Web search |
| academic-research-hub | Academic paper search |
| self-improving | Self-reflection |
| find-skills | Discover new skills |
| nano-pdf | PDF reading/editing |

---

## Installation

```bash
clawhub install memory-setup
clawhub install tavily-search
clawhub install academic-research-hub
clawhub install self-improving
clawhub install find-skills
clawhub install nano-pdf
```

---

## Discipline-Specific Skills

Documented in [`skills_specific.md`](https://github.com/onepersonlab/onepersonlab-agents/blob/main/protocols/skills_specific.md)

**Discovery Process**:
1. Discuss with Lab-Director
2. Use `find-skills` to search
3. Test and validate
4. Install for relevant agents

---

## See Also

- [Universal Skills](../skills/universal.md)
- [Discipline-Specific Skills](https://github.com/onepersonlab/onepersonlab-agents/blob/main/protocols/skills_specific.md)
