/**
 * Platform-wide operating objectives — fixed across every course, never
 * entered per-customer. Matches the architecture doc's "336 playable days,
 * ≤24hr equipment downtime" targets, plus the tee-sheet/tanker constants
 * that stay the same regardless of which course is being assessed.
 */
export const PLAYABLE_DAYS_PER_YEAR = 336
export const DAYS_PER_YEAR = 365
export const SLOT_INTERVAL_MINUTES = 10
export const PLAYERS_PER_TEE_TIME = 4
/** Default tanker capacity seeded into a new Customer Input Card; editable per customer. */
export const TANKER_CAPACITY_LITERS = 20_000
export const WATER_REFILL_INTERVAL_DAYS = 15
export const EQUIPMENT_DOWNTIME_TARGET = '≤ 24 hrs'
