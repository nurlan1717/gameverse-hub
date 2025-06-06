export interface Game {
        _id: string;
        title: string;
        description: string;
        coverPhotoUrl: string;
        videoTrailerUrl: string;
        averageRating: number;
        systemRequirements: string;
        freeWeekly: boolean;
        approved: boolean;
        developerId: string;
        sales: number;
        createdAt: Date;
        updatedAt: Date;
        price: number;
        platform: string;
        genre: string;
}
