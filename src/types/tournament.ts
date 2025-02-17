export interface Tournament {
    _id: string;
    name: string;
    startDate: string;
    endDate: string;
    team: string;
    status: 'draft' | 'active' | 'completed';
    maxTeams: number;
    description: string;
}

export interface CreateTournamentInput {
    name: string;
    startDate: string;
    endDate: string;
    maxTeams: number;
    description: string;
    team: string;
}

export interface UpdateTournamentInput extends Partial<CreateTournamentInput> {
    id: string;
}