export interface Team {
    id: string;
    name: string;
    description?: string;
    members: { id: string; name: string }[];
  }
  