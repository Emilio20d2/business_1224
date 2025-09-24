
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
        compradorMan: string[];
        zonaComercialMan: string[];
        agrupacionComercialMan: string[];
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
        dropOffPorc: number;
        ventaIpod: number;
        eTicketPorc: number;
        repoPorc: number;
        frescuraPorc: number;
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
        man: SeccionData;
    };
    ventasMan: {
        pesoComprador: VentasManItem[];
        zonaComercial: VentasManItem[];
        agrupacionComercial: VentasManItem[];
    };
    aqneSemanal: {
        man: SeccionAqneData;
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

type SeccionAqneData = {
    pesoPorc: number;
    metricasPrincipales: {
        totalEuros: number;
        totalUnidades: number;
    };
    desglose: {
        seccion: string;
        totalEuros: number;
    }[];
};

export type VentasManItem = {
    nombre: string;
    pesoPorc: number;
    totalEuros: number;
    varPorc: number;
    imageUrl?: string;
};

type VentaDiaria = {
    dia: string;
    total: number;
    woman: number;
    man: number;
    nino: number;
};

// This function now provides only the lists for initial setup.
export function getInitialLists(): WeeklyData['listas'] {
    return {
        compradorMan: ["MAN", "GLOBAL", "CIRCULAR", "DNWR", "SPORT", "ACCES", "BASIC"],
        zonaComercialMan: ["MAN FORMAL", "GLB URBAN", "CIRCULAR"],
        agrupacionComercialMan: ["PANTALON", "SASTRERIA", "TEJANO", "CAMISA", "POLO", "ZAPATO", "BERMUDA", "TRICOT", "ACCESORIOS", "BAÑO"],
    };
}

// This function generates a new, blank report structure based on the provided lists.
export function getInitialDataForWeek(week: string, lists: WeeklyData['listas']): WeeklyData {
    const createVentasManItems = (items: string[] | undefined): VentasManItem[] => {
        if (!Array.isArray(items)) return [];
        return items.map(name => ({
            nombre: name,
            pesoPorc: 0,
            totalEuros: 0,
            varPorc: 0,
            imageUrl: "",
        }));
    }
    
    return {
        periodo: week.toUpperCase().replace('-', ' '),
        listas: lists,
        ventas: { totalEuros: 0, varPorcEuros: 0, totalUnidades: 0, varPorcUnidades: 0 },
        rendimientoTienda: { trafico: 0, varPorcTrafico: 0, conversion: 0, varPorcConversion: 0 },
        operaciones: { filasCajaPorc: 0, scoPorc: 0, dropOffPorc: 0, ventaIpod: 0, eTicketPorc: 0, repoPorc: 0, frescuraPorc: 0 },
        logistica: { entradasSemanales: 0, salidasSemanales: 0 },
        perdidas: { gap: { euros: 0, unidades: 0 }, merma: { unidades: 0, porcentaje: 0 } },
        almacenes: {
            ropa: { ocupacionPorc: 0, devolucionUnidades: 0, entradas: 0, salidas: 0 },
            calzado: { ocupacionPorc: 0, devolucionUnidades: 0, entradas: 0, salidas: 0 },
            perfumeria: { ocupacionPorc: 0, devolucionUnidades: null, entradas: 0, salidas: 0 }
        },
        datosPorSeccion: {
            man: {
                pesoPorc: 0,
                metricasPrincipales: { totalEuros: 0, varPorcEuros: 0, totalUnidades: 0, varPorcUnidades: 0 },
                desglose: [
                    { seccion: "Ropa", totalEuros: 0, varPorc: 0 },
                    { seccion: "Calzado", totalEuros: 0, varPorc: 0 },
                    { seccion: "Perfumería", totalEuros: 0, varPorc: 0 }
                ]
            }
        },
        ventasMan: {
            pesoComprador: createVentasManItems(lists?.compradorMan),
            zonaComercial: createVentasManItems(lists?.zonaComercialMan),
            agrupacionComercial: createVentasManItems(lists?.agrupacionComercialMan)
        },
        aqneSemanal: {
            man: {
                pesoPorc: 0,
                metricasPrincipales: { totalEuros: 0, totalUnidades: 0 },
                desglose: [
                    { seccion: "Ropa", totalEuros: 0 },
                    { seccion: "Calzado", totalEuros: 0 },
                    { seccion: "Perfumería", totalEuros: 0 }
                ]
            }
        },
        ventasDiariasAQNE: [
            { dia: "LUNES", total: 0, woman: 0, man: 0, nino: 0 },
            { dia: "MARTES", total: 0, woman: 0, man: 0, nino: 0 },
            { dia: "MIÉRCOLES", total: 0, woman: 0, man: 0, nino: 0 },
            { dia: "JUEVES", total: 0, woman: 0, man: 0, nino: 0 },
            { dia: "VIERNES", total: 0, woman: 0, man: 0, nino: 0 },
            { dia: "SÁBADO", total: 0, woman: 0, man: 0, nino: 0 },
            { dia: "DOMINGO", total: 0, woman: 0, man: 0, nino: 0 }
        ],
        focusSemanal: "",
        acumulado: {
            mensual: {
                totalEuros: 0, varPorcTotal: 0,
                desglose: [
                    { nombre: "Woman", totalEuros: 0, varPorc: 0, pesoPorc: 0 },
                    { nombre: "Man", totalEuros: 0, varPorc: 0, pesoPorc: 0 },
                    { nombre: "Niño", totalEuros: 0, varPorc: 0, pesoPorc: 0 }
                ]
            },
            anual: {
                totalEuros: 0, varPorcTotal: 0,
                desglose: [
                    { nombre: "Woman", totalEuros: 0, varPorc: 0, pesoPorc: 0 },
                    { nombre: "Man", totalEuros: 0, varPorc: 0, pesoPorc: 0 },
                    { nombre: "Niño", totalEuros: 0, varPorc: 0, pesoPorc: 0 }
                ]
            }
        }
    };
}
