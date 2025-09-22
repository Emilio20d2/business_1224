
type DesgloseItem = {
    nombre: string;
    totalEuros: number;
    varPorc: number;
    pesoPorc: number;
};

type AcumuladoPeriodo = {
    totalEuros: number;
    varPorcTotal: number;
    desglose: DesgloseItem[];
};

export type WeeklyData = {
    periodo: string;
    listas: {
        comprador: string[];
        zonaComercial: string[];
        agrupacionComercial: string[];
    };
    ventas: {
        totalEuros: number;
        varPorcEuros: number;
        totalUnidades: number;
        varPorcUnidades: number;
    };
    rendimientoTienda: {
        trafico: number;
        varPorcTrafico: number;
        conversion: number;
        varPorcConversion: number;
    };
    operaciones: {
        filasCajaPorc: number;
        scoPorc: number;
        ventaIpod: number;
        eTicketPorc: number;
        sint: number;
        repoPorc: number;
    };
    logistica: {
        entradasSemanales: number;
        salidasSemanales: number;
    };
    perdidas: {
        gap: {
            euros: number;
            unidades: number;
        };
        merma: {
            unidades: number;
            porcentaje: number;
        };
    };
    almacenes: {
        ropa: Almacen;
        calzado: Almacen;
        perfumeria: Almacen;
    };
    datosPorSeccion: {
        woman: SeccionData;
        man: SeccionData;
        nino: SeccionData;
    };
    ventasMan: {
        pesoComprador: VentasManItem[];
        zonaComercial: VentasManItem[];
        agrupacionComercial: VentasManItem[];
    };
    aqneSemanal: {
        woman: SeccionData;
        man: SeccionData;
        nino: SeccionData;
    };
    ventasDiariasAQNE: VentaDiaria[];
    focusSemanal: string;
    acumulado: {
        mensual: AcumuladoPeriodo;
        anual: AcumuladoPeriodo;
    };
};


export type Almacen = {
  ocupacionPorc: number;
  devolucionUnidades: number | null;
  entradas: number;
  salidas: number;
};

type SeccionData = {
    pesoPorc: number;
    metricasPrincipales: {
        totalEuros: number;
        varPorcEuros: number;
        totalUnidades: number;
        varPorcUnidades: number;
    };
    desglose: {
        seccion: string;
        totalEuros: number;
        varPorc: number;
    }[];
};

type VentasManItem = {
    nombre: string;
    pesoPorc: number;
    totalEuros: number;
    varPorc: number;
    imageUrl: string;
};

type VentaDiaria = {
    dia: string;
    total: number;
    woman: number;
    man: number;
    nino: number;
};

// This function now provides only the lists for initial setup.
export function getInitialLists() {
    return {
        "comprador": ["MAN", "GLOBAL", "CIRCULAR", "DNWR", "SPORT", "ACCES", "BASIC", "EXTRA1", "EXTRA2"],
        "zonaComercial": ["MAN FORMAL", "GLB URBAN", "CIRCULAR", "ZONA D", "ZONA E", "ZONA F", "ZONA G", "ZONA H", "ZONA I", "ZONA J"],
        "agrupacionComercial": ["PANTALON", "SASTRERIA", "TEJANO", "CAMISA", "POLO", "ZAPATO", "BERMUDA", "TRICOT", "ACCESORIOS", "BAÑO"]
    };
}


