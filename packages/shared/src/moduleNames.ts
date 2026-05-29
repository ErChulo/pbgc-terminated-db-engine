/**
 * Canonical module name constants for engine slices.
 * Used as the single source of truth for module_name values in StructuredIssue, ModuleTrace, etc.
 */
export const DATE_RESOLUTION_MODULE_NAME = "date_resolution" as const;
export const SERVICE_RESOLUTION_MODULE_NAME = "service_resolution" as const;
export const COMPENSATION_RESOLUTION_MODULE_NAME = "compensation_resolution" as const;
export const FORM_RESOLUTION_MODULE_NAME = "form_resolution" as const;
export const BENEFIT_KERNEL_MODULE_NAME = "benefit_kernel" as const;
export const V1_VE_OUTPUT_MODULE_NAME = "v1_ve_output" as const;
export const VALUATION_LISTINGS_OUTPUT_MODULE_NAME = "valuation_listings_output" as const;
export const BSRS_CONFIGURATION_OUTPUT_MODULE_NAME = "bsrs_configuration_output" as const;

export type EngineModuleName =
  | typeof DATE_RESOLUTION_MODULE_NAME
  | typeof SERVICE_RESOLUTION_MODULE_NAME
  | typeof COMPENSATION_RESOLUTION_MODULE_NAME
  | typeof FORM_RESOLUTION_MODULE_NAME
  | typeof BENEFIT_KERNEL_MODULE_NAME
  | typeof V1_VE_OUTPUT_MODULE_NAME
  | typeof VALUATION_LISTINGS_OUTPUT_MODULE_NAME
  | typeof BSRS_CONFIGURATION_OUTPUT_MODULE_NAME;
