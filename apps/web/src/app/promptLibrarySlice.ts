export type PromptDraftStatus = "baseline" | "edited" | "imported" | "invalid";

export type StagePromptEntry = {
  prompt_id: string;
  stage_key: string;
  title: string;
  body: string;
  basis: string;
  boundary_notice: string;
  ordering_key: string;
};

export type PromptDraftState = {
  selected_prompt_id: string;
  draft_text: string;
  status: PromptDraftStatus;
  validation_message: string;
  basis: string;
};

export type PromptLibraryState = {
  prompts: StagePromptEntry[];
  selected_prompt: StagePromptEntry;
  draft: PromptDraftState;
  boundary_notice: string;
};

const PROMPT_BOUNDARY_NOTICE =
  "External LLM boundary: use these prompts with an external LLM outside this app. No OCR, in-app scraping, source interpretation, or network LLM calls occur here.";
const PROMPT_DRAFT_BASIS = "browser-local prompt draft display state";
const PROMPT_IMPORT_LIMIT = 5000;

const PROMPTS = [
  ["case_workspace", "Case Workspace Prompt", "Summarize the mocked case workspace context and list reviewed structured inputs needed for the current stage."],
  ["reconciliation_workbench", "Reconciliation Workbench Prompt", "Compare existing BSRS, V1/VE, and valuation listing evidence from approved samples and identify reconciliation questions."],
  ["prompt_library", "Prompt Library Prompt", "Review stage-specific prompts and propose edits without including real natural-person data."],
  ["schema_library", "Schema Library Prompt", "Inspect reviewed structured input schemas and list validation questions for mocked approved samples only."],
  ["pbgc_template_library", "PBGC Template Library Prompt", "Review PBGC template requirements and identify fields that should be filled from approved structured data."],
  ["upload_import", "Upload Import Prompt", "Prepare external-LLM structured artifact import notes without running OCR or scraping inside the app."],
  ["reviewed_input_approval", "Reviewed Input Approval Prompt", "Identify reviewed facts that need human approval before deterministic engine input packets are accepted."],
  ["template_filling_export", "Template Filling Export Prompt", "Map approved structured data into template sections and list unresolved fields for analyst review."],
  ["unresolved_issues", "Unresolved Issues Prompt", "Summarize missing fields, validation issues, and unresolved mappings from mocked approved samples."],
  ["sample_mock_packs", "Sample Mock Packs Prompt", "Describe approved sample and mock data pack coverage without real participant or beneficiary data."],
] as const;

export function buildPromptLibrary(
  options: {
    selected_prompt_id?: string;
    draft_text?: string;
    import_payload?: string;
  } = {},
): PromptLibraryState {
  const prompts = PROMPTS.map(([stageKey, title, body], index) => ({
    prompt_id: `prompt-${stageKey.replaceAll("_", "-")}`,
    stage_key: stageKey,
    title,
    body,
    basis: "committed alpha prompt baseline",
    boundary_notice: PROMPT_BOUNDARY_NOTICE,
    ordering_key: `${String(index + 1).padStart(6, "0")}|${stageKey}`,
  }));
  const importResult = parsePromptImport(options.import_payload);
  const requestedPromptId =
    importResult.status === "imported" && importResult.stage_key
      ? `prompt-${importResult.stage_key.replaceAll("_", "-")}`
      : options.selected_prompt_id;
  const selectedPrompt = prompts.find((prompt) => prompt.prompt_id === requestedPromptId) ?? prompts[0];
  const draft = buildPromptDraft(selectedPrompt, options.draft_text, importResult);
  return {
    prompts,
    selected_prompt: selectedPrompt,
    draft,
    boundary_notice: PROMPT_BOUNDARY_NOTICE,
  };
}

function buildPromptDraft(
  selectedPrompt: StagePromptEntry,
  draftText: string | undefined,
  importResult: { status: PromptDraftStatus; text: string; validation_message: string; stage_key: string | null },
): PromptDraftState {
  if (importResult.status === "imported" || importResult.status === "invalid") {
    return {
      selected_prompt_id: selectedPrompt.prompt_id,
      draft_text: importResult.text,
      status: importResult.status,
      validation_message: importResult.validation_message,
      basis: PROMPT_DRAFT_BASIS,
    };
  }
  if (draftText && draftText.trim()) {
    return {
      selected_prompt_id: selectedPrompt.prompt_id,
      draft_text: draftText,
      status: "edited",
      validation_message: "Browser-local draft is not approved baseline prompt text.",
      basis: PROMPT_DRAFT_BASIS,
    };
  }
  return {
    selected_prompt_id: selectedPrompt.prompt_id,
    draft_text: selectedPrompt.body,
    status: "baseline",
    validation_message: "Approved baseline prompt is selected.",
    basis: "committed alpha prompt baseline",
  };
}

function parsePromptImport(payload: string | undefined): {
  status: PromptDraftStatus;
  text: string;
  validation_message: string;
  stage_key: string | null;
} {
  if (!payload) return { status: "baseline", text: "", validation_message: "", stage_key: null };
  const trimmed = payload.trim();
  if (!trimmed) {
    return { status: "invalid", text: "", validation_message: "Prompt import is empty.", stage_key: null };
  }
  if (trimmed.length > PROMPT_IMPORT_LIMIT) {
    return { status: "invalid", text: "", validation_message: "Prompt import exceeds the alpha size limit.", stage_key: null };
  }
  try {
    const parsed = JSON.parse(trimmed) as { stage_key?: string; prompt_text?: string };
    if (typeof parsed.prompt_text === "string" && parsed.prompt_text.trim()) {
      return {
        status: "imported",
        text: parsed.prompt_text,
        validation_message: "Local prompt import accepted as browser-local draft.",
        stage_key: parsed.stage_key ?? null,
      };
    }
  } catch {
    // Plain text imports are accepted below.
  }
  return {
    status: "imported",
    text: trimmed,
    validation_message: "Local prompt import accepted as browser-local draft.",
    stage_key: null,
  };
}