const initialReportData: Omit<WeeklyData, 'periodo' | 'listas'> = {
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
          { "nombre": "MAN", "pesoPorc": 30, "totalEuros": 20338, "varPorc": 28.2, "imageUrl": "https://picsum.photos/seed/man1/500/400" },
          { "nombre": "GLOBAL", "pesoPorc": 30, "totalEuros": 20012, "varPorc": 2.4, "imageUrl": "https://picsum.photos/seed/man2/500/400" },
          { "nombre": "CIRCULAR", "pesoPorc": 16, "totalEuros": 10436, "varPorc": -3.3, "imageUrl": "https://picsum.photos/seed/man3/500/400" },
          { "nombre": "DNWR", "pesoPorc": 14, "totalEuros": 9081, "varPorc": 6.5, "imageUrl": "https://picsum.photos/seed/man4/500/400" },
          { "nombre": "SPORT", "pesoPorc": 5, "totalEuros": 3400, "varPorc": 15.1, "imageUrl": "https://picsum.photos/seed/man5/500/400" },
          { "nombre": "ACCES", "pesoPorc": 3, "totalEuros": 2050, "varPorc": -5.0, "imageUrl": "https://picsum.photos/seed/man6/500/400" },
          { "nombre": "BASIC", "pesoPorc": 2, "totalEuros": 1500, "varPorc": 12.0, "imageUrl": "https://picsum.photos/seed/man7/500/400" }
      ],
      "zonaComercial": [
          { "nombre": "MAN FORMAL", "pesoPorc": 24, "totalEuros": 16235, "varPorc": 45.3, "imageUrl": "https://picsum.photos/seed/zona1/500/400" },
          { "nombre": "GLB URBAN", "pesoPorc": 16, "totalEuros": 11038, "varPorc": 25.5, "imageUrl": "https://picsum.photos/seed/zona2/500/400" },
          { "nombre": "CIRCULAR", "pesoPorc": 16, "totalEuros": 10436, "varPorc": -3.3, "imageUrl": "https://picsum.photos/seed/zona3/500/400" }
      ],
      "agrupacionComercial": [
          { "nombre": "PANTALON", "pesoPorc": 26, "totalEuros": 36607, "varPorc": 20.1, "imageUrl": "https://picsum.photos/seed/agrup1/500/400" },
          { "nombre": "SASTRERIA", "pesoPorc": 15, "totalEuros": 20252, "varPorc": -7.3, "imageUrl": "https://picsum.photos/seed/agrup2/500/400" },
          { "nombre": "TEJANO", "pesoPorc": 15, "totalEuros": 20167, "varPorc": 22.8, "imageUrl": "https://picsum.photos/seed/agrup3/500/400" }
      ]
    },
    "aqneSemanal": {
        "woman": {
            "pesoPorc": 58,
            "metricasPrincipales": { "totalEuros": 168414, "varPorcEuros": 13.8, "totalUnidades": 7026, "varPorcUnidades": 7.5 },
            "desglose": [
                { "seccion": "Ropa", "totalEuros": 154234, "varPorc": 13.0 },
                { "seccion": "Calzado", "totalEuros": 8174, "varPorc": 21.2 },
                { "seccion": "Perfumería", "totalEuros": 6006, "varPorc": 27.0 }
            ]
        },
        "man": {
            "pesoPorc": 26,
            "metricasPrincipales": { "totalEuros": 76080, "varPorcEuros": 14.2, "totalUnidades": 2658, "varPorcUnidades": 7.3 },
            "desglose": [
                { "seccion": "Ropa", "totalEuros": 67147, "varPorc": 10.9 },
                { "seccion": "Calzado", "totalEuros": 5074, "varPorc": 64.9 },
                { "seccion": "Perfumería", "totalEuros": 3859, "varPorc": 30.0 }
            ]
        },
        "nino": {
            "pesoPorc": 16,
            "metricasPrincipales": { "totalEuros": 45590, "varPorcEuros": 17.7, "totalUnidades": 2970, "varPorcUnidades": 7.5 },
            "desglose": [
                { "seccion": "Ropa", "totalEuros": 41219, "varPorc": 15.0 },
                { "seccion": "Calzado", "totalEuros": 3599, "varPorc": 33.5 },
                { "seccion": "Perfumería", "totalEuros": 772, "varPorc": 268.0 }
            ]
        }
    },
    "ventasDiariasAQNE": [
        { "dia": "LUNES", "total": 39699, "woman": 19965, "man": 11653, "nino": 8081 },
        { "dia": "MARTES", "total": 35233, "woman": 20662, "man": 9198, "nino": 5373 },
        { "dia": "MIÉRCOLES", "total": 36012, "woman": 19373, "man": 9897, "nino": 6742 },
        { "dia": "JUEVES", "total": 38415, "woman": 24154, "man": 8719, "nino": 5542 },
        { "dia": "VIERNES", "total": 50686, "woman": 28746, "man": 12332, "nino": 9608 },
        { "dia": "SÁBADO", "total": 101809, "woman": 58416, "man": 25779, "nino": 17614 },
        { "dia": "DOMINGO", "total": 0, "woman": 0, "man": 0, "nino": 0 }
    ],
    "focusSemanal": "Aquí puedes escribir tus objetivos y foco para la semana.",
    "acumulado": {
        "mensual": {
            "totalEuros": 1421369,
            "varPorcTotal": 12.6,
            "desglose": [
                { "nombre": "Woman", "totalEuros": 816587, "varPorc": 11.0, "pesoPorc": 57.5 },
                { "nombre": "Man", "totalEuros": 382012, "varPorc": 18.6, "pesoPorc": 26.9 },
                { "nombre": "Niño", "totalEuros": 222770, "varPorc": 8.3, "pesoPorc": 15.7 }
            ]
        },
        "anual": {
            "totalEuros": 18604000,
            "varPorcTotal": 19.4,
            "desglose": [
                { "nombre": "Woman", "totalEuros": 10001000, "varPorc": 20.0, "pesoPorc": 53.8 },
                { "nombre": "Man", "totalEuros": 5712000, "varPorc": 21.2, "pesoPorc": 30.7 },
                { "nombre": "Niño", "totalEuros": 2891000, "varPorc": 14.0, "pesoPorc": 15.5 }
            ]
        }
    }
  };

// This function now only cares about the report data. Lists are handled separately.
export function getInitialDataForWeek(week: string): any {
    return {
        ...initialReportData,
        periodo: week.toUpperCase().replace('-', ' '),
    }
}
