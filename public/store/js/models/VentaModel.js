/**
 * VentaModel.js
 * Capa de Modelo (M en MVC):
 * - Gestiona toda la comunicación con la API de ventas
 * - Recibe datos planos (no depende de otras clases Model)
 * - NO manipula el DOM
 */
class VentaModel {

    async crearVenta(data) {
        try {
            const res = await fetch('/api/ventas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || 'Error al crear la venta');
            }
            return await res.json();
        } catch (error) {
            throw error;
        }
    }

    async agregarDetalle(data) {
        try {
            const res = await fetch('/api/detalle_venta', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || 'Error al crear detalle');
            }
            return await res.json();
        } catch (error) {
            throw error;
        }
    }

    /**
     * Procesa una orden completa. Recibe DATOS PLANOS, no objetos de otras clases.
     * @param {Object} cliente - { id, nombre, ... }
     * @param {Array}  items   - [{ id, nombre, precio, cantidad }, ...]
     * @param {number} subtotal
     * @param {number} iva
     * @param {number} total
     * @param {string} metodoPago
     * @param {number} sucursalId
     */
    async procesarOrdenCompleta(cliente, items, subtotal, iva, total, metodoPago, sucursalId = 1) {
        try {
            // 1. Generar Folio único basado en timestamp
            const folio = `EXPE-${Date.now().toString().slice(-8)}`;

            // 2. Crear la Venta cabecera
            const ventaData = {
                sucursal_id: sucursalId,
                empleado_id: 1,
                cliente_id: cliente.id,
                folio: folio,
                fecha_venta: new Date().toISOString().slice(0, 19).replace('T', ' '),
                metodo_pago: metodoPago,
                subtotal: subtotal,
                descuento: 0,
                impuesto: iva,
                total: total,
                estatus: 'Pendiente'
            };

            const ventaRes = await this.crearVenta(ventaData);
            const ventaId = ventaRes.id;

            // 3. Crear los Detalles de Venta (uno por producto)
            for (const item of items) {
                await this.agregarDetalle({
                    venta_id: ventaId,
                    producto_id: item.id,
                    cantidad: item.cantidad,
                    precio_unitario: item.precio,
                    descuento: 0,
                    impuesto: parseFloat(item.precio) * 0.16,
                    subtotal: parseFloat(item.precio) * item.cantidad,
                    observaciones: null,
                    entregado: 0
                });
            }

            return { success: true, folio: folio, id: ventaId };
        } catch (error) {
            console.error('Error procesando orden:', error);
            throw error;
        }
    }

    async getHistorialCliente(clienteId) {
        try {
            const res = await fetch(`/api/ventas/cliente/${clienteId}`);
            if (!res.ok) return [];
            return await res.json();
        } catch (error) {
            console.error('Error obteniendo historial:', error);
            return [];
        }
    }
}
