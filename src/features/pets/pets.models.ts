export type PetId = string;

export type Pet = {
    id: PetId;
    nome: string;
    especie: string;
    idade: number;
    raca?: string;
    tutorId?: string;
    fotoUrl?: string;
}

export type PetUpsertInput = {
    nome: string;
    especie: string;
    idade: number;
    raca?: string;
}