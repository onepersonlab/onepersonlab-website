# MatBench Discovery Research

## Benchmark: Materials Stability Prediction

### Overview

**MatBench Discovery** (*Nature Machine Intelligence* 2025) is a framework for evaluating ML models in crystal stability prediction.

---

### Key Metrics

| Metric | Symbol | Direction |
|--------|--------|-----------|
| Combined Performance Score | CPS ↑ | Higher is better |
| Discovery Acceleration Factor | DAF ↑ | Higher is better |
| F1 Score | F1 ↑ | Higher is better |
| Mean Absolute Error | MAE ↓ | Lower is better |

---

### Current SOTA (2026)

| Model | CPS | DAF | Params |
|-------|-----|-----|--------|
| PET-OAM-XL | 0.898 | 6.075 | 730M |
| eSEN-30M-OAM | 0.888 | 6.069 | 30.2M |
| EquFlash | 0.888 | 5.983 | 28.7M |

---

### Research Directions

1. **Efficient Model Architecture**
   - Can we achieve SOTA with <10M parameters?
   - Model compression/distillation

2. **Data Strategy Optimization**
   - Quality vs quantity tradeoff
   - Active learning for DFT reduction

3. **Dynamic Benchmark**
   - Continuously updated test sets
   - Community-driven data contribution

---

### Resources

- **Official Site**: https://matbench-discovery.materialsproject.org/
- **Paper**: https://www.nature.com/articles/s42256-025-01055-1
- **GitHub**: https://github.com/janosh/matbench-discovery

---

[Back to Examples](../examples/index.md)
