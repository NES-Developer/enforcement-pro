import { Offence } from "./offence";

export interface SiteOffence {
    id: number;
    charge_amount_full: number;
    charge_amount_reduced: number;
    charge_days_full: string;
    charge_days_reduced: string;
    court_fees: number;
    max_fine: number;
    offence_group_id: number;
    offence_id: number;
    site_id: number;
    status: number;
    created_at: string;
    updated_at: string;
    offences: Offence;
}
