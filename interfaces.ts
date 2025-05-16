import { ObjectId } from "mongodb"

export interface Quote {
    _id: string,
    dialog: string,
    movie_id: string,
    character_id: string,
    id: string
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

export interface User{
    _id?:ObjectId
    username:string,
    password?:string,
    highscore: number,
    favorite_character?: string;
    favorite_movie?: string; 
    favoriteQuotesId: string[];
    blacklistedQuotedId: string[];
}

export interface QuizResult {
    questionNumber: number;
    quote: Quote;
    userAnswer: {
        character: string;
        movie: string;
    };
    correctAnswer: {
        character: string;
        movie: string;
    };
    isCorrect: boolean;
}

export interface Quiz {
    _id?: ObjectId;
    userId: string;
    startTime: Date;
    endTime?: Date;
    score: number;
    completed: boolean;
    results: QuizResult[];
}