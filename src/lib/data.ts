export type WeeklyData = typeof datosSemanales;
export type WarehouseData = WeeklyData["almacenes"];
export type WarehouseSectionData = WarehouseData[keyof WarehouseData];

export const datosSemanales = {
    "totalEuros": 244494,
    "varPorcEuros": 14.5,
    "totalUnidades": 12654,
    "varPorcUnidades": 7.5,
    "trafico": 35402,
    "varPorcTrafico": 8.7,
    "ventaIpod": 21,
    "eTicketPorc": 50,
    "conversion": 18.6,
    "varPorcConversion": -2.5,
    "filasCajaPorc": 10,
    "acoPorc": 28.8,
    "gap": {
        "euros": 5.5,
        "unidades": -1.4
    },
    "sint": 735,
    "repoPorc": 3.2,
    "merma": {
        "unidades": 668,
        "porcentaje": 1.68
    },
    "almacenes": {
        "ropa": {
            "ocupacionPorc": 88,
            "devolucionUnidades": 292,
            "entradas": 4376,
            "salidas": 3531
        },
        "calzado": {
            "ocupacionPorc": 100,
            "devolucionUnidades": 58,
            "entradas": 1500,
            "salidas": 1200
        },
        "perfumeria": {
            "ocupacionPorc": 75,
            "devolucionUnidades": null,
            "entradas": 800,
            "salidas": 650
        }
    }
};
