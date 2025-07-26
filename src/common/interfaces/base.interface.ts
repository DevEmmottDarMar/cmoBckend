/**
 * Interfaces base compartidas por toda la aplicación
 */

// Interfaz base para respuestas de API
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
  path: string;
}

// Interfaz para respuestas de error
export interface ApiErrorResponse {
  success: false;
  message: string;
  error?: string;
  timestamp: string;
  path: string;
}

// Interfaz para respuestas paginadas
export interface PaginatedResponse<T = any> {
  success: true;
  message: string;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  timestamp: string;
  path: string;
}

// Tipos de formato para mappers
export type ResponseFormat = 'new' | 'legacy' | 'full' | 'simple';

// Interfaz base para entidades
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
