/**
 * Utilidad para manejar respuestas de fetch de forma segura
 */

/**
 * Parsea una respuesta de forma segura, manejando respuestas vacías
 */
export async function safeJsonParse<T>(response: Response): Promise<T | null> {
  const text = await response.text();

  if (!text || text.trim() === "") {
    return null;
  }

  try {
    return JSON.parse(text) as T;
  } catch (error) {
    console.error("Error al parsear JSON:", error);
    console.error("Texto recibido:", text);
    throw new Error("Respuesta inválida del servidor");
  }
}

/**
 * Extrae el mensaje de error de una respuesta
 */
export async function extractErrorMessage(response: Response): Promise<string> {
  try {
    const text = await response.text();

    if (!text || text.trim() === "") {
      return `Error ${response.status}: ${response.statusText}`;
    }

    try {
      const json = JSON.parse(text);
      return json.message || json.error || text;
    } catch {
      return text;
    }
  } catch {
    return `Error ${response.status}: ${response.statusText}`;
  }
}

/**
 * Verifica si la respuesta es exitosa y tiene contenido
 */
export function isSuccessResponse(response: Response): boolean {
  return response.ok && response.status !== 204;
}
