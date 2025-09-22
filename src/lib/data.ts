export type WeeklyData = typeof datosSemanales["semana-24"];

export type Almacen = {
  ocupacionPorc: number;
  devolucionUnidades: number | null;
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
        "entradasSemanales": 5876,
        "salidasSemanales": 4731
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
              "devolucionUnidades": 292
          },
          "calzado": {
              "ocupacionPorc": 100,
              "devolucionUnidades": 58
          },
          "perfumeria": {
              "ocupacionPorc": 75,
              "devolucionUnidades": null
          }
      },
      "datosPorSeccion": {
        "woman": {
            "pesoPorc": 58,
            "metricasPrincipales": {
                "totalEuros": 168414,
                "varPorcEuros": 13.8,
                "totalUnidades": 7026,
                "varPorcUnidades": 7.5
            },
            "desglose": [
                { "seccion": "Ropa", "totalEuros": 154234, "varPorc": 13.0 },
                { "seccion": "Calzado", "totalEuros": 8174, "varPorc": 21.2 },
                { "seccion": "Perfumería", "totalEuros": 6006, "varPorc": 27.0 }
            ]
        },
        "man": {
            "pesoPorc": 26,
            "metricasPrincipales": {
                "totalEuros": 76080,
                "varPorcEuros": 14.2,
                "totalUnidades": 2658,
                "varPorcUnidades": 7.3
            },
            "desglose": [
                { "seccion": "Ropa", "totalEuros": 67147, "varPorc": 10.9 },
                { "seccion": "Calzado", "totalEuros": 5074, "varPorc": 64.9 },
                { "seccion": "Perfumería", "totalEuros": 3859, "varPorc": 30.0 }
            ]
        },
        "nino": {
            "pesoPorc": 16,
            "metricasPrincipales": {
                "totalEuros": 45590,
                "varPorcEuros": 17.7,
                "totalUnidades": 2970,
                "varPorcUnidades": 7.5
            },
            "desglose": [
                { "seccion": "Ropa", "totalEuros": 41219, "varPorc": 15.0 },
                { "seccion": "Calzado", "totalEuros": 3599, "varPorc": 33.5 },
                { "seccion": "Perfumería", "totalEuros": 772, "varPorc": 268.0 }
            ]
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
        "entradasSemanales": 4100,
        "salidasSemanales": 3300
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
            "devolucionUnidades": 250
        },
        "calzado": {
            "ocupacionPorc": 95,
            "devolucionUnidades": 50
        },
        "perfumeria": {
            "ocupacionPorc": 70,
            "devolucionUnidades": null
        }
    }
  }
};
