# Agents Overview

## Hierarchical Structure

OnePersonLab-Agents uses a **three-tier hierarchy**:

```
Lab-Director → PI → Postdoc → Students
```

---

## Lab-Director

**Role**: Central coordinator for the entire virtual laboratory.

**Responsibilities**:
- Activate appropriate agent combinations
- Route tasks to suitable PIs
- Coordinate cross-disciplinary collaboration
- Track progress across all agents
- Manage shared resource pool

**Key Feature**: Skills configuration is a priority task before any project begins.

---

## Principal Investigators (PIs)

Each discipline has one PI leading the research team:

| PI ID | Discipline | Postdocs | Students |
|-------|------------|----------|----------|
| CS-PI | Computer Science | 8 | 17 |
| CHEM-PI | Chemistry | 8 | 16 |
| BIO-PI | Biology | 8 | 17 |
| MAT-PI | Materials Science | 6 | 12 |
| ENV-PI | Environmental Science | 7 | 14 |
| AGR-PI | Agriculture | 7 | 14 |
| ENG-PI | Engineering | 8 | 14 |
| MED-PI | Medicine | 7 | 13 |
| ECON-PI | Economics | 6 | 12 |
| PSYCH-PI | Psychology | 7 | 12 |
| DS-PI | Data Science | 6 | 12 |

---

## Postdocs

Each postdoc specializes in a specific research area and mentors 2-4 students.

**Example**: BIO-PD-MOL (Molecular Biology)
- **Specialty**: Molecular Biology, Gene Editing
- **Students**: BIO-GR-01-GENO, BIO-GR-02-PROT
- **Research Focus**: CRISPR systems, epigenetic modifications

---

## Students

Graduate students (PhD/Master) working on specific research topics under postdoc mentorship.

**Ratio**: Average 2 students per postdoc (range: 2-4)

---

## Navigation

- [Biology Agents](agents/biology.md)
- [Chemistry Agents](agents/chemistry.md)
- [Computer Science Agents](agents/computer-science.md)
- [More disciplines...](#principal-investigators-pis)
