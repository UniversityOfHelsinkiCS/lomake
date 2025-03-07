export interface Faculty {
    id: number;
    name: {
        en: string;
        fi: string;
        se: string;
    };
    code: string;
    companionStudyprogrammes: Array<{ [key: string]: any }>; // Replace with actual structure if known
    ownedProgrammes: Array<{ [key: string]: any }>; // Replace with actual structure if known
    createdAt: string;
    updatedAt: string;
}

export interface ReportData {
    Vetovoimaisuus?: string
    'Opintojen sujuvuus ja valmistuminen'?: string
    'Palaute ja työllistyminen'?: string
    'Resurssien käyttö'?: string
    Toimenpiteet?: string
}