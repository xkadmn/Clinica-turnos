
export interface User {
    id: number;
    nombre: string;
    apellido: string;
    fecnac: string, // Cambia a string vacío
    pass: string;
    mail: string;
    usuario: string;
    tipo: string;
    aprobado: boolean;
  }

  export interface Perfil {
    id?: number;
    telefono1: string;
    telefono2: string;
    documento_tipo: string;
    documento_id: string;
    mail: string;
    direccion: string;
    localidad: string;
    nacionalidad: string;
    legajo_id?: number;
    foto_perfil?: string | null; 
}