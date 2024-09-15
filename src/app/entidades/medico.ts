
export interface User1 {
    id: number;
    nombre: string;
    apellido: string;
    usuario: string;
    tipo: string;
    aprobado: boolean;
  }
  
  export interface Medico {
    id: number;
    user: User1; //relación con User
    numeroRegistroMedico: string;
    aprobado: boolean;
    fechaCreacion: Date;
    fechaModificacion: Date;
    especialidades: Especialidad[];
    proximoTurno: Date | null;
  }
  
  export interface Especialidad {
    id: number;
    nombre: string;
  }

  export interface Turno {
    id?: number; // Hacer que el campo id sea opcional
    especialidadId: number;
    fecha: string;
    hora: string;
    medicoId?: number;
    disponible: number;
    pacienteId?: number;
  }
