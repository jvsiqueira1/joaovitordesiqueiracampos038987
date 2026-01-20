export type TutorId = string;

export type TutorPhoto = {
    id: string;
    nome: string;
    contentType: string;
    url: string;
};

export type Tutor = {
    id: TutorId;
    nome: string;
    telefone: string;
    email?: string;
    endereco?: string;
    cpf?: string;
    foto?: TutorPhoto;
};

export type TutorUpsertInput = {
    nome: string;
    telefone: string;
    email?: string;
    endereco?: string;
    cpf?: string;
}