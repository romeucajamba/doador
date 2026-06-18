export interface Provincia {
  id_provincia: number;
  nome: string;
}

export interface Municipio {
  id_municipio: number;
  id_provincia: number;
  nome: string;
  provincia?: Provincia;
}

export interface CreateProvinciaPayload {
  nome: string;
}

export interface UpdateProvinciaPayload {
  nome?: string;
}

export interface CreateMunicipioPayload {
  id_provincia: number;
  nome: string;
}

export interface UpdateMunicipioPayload {
  id_provincia?: number;
  nome?: string;
}
