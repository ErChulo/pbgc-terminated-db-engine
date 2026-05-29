/**
 * BSRS Packet View component.
 * Renders a summary view of a BSRS configuration output packet including
 * metadata, key fields, conditional branch indicators, and trace/warning summaries.
 */
import type { BsrsConfigurationOutputArtifact, BsrsConfigurationOutputResult } from "@pbgc/bsrs-configuration-output";

export type BsrsPacketViewProps = {
  result: BsrsConfigurationOutputResult;
  showTrace?: boolean;
  showConditionalFields?: boolean;
};

function escapeHtml(value: string | number | boolean | null | undefined): string {
  return String(value ?? "").replace(/[&<>"']/g, (char) => {
    switch (char) {
      case "&": return "&amp;";
      case "<": return "&lt;";
      case ">": return "&gt;";
      case '"': return "&quot;";
      default: return "&#39;";
    }
  });
}

function renderConditionalFields(result: BsrsConfigurationOutputResult): string {
  if (!result.output) return "";
  const row = result.output.row;

  type FieldEntry = { label: string; value: unknown; branch: string };
  const conditionalFields: FieldEntry[] = [
    { label: "Form Code ARD", value: row.form_code_ard, branch: "in_pay" },
    { label: "SPC ARD", value: row.spc_ard, branch: "in_pay" },
    { label: "Months ARD", value: row.mths_ard, branch: "in_pay" },
    { label: "Level MB ARD", value: row.lev_mb_ard, branch: "in_pay" },
    { label: "Survivor Amount", value: row.xrd_surv_mb_term, branch: "survivor" },
    { label: "QPSA Amount", value: row.xrd_mb_qpsa_term, branch: "qpsa" },
    { label: "Recalc Reason", value: row.recalculation_reason_code, branch: "qdro/qpsa" },
    { label: "Suppression Reason", value: row.suppression_reason_code, branch: "suppressed" },
  ];

  return `
    <details class="bsrs-packet-section">
      <summary>Conditional Fields</summary>
      <dl class="bsrs-conditional-fields">
        ${conditionalFields
          .filter((f) => f.value !== undefined)
          .map((f) => `
            <div class="bsrs-conditional-field ${f.value === null ? "is-null" : "is-populated"}">
              <dt>${escapeHtml(f.label)} <span class="bsrs-branch-tag">${escapeHtml(f.branch)}</span></dt>
              <dd>${f.value === null ? '<em>explicit null</em>' : escapeHtml(String(f.value))}</dd>
            </div>
          `).join("")}
      </dl>
    </details>
  `;
}

