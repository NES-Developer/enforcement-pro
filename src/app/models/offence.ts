import { OffenceGroup } from "./offence-group";

export interface Offence {
    id: number;
    name: string;
    welshName: string;
    description: string;
    welshDescription: string;
    welshLegislation: number;
    englishLegislation: number;
    group: number;
    minImageRequired: string;
    maxFine: string;
    issueType: number;
    status: string;
    created_at: string;
    updated_at: string;
    engLegislation: any;
    welLegislation: any;
    offenceGroup: OffenceGroup;
}