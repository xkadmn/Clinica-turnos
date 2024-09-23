
export interface User {
    id: number;
    nombre: string;
    apellido: string;
    pass: string;
    mail: string;
    usuario: string;
    tipo: string;
    fecNac?: Date; // Añadir '?' para hacerla opcional
    aprobado: boolean;
  }

  export interface Perfil {
    id: number;
    usuarioId: number;
    telefono1?: string;
    telefono2?: string;
    direccion?: string;
    localidad?: string;
    nacionalidad?: string;
    documento_tipo?: string;
    documento_id?: string;
    foto_perfil?: string; // Añadir foto de perfil
    legajo_id?: number; // Añadir ID de legajo
}