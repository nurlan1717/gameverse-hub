export interface Tournament {
    _id: string;
    name: string;
    startDate: string;
    endDate: string;
    game: string;
    team: string;
    status: 'draft' | 'active' | 'completed';
    maxTeams: number;
    description: string;
    tournamentLogo: string;
}

export interface CreateTournamentInput {
    name: string;
    startDate: string;
    endDate: string;
    game: string;
    maxTeams: number;
    description: string;
    team: string;
}

export interface UpdateTournamentInput extends Partial<CreateTournamentInput> {
    id: string;
}