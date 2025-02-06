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