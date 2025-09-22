export type WeeklyData = typeof datosSemanales["semana-24"];

export type Almacen = {
  ocupacionPorc: number;
  devolucionUnidades: number | null;
  entradas: number;
  salidas: number;
};

export const datosSemanales = {
  "semana-24": {
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
        "scoPorc": 28.8,
        "ventaIpod": 21,
        "eTicketPorc": 50,
        "sint": 735,
        "repoPorc": 3.2
    },
    "logistica": {
        "entradas": 5876,
        "salidas": 4731
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
  },
  "semana-23": {
    "periodo": "SEMANA 23",
    "ventas": {
        "totalEuros": 213532,
        "varPorcEuros": -5.2,
        "totalUnidades": 11771,
        "varPorcUnidades": -3.1
    },
    "rendimientoTienda": {
        "trafico": 32569,
        "varPorcTrafico": -10.1,
        "conversion": 21.1,
        "varPorcConversion": 4.8
    },
    "operaciones": {
        "filasCajaPorc": 12,
        "scoPorc": 26.1,
        "ventaIpod": 18,
        "eTicketPorc": 48,
        "sint": 680,
        "repoPorc": 3.5
    },
    "logistica": {
        "entradas": 4100,
        "salidas": 3300
    },
    "perdidas": {
        "gap": {
            "euros": 4.9,
            "unidades": -1.2
        },
        "merma": {
            "unidades": 650,
            "porcentaje": 1.6
        }
    },
    "almacenes": {
        "ropa": {
            "ocupacionPorc": 85,
            "devolucionUnidades": 250,
            "entradas": 4100,
            "salidas": 3300
        },
        "calzado": {
            "ocupacionPorc": 95,
            "devolucionUnidades": 50,
            "entradas": 1400,
            "salidas": 1100
        },
        "perfumeria": {
            "ocupacionPorc": 70,
            "devolucionUnidades": null,
            "entradas": 750,
            "salidas": 600
        }
    }
  }
};
