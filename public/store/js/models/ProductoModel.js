/**
 * ProductoModel.js
 * Capa de Modelo (M en MVC):
 * - Gestiona toda la comunicación con la API de productos
 * - Contiene la lógica de filtrado y ordenamiento de datos
 * - NO manipula el DOM
 */
class ProductoModel {

    async getAll() {
        try {
            const res = await fetch('/api/productos');
            if (!res.ok) return [];
            return await res.json();
        } catch (error) {
            console.error('Error fetching products:', error);
            return [];
        }
    }

    async getById(id) {
        try {
            const res = await fetch(`/api/productos/${id}`);
            if (!res.ok) return null;
            return await res.json();
        } catch (error) {
            console.error('Error fetching product detail:', error);
            throw error;
        }
    }

    async getPorCategoria(cat) {
        try {
            const res = await fetch(`/api/productos/categoria/${encodeURIComponent(cat)}`);
            if (!res.ok) {
                console.warn('API respondió con error:', res.status);
                return [];
            }
            return await res.json();
        } catch (error) {
            console.error('Error fetching products by category:', error);
            return [];
        }
    }

    async buscar(q) {
        try {
            const res = await fetch(`/api/productos/buscar?q=${encodeURIComponent(q)}`);
            if (!res.ok) return [];
            return await res.json();
        } catch (error) {
            console.error('Error searching products:', error);
            return [];
        }
    }

    /**
     * Filtra y ordena un array de productos localmente.
     * Lógica de datos pura que pertenece al Model, no al Controller.
     * @param {Array} productos - Lista fuente de productos
     * @param {Object} opciones - { categoria, query, sort }
     * @returns {Array} Productos filtrados y ordenados
     */
    filtrar(productos, { categoria = 'all', query = '', sort = 'nombre-asc' } = {}) {
        let resultado = [...productos];

        // 1. Filtrar por categoría
        if (categoria !== 'all') {
            resultado = resultado.filter(p => p.categoria === categoria);
        }

        // 2. Filtrar por texto de búsqueda
        if (query.trim()) {
            const q = query.toLowerCase();
            resultado = resultado.filter(p =>
                (p.nombre && p.nombre.toLowerCase().includes(q)) ||
                (p.marca && p.marca.toLowerCase().includes(q))
            );
        }

        // 3. Ordenar
        switch (sort) {
            case 'precio-asc':
                resultado.sort((a, b) => parseFloat(a.precio) - parseFloat(b.precio));
                break;
            case 'precio-desc':
                resultado.sort((a, b) => parseFloat(b.precio) - parseFloat(a.precio));
                break;
            case 'nombre-asc':
            default:
                resultado.sort((a, b) => a.nombre.localeCompare(b.nombre));
                break;
        }

        return resultado;
    }
}