export function renderBsrsPacketView(props: BsrsPacketViewProps): string {
  const { result, showTrace = false, showConditionalFields = false } = props;
  const output = result.output;
  const row = output?.row;
  const metadata = output?.metadata;

  if (!output || !row || !metadata) {
    return `
      <div class="bsrs-packet-view bsrs-packet-failed">
        <strong>Run failed</strong>
        <p>No output packet produced for ${escapeHtml(result.calculation_run_id)}</p>
        ${result.errors.length > 0 ? `
          <ul class="bsrs-packet-errors">
            ${result.errors.map((e) => `<li><code>${escapeHtml(e.code)}</code> ${escapeHtml(e.message)}</li>`).join("")}
          </ul>
        ` : ""}
      </div>
    `;
  }

  return `
    <div class="bsrs-packet-view ${result.run_status === "failed" ? "bsrs-packet-failed" : "bsrs-packet-completed"}">
      <header class="bsrs-packet-header">
        <div class="bsrs-packet-meta">
          <h3>BSRS Configuration Packet</h3>
          <span class="bsrs-run-id">Run: ${escapeHtml(result.calculation_run_id)}</span>
          <span class="bsrs-status-badge ${result.run_status}">${escapeHtml(result.run_status)}</span>
        </div>
        <div class="bsrs-packet-stats">
          <span class="bsrs-warning-count ${result.warning_count > 0 ? "has-warnings" : ""}">Warnings: ${result.warning_count}</span>
          <span class="bsrs-error-count ${result.error_count > 0 ? "has-errors" : ""}">Errors: ${result.error_count}</span>
          <span class="bsrs-trace-count">Traces: ${result.traces.length}</span>
        </div>
      </header>

      <section class="bsrs-packet-section bsrs-packet-identity">
        <h4>Case Identity</h4>
        <dl class="bsrs-dl-grid">
          <div class="bsrs-dl-item"><dt>Case ID</dt><dd>${escapeHtml(metadata.case_id)}</dd></div>
          <div class="bsrs-dl-item"><dt>Plan ID</dt><dd>${escapeHtml(metadata.plan_id)}</dd></div>
          <div class="bsrs-dl-item"><dt>BCV Rec ID</dt><dd>${escapeHtml(metadata.bcv_rec_id)}</dd></div>
          <div class="bsrs-dl-item"><dt>Statement Row Type</dt><dd>${escapeHtml(metadata.statement_row_type)}</dd></div>
          <div class="bsrs-dl-item"><dt>Sort Key</dt><dd>${escapeHtml(metadata.statement_sort_key)}</dd></div>
          <div class="bsrs-dl-item"><dt>Adapter Version</dt><dd>${escapeHtml(metadata.adapter_version)}</dd></div>
        </dl>
      </section>

      <section class="bsrs-packet-section bsrs-packet-benefit">
        <h4>Benefit Summary</h4>
        <dl class="bsrs-dl-grid">
          <div class="bsrs-dl-item"><dt>Current Payment</dt><dd>${escapeHtml(row.current_payment_amount)}</dd></div>
          <div class="bsrs-dl-item"><dt>Term MB NRD NSF</dt><dd>${escapeHtml(row.term_mb_nrd_nsf)}</dd></div>
          <div class="bsrs-dl-item"><dt>XRD MB Term</dt><dd>${escapeHtml(row.xrd_mb_term)}</dd></div>
          <div class="bsrs-dl-item"><dt>PVMB Term</dt><dd>${escapeHtml(row.pvmb_term)}</dd></div>
          <div class="bsrs-dl-item"><dt>PVMB Title IV</dt><dd>${escapeHtml(row.pvmb_title_iv)}</dd></div>
          <div class="bsrs-dl-item"><dt>PVMB 4022c</dt><dd>${escapeHtml(row.pvmb_4022c)}</dd></div>
        </dl>
      </section>

      <section class="bsrs-packet-section bsrs-packet-form">
        <h4>Form & Statement Status</h4>
        <dl class="bsrs-dl-grid">
          <div class="bsrs-dl-item"><dt>Form Code NSF</dt><dd>${escapeHtml(row.form_code_nsf)}</dd></div>
          <div class="bsrs-dl-item"><dt>Form Code NMF</dt><dd>${escapeHtml(row.form_code_nmf)}</dd></div>
          <div class="bsrs-dl-item"><dt>Annuity Status</dt><dd>${escapeHtml(row.annuity_status_pay)}</dd></div>
          <div class="bsrs-dl-item"><dt>Statement Type</dt><dd>${escapeHtml(row.statement_type_code)}</dd></div>
          <div class="bsrs-dl-item"><dt>Statement Status</dt><dd>${escapeHtml(row.statement_status_code)}</dd></div>
          <div class="bsrs-dl-item"><dt>Population</dt><dd>${escapeHtml(row.statement_population_indicator)}</dd></div>
        </dl>
      </section>

      ${showConditionalFields ? renderConditionalFields(result) : ""}

      ${result.warnings.length > 0 ? `
        <section class="bsrs-packet-section bsrs-packet-warnings">
          <h4>Warnings</h4>
          <ul class="bsrs-warning-list">
            ${result.warnings.map((w) => `<li><code>${escapeHtml(w.code)}</code> ${escapeHtml(w.message)}</li>`).join("")}
          </ul>
        </section>
      ` : ""}

      ${showTrace && result.traces.length > 0 ? `
        <section class="bsrs-packet-section bsrs-packet-trace">
          <h4>Trace Records (${result.traces.length})</h4>
          <div class="bsrs-trace-summary">
            ${result.traces.slice(0, 10).map((t) => `
              <div class="bsrs-trace-item">
                <span class="bsrs-trace-field">${escapeHtml(t.field_name)}</span>
                <span class="bsrs-trace-rule">${escapeHtml(t.rule_applied)}</span>
                <span class="bsrs-trace-value">${escapeHtml(t.output_value)}</span>
              </div>
            `).join("")}
            ${result.traces.length > 10 ? `<em>… and ${result.traces.length - 10} more traces</em>` : ""}
          </div>
        </section>
      ` : ""}
    </div>
  `;
}
