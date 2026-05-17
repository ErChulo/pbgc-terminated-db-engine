# Benefit Kernel Slice v0.1.0

The fifth executable slice adds `packages/engine/benefit-kernel/` on top of the
existing browser-only Vite and sql.js foundation. It consumes only reviewed
benefit input packets and upstream deterministic outputs, then writes
deterministic benefit outputs to `benefit_kernel_output`.

The MVP fixture path supports BK001 as the populated final-average-pay case.
BK002 and BK003 remain deterministic unsupported branches that return explicit
null outputs with warnings rather than fallback benefit amounts.

Trace rows are written for each populated benefit output with upstream module
references, rule version, branch indicators, limitation flags, present-value
basis, and downstream adapter suppression notes.
