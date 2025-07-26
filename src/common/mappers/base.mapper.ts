import {
  ApiResponse,
  ApiErrorResponse,
  PaginatedResponse,
} from '../interfaces/api.interface';

// Re-exportar las interfaces para compatibilidad
export { ApiResponse, ApiErrorResponse, PaginatedResponse };

export class BaseMapper {
  /**
   * Crea una respuesta exitosa
   */
  static createSuccessResponse<T>(
    data: T,
    message: string,
    path: string,
    statusCode: number = 200,
  ): ApiResponse<T> {
    return {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
      path,
    };
  }

  /**
   * Crea una respuesta de error
   */
  static createErrorResponse(
    message: string,
    path: string,
    error?: string,
  ): ApiErrorResponse {
    return {
      success: false,
      message,
      error,
      timestamp: new Date().toISOString(),
      path,
    };
  }

  /**
   * Crea una respuesta paginada
   */
  static createPaginatedResponse<T>(
    data: T[],
    message: string,
    path: string,
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    },
  ): PaginatedResponse<T> {
    return {
      success: true,
      message,
      data,
      pagination,
      timestamp: new Date().toISOString(),
      path,
    };
  }

  /**
   * Valida si una respuesta es exitosa
   */
  static isSuccessResponse(
    response: ApiResponse | ApiErrorResponse,
  ): response is ApiResponse {
    return response.success === true;
  }

  /**
   * Extrae solo los datos de una respuesta
   */
  static extractData<T>(response: ApiResponse<T>): T {
    return response.data;
  }
}
