
export interface User {
    nombre: string;
    apellido: string;
    pass: string;
    mail: string;
    usuario: string;
    tipo: string;
    fecNac?: Date; // Añadir '?' para hacerla opcional
  }