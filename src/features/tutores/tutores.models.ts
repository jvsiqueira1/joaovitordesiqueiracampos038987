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
  pets?: LinkedPet[];
};

export type TutorUpsertInput = {
  nome: string;
  telefone: string;
  email?: string;
  endereco?: string;
  cpf?: string;
};

export type LinkedPetPhoto = {
  id: string;
  nome: string;
  contentType: string;
  url: string;
};

export type LinkedPet = {
  id: string;
  nome: string;
  raca?: string;
  idade: number;
  foto?: LinkedPetPhoto;
};
