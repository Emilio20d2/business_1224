export type WeeklyData = typeof datosSemanales;

export type Almacen = {
  ocupacionPorc: number;
  devolucionUnidades: number | null;
  entradas: number;
  salidas: number;
};

// Based on the user request, the JSON structure has been updated.
// The old `datosSemanales` is being replaced with a new structure that includes
// a nested `almacenes` object and different naming for some fields.
export const datosSemanales = {
  "periodo": "SEMANA 24",
  "ventas": {
      "totalEuros": 244494,
      "varPorcEuros": 14.5,
      "totalUnidades": 12654,
      "varPorcUnidades": 7.5
  },
  "rendimientoTienda": {
      "trafico": 35402,
      "varPorcTrafico": 8.7,
      "conversion": 18.6,
      "varPorcConversion": -2.5
  },
  "operaciones": {
      "filasCajaPorc": 10,
      "scoPorc": 28.8, // Renamed from acoPorc
      "ventaIpod": 21,
      "eTicketPorc": 50,
      "sint": 735,
      "repoPorc": 3.2
  },
  "logistica": {
      // This is a new grouping
      "entradas": 4376,
      "salidas": 3531
  },
  "gestionStock": {
      "ocupacion": {
          "valorSuperior": 6597,
          "porcSuperior": 88,
          "valorInferior": 395,
          "porcInferior": 100
      },
      "propuestaDevolucion": {
          "valorSuperior": 292,
          "valorInferior": 58
      }
  },
  "perdidas": {
      "gap": {
          "euros": 5.5,
          "unidades": -1.4
      },
      "merma": {
          "unidades": 668,
          "porcentaje": 1.68
      }
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
