# 👨‍🔬🤖🤖🤖 OnePersonLab-Agents

## A Multi-Agent System for Interdisciplinary Research

**OnePersonLab-Agents** enables a single researcher to coordinate an entire virtual laboratory of AI-powered agents, each specializing in different scientific disciplines.

---

## 🎯 Quick Start

### 1. Install Universal Skills

```bash
# Install required skills
clawhub install memory-setup
clawhub install tavily-search
clawhub install academic-research-hub
clawhub install self-improving
clawhub install find-skills
clawhub install nano-pdf
```

### 2. Start a Conversation

```
You are now the Lab-Director of my OnePersonLab.
Based on my research goal, please configure and activate the required agent team.
```

### 3. Describe Your Research

```
I want to build an AI-driven drug discovery platform.
I need expertise in chemistry, biology, and machine learning.
```

**That's it!** Your research team is assembled and ready.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Lab-Director                         │
│              (Central Coordinator)                      │
└─────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
   ┌─────────┐          ┌─────────┐          ┌─────────┐
   │   CS    │          │  BIO    │          │  CHEM   │
   │   PI    │          │   PI    │          │   PI    │
   └────┬────┘          └────┬────┘          └────┬────┘
        │                    │                    │
   ┌────┴────┐          ┌────┴────┐          ┌────┴────┐
   │Postdocs │          │Postdocs │          │Postdocs │
   │Students │          │Students │          │Students │
   └─────────┘          └─────────┘          └─────────┘
```

**11 Disciplines** · **78 Postdocs** · **153 Students** · **242 Total Agents**

---

## 📊 Available Disciplines

### Core Sciences

| Discipline | PI ID | Postdocs | Students |
|------------|-------|----------|----------|
| 🖥️ Computer Science | CS-PI | 8 | 17 |
| 🧪 Chemistry | CHEM-PI | 8 | 16 |
| 🧬 Biology | BIO-PI | 8 | 17 |
| 🔩 Materials Science | MAT-PI | 6 | 12 |
| 🌍 Environmental Science | ENV-PI | 7 | 14 |
| 🌾 Agriculture | AGR-PI | 7 | 14 |
| ⚙️ Engineering | ENG-PI | 8 | 14 |

### Expanded Disciplines

| Discipline | PI ID | Postdocs | Students |
|------------|-------|----------|----------|
| 🏥 Medicine | MED-PI | 7 | 13 |
| 📈 Economics | ECON-PI | 6 | 12 |
| 🧠 Psychology | PSYCH-PI | 7 | 12 |
| 📊 Data Science | DS-PI | 6 | 12 |

---

## 🛠️ Skills System

### Universal Skills (Required)

All agents have these core capabilities:

| Skill | Purpose |
|-------|---------|
| **memory-setup** | Persistent memory and context |
| **tavily-search** | Web search for current information |
| **academic-research-hub** | Academic paper search |
| **self-improving** | Self-reflection and learning |
| **find-skills** | Discover new skills |
| **nano-pdf** | PDF reading and editing |

### Discipline-Specific Skills

Discovered via `find-skills` and configured through Lab-Director consultation.

---

## 📚 Documentation

- **[Agents]**(agents/overview.md) - Learn about the agent hierarchy
- **[Skills]**(skills/universal.md) - Understand the skills system
- **[Protocols]**(protocols/communication.md) - Communication protocols
- **[Examples]**(examples/single-discipline.md) - See real use cases

---

## 🚀 Get Started

Ready to build your virtual research team?

[View Quick Start Guide](#quick-start){ .md-button .md-button--primary }

[Explore Agents](agents/overview.md){ .md-button }

---

## 📖 Citation

If you use OnePersonLab-Agents in your research, please cite:

```bibtex
@software{onepersonlab2026,
  title = {OnePersonLab-Agents: A Multi-Agent System for Interdisciplinary Research},
  author = {OnePersonLab Team},
  year = {2026},
  url = {https://github.com/onepersonlab/onepersonlab-agents}
}
```

---

## 🤝 Community

- **GitHub**: [onepersonlab/onepersonlab-agents](https://github.com/onepersonlab/onepersonlab-agents)
- **Discord**: [Join our community](https://discord.gg/clawd)
- **Documentation**: [docs.openclaw.ai](https://docs.openclaw.ai)

---

**License**: MIT · **Built with**: [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/)
