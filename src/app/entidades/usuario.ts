
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