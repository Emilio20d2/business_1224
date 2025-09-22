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
              "devolucionUnidades": 292,
              "entradas": 1200,
              "salidas": 900
          },
          "calzado": {
              "ocupacionPorc": 100,
              "devolucionUnidades": 58,
              "entradas": 400,
              "salidas": 350
          },
          "perfumeria": {
              "ocupacionPorc": 75,
              "devolucionUnidades": null,
              "entradas": 250,
              "salidas": 200
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
    },
    "ventasMan": {
      "pesoComprador": [
          { "nombre": "MAN", "pesoPorc": 30, "totalEuros": 20338, "varPorc": 28.2 },
          { "nombre": "GLOBAL", "pesoPorc": 30, "totalEuros": 20012, "varPorc": 2.4 },
          { "nombre": "CIRCULAR", "pesoPorc": 16, "totalEuros": 10436, "varPorc": -3.3 },
          { "nombre": "DNWR", "pesoPorc": 14, "totalEuros": 9081, "varPorc": 6.5 },
          { "nombre": "SPORT", "pesoPorc": 5, "totalEuros": 3400, "varPorc": 15.1 },
          { "nombre": "ACCES", "pesoPorc": 3, "totalEuros": 2050, "varPorc": -5.0 },
          { "nombre": "BASIC", "pesoPorc": 2, "totalEuros": 1500, "varPorc": 12.0 }
      ],
      "zonaComercial": [
          { "nombre": "MAN FORMAL", "pesoPorc": 24, "totalEuros": 16235, "varPorc": 45.3 },
          { "nombre": "GLB URBAN", "pesoPorc": 16, "totalEuros": 11038, "varPorc": 25.5 },
          { "nombre": "CIRCULAR", "pesoPorc": 16, "totalEuros": 10436, "varPorc": -3.3 },
          { "nombre": "ZONA D", "pesoPorc": 10, "totalEuros": 8000, "varPorc": 10.0 },
          { "nombre": "ZONA E", "pesoPorc": 8, "totalEuros": 6400, "varPorc": 5.0 },
          { "nombre": "ZONA F", "pesoPorc": 7, "totalEuros": 5600, "varPorc": -2.1 },
          { "nombre": "ZONA G", "pesoPorc": 6, "totalEuros": 4800, "varPorc": 12.8 },
          { "nombre": "ZONA H", "pesoPorc": 5, "totalEuros": 4000, "varPorc": -8.5 },
          { "nombre": "ZONA I", "pesoPorc": 4, "totalEuros": 3200, "varPorc": 20.3 },
          { "nombre": "ZONA J", "pesoPorc": 4, "totalEuros": 3200, "varPorc": 18.1 }
      ],
      "agrupacionComercial": [
          { "nombre": "PANTALON", "pesoPorc": 26, "totalEuros": 36607, "varPorc": 20.1 },
          { "nombre": "SASTRERIA", "pesoPorc": 15, "totalEuros": 20252, "varPorc": -7.3 },
          { "nombre": "TEJANO", "pesoPorc": 15, "totalEuros": 20167, "varPorc": 22.8 },
          { "nombre": "CAMISA", "pesoPorc": 12, "totalEuros": 15000, "varPorc": 15.5 },
          { "nombre": "POLO", "pesoPorc": 10, "totalEuros": 12000, "varPorc": 8.2 },
          { "nombre": "ZAPATO", "pesoPorc": 8, "totalEuros": 9600, "varPorc": -1.0 },
          { "nombre": "BERMUDA", "pesoPorc": 5, "totalEuros": 6000, "varPorc": 30.1 },
          { "nombre": "TRICOT", "pesoPorc": 4, "totalEuros": 4800, "varPorc": -5.5 },
          { "nombre": "ACCESORIOS", "pesoPorc": 3, "totalEuros": 3600, "varPorc": 11.0 },
          { "nombre": "BAÑO", "pesoPorc": 2, "totalEuros": 2400, "varPorc": 40.2 }
      ]
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
            "devolucionUnidades": 250,
            "entradas": 1100,
            "salidas": 800
        },
        "calzado": {
            "ocupacionPorc": 95,
            "devolucionUnidades": 50,
            "entradas": 350,
            "salidas": 300
        },
        "perfumeria": {
            "ocupacionPorc": 70,
            "devolucionUnidades": null,
            "entradas": 200,
            "salidas": 150
        }
    },
    "datosPorSeccion": {
        "woman": { "pesoPorc": 0, "metricasPrincipales": { "totalEuros": 0, "varPorcEuros": 0, "totalUnidades": 0, "varPorcUnidades": 0 }, "desglose": [] },
        "man": { "pesoPorc": 0, "metricasPrincipales": { "totalEuros": 0, "varPorcEuros": 0, "totalUnidades": 0, "varPorcUnidades": 0 }, "desglose": [] },
        "nino": { "pesoPorc": 0, "metricasPrincipales": { "totalEuros": 0, "varPorcEuros": 0, "totalUnidades": 0, "varPorcUnidades": 0 }, "desglose": [] }
    },
    "ventasMan": {
        "pesoComprador": [],
        "zonaComercial": [],
        "agrupacionComercial": []
    }
  }
};

    