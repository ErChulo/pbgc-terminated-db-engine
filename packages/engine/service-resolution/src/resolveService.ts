import { resolvePlanYearService } from "./serviceMath";
import type { ServiceResolutionPacket, ServiceResolutionValues } from "./types";

export function resolveService(packet: ServiceResolutionPacket): ServiceResolutionValues {
  const resolvedService = resolvePlanYearService(packet);
  return {
    eligibility_service_resolved: resolvedService,
    vesting_service_resolved: resolvedService,
    benefit_service_resolved: resolvedService,
    accrual_service_resolved: resolvedService,
  };
}
