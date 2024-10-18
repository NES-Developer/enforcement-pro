import { Offence } from "./offence";

export interface Site {
    id: number;
    address_line1: string;
    address_line2: string;
    country: string;
    county: string;
    default_extension_days: string;
    district: string;
    gdpr_url_expiry_hours: string;
    geo_color: string;
    geographical_area: string;
    logo: string;
    name: string;
    notice_charge_amount_full: number;
    notice_charge_amount_reduced: number;
    notice_charge_days_full: number;
    notice_charge_days_reduced: number;
    status: string;
    offences: Offence[];
    postal_code: string;
    region: string;
    slug: string;
    town: string;
    created_at: string;
    updated_at: string;
}
