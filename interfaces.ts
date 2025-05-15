export interface Quote{
    _id: string;
    dialog: string;
    movie_id: string;
    character_id: string;
    id: string;
}

export interface Character {
    _id: string;
    name: string;
    wikiUrl: string;
    race: string;
    birth: string;
    gender: string;
    death: string;
    hair: string;
    height: string;
    realm: string;
    spouse: string;
}

export interface Movie {
    _id: string;
    name: string;
    runtimeInMinutes: number;
    budgetInMillions: number;
    boxOfficeRevenueInMillions: number;
    academyAwardNominations: number;
    academyAwardWins: number;
    rottenTomatoesScore: number;
}
