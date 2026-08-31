/**
 * Platform-wide operating objectives — fixed across every course, never
 * entered per-customer. Matches the architecture doc's "336 playable days,
 * ≤24hr equipment downtime" targets, plus the tee-sheet/tanker constants
 * that stay the same regardless of which course is being assessed.
 */
export const PLAYABLE_DAYS_PER_YEAR = 336
export const SLOT_INTERVAL_MINUTES = 10
export const PLAYERS_PER_TEE_TIME = 4
/** Default tanker capacity seeded into a new Customer Input Card; editable per customer. */
export const TANKER_CAPACITY_LITERS = 20_000
export const EQUIPMENT_DOWNTIME_TARGET = '≤ 24 hrs'

/** Cart-economics defaults seeded into a new Customer Input Card; all editable per customer. */
export const CART_HOURS_PER_TEE_ROUND_DEFAULT = 4
export const PLAYERS_PER_CART_DEFAULT = 2
export const CART_REVENUE_PER_ROUND_DEFAULT = 1_000
export const CART_COST_DEFAULT = 800_000
