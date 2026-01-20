export type PetId = string;

export type PetPhoto = {
    id: string;
    nome: string;
    contentType: string;
    url: string;
};

export type Pet = {
    id: PetId;
    nome: string;
    idade: number;
    raca?: string;
    tutorId?: string;
    foto?: PetPhoto;
}

export type PetUpsertInput = {
    nome: string;
    idade: number;
    raca?: string;
}