

export type Empleado = {
    id: string;
    nombre: string;
};

type DesgloseItem = {
    nombre: string;
    totalEuros: number;
    varPorc: number;
    pesoPorc: number;
};

type AcumuladoPeriodo = {
    totalEuros: number;
    varPorcTotal: number;
    importeIpod?: number;
    varPorcIpod?: number;
    sint?: number;
    varPorcSint?: number;
    desglose: DesgloseItem[];
};

export type OperacionesData = {
    filasCajaPorc: number;
    scoPorc: number;
    dropOffPorc: number;
    ventaIpod: number;
    eTicketPorc: number;
    repoPorc: number;
    frescuraPorc: number;
    coberturaPorc: number;
    sinUbicacion: number;
};

export type PerdidasData = {
    gap: {
        euros: number;
        unidades: number;
    };
    merma: {
        euros: number;
        unidades: number;
        porcentaje: number;
    };
};

export type Almacen = {
  ocupacionPorc: number;
  devolucionUnidades: number | null;
  entradas: number;
  salidas: number;
};

export type LogisticaData = {
    entradasSemanales: number;
    salidasSemanales: number;
    sintSemanales: number;
};

export type ProductividadSeccion = {
    unidadesConfeccion: number;
    unidadesPaqueteria: number;
    hora: string;
};

export type CoberturaHora = {
    hora: string;
    personas: number;
};

export type PlanificacionItem = {
    id: string; // uuid
    idEmpleado: string;
    nombreEmpleado: string;
    seccion: 'woman' | 'man' | 'nino' | '';
    tarea: 'confeccion' | 'paqueteria';
    anotaciones: string;
};

export type PlanningSemanalItem = {
    id: string; // uuid
    idEmpleado: string;
    nombreEmpleado: string;
    seccion: 'woman' | 'man' | 'nino' | 'sint' | '';
    notas: string;
    hora: string;
};

export type ProductividadData = {
    productividadPorSeccion: {
        woman: ProductividadSeccion;
        man: ProductividadSeccion;
        nino: ProductividadSeccion;
    };
    coberturaPorHoras: CoberturaHora[];
    planificacion: PlanificacionItem[];
    incidencias: string;
};

export type IncorporacionItem = {
    id: string; // uuid
    idEmpleado: string;
    nombreEmpleado: string;
    somosZara: boolean;
    intalent: boolean;
    diHola: boolean;
}

export type SectionSpecificData = {
    operaciones: OperacionesData;
    perdidas: PerdidasData;
    logistica: LogisticaData;
    almacenes: {
        paqueteria: Almacen;
        confeccion: Almacen;
        calzado: Almacen;
        perfumeria: Almacen;
    };
}

export type PedidosData = {
    rankingNacional: number;
    pedidosDia: number;
    unidadesDia: number;
    objetivoSemanal: number;
    pedidosDiaSemanaAnterior: number;
    pedidosDiaSemanaProxima: number;
    pedidosIpodExpirados: number;
    rankingEmpleados: {
        id: string;
        nombre: string;
        pedidos: number;
        unidades: number;
        importes: number;
    }[];
};

export type SeccionAqneNinoData = {
    metricasPrincipales: {
        totalEuros: number;
        totalUnidades: number;
    };
    desglose: {
        seccion: string;
        totalEuros: number;
        unidades: number;
    }[];
};

export type MejorFamiliaNino = {
    nombre: string;
    totalEuros: number;
    varPorc: number;
};

export type VentasCompradorNinoItem = {
    nombre: string;
    totalEuros: number;
    varPorcTotal: number;
    mejoresFamilias: MejorFamiliaNino[];
};

export type EncuestasQrData = {
    respuestas: number;
    planta: number;
    tallas: number;
    online: number;
    probador: number;
    caja: number;
    respuestasPositivas?: {
        respuesta1: string;
        respuesta2: string;
    };
    aMejorar?: {
        respuesta1: string;
        respuesta2: string;
    }
};


export type WeeklyData = {
    periodo: string;
    listas: {
        empleados: Empleado[];
        compradorMan: string[];
        zonaComercialMan: string[];
        agrupacionComercialMan: string[];
        compradorWoman: string[];
        zonaComercialWoman: string[];
        agrupacionComercialWoman: string[];
        compradorNino: string[];
        zonaComercialNino: string[];
        agrupacionComercialNino: string[];
        mermaTarget: {
            general: number;
            woman: number;
            man: number;
            nino: number;
        };
        productividadRatio: {
            picking: number;
            perchado: number;
            confeccion: number;
            porcentajePerchado: number;
            porcentajePicking: number;
        };
        presentacionFooter: string;
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
    general: SectionSpecificData;
    man: SectionSpecificData;
    woman: SectionSpecificData;
    nino: SectionSpecificData;
    datosPorSeccion: {
        man: SeccionData;
        woman: SeccionData;
        nino: SeccionData;
    };
    ventasMan: {
        pesoComprador: VentasManItem[];
        zonaComercial: VentasManItem[];
        agrupacionComercial: VentasManItem[];
    };
    aqneSemanal: {
        man: SeccionAqneData;
        woman: SeccionAqneData;
        nino: SeccionAqneData;
    };
    aqneNino: SeccionAqneNinoData;
    ventasCompradorNino: VentasCompradorNinoItem[];
    ventasDiariasAQNE: VentaDiaria[];
    focusSemanal: {
      man: string;
      woman: string;
      nino: string;
      experiencia: string;
    };
    focusOperaciones: string;
    notasMerma: string;
    notasReposicion: string;
    experiencia: {
      texto: string;
      focus: string;
    };
    pedidos: PedidosData;
    encuestasQr: EncuestasQrData;
    incorporaciones: IncorporacionItem[];
    productividad: {
        lunes: ProductividadData;
        jueves: ProductividadData;
    };
    planningSemanal: {
        lunes: PlanningSemanalItem[];
        martes: PlanningSemanalItem[];
        miercoles: PlanningSemanalItem[];
        jueves: PlanningSemanalItem[];
        viernes: PlanningSemanalItem[];
        sabado: PlanningSemanalItem[];
    };
    acumulado: {
        mensual: AcumuladoPeriodo;
        anual: AcumuladoPeriodo;
    };
    ventasWoman: {
        pesoComprador: VentasManItem[];
        zonaComercial: VentasManItem[];
        agrupacionComercial: VentasManItem[];
    };
    ventasNino: {
        pesoComprador: VentasManItem[];
        zonaComercial: VentasManItem[];
        agrupacionComercial: VentasManItem[];
    };
    ventasExperiencia: {
        pesoComprador: VentasManItem[];
    };
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

export type VentasManItem = {
    nombre: string;
    pesoPorc: number;
    totalEuros: number;
    varPorc: number;
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
        empleados: [],
        compradorMan: ["Comprador A", "Comprador B", "Comprador C"],
        zonaComercialMan: ["Zona 1", "Zona 2", "Zona 3"],
        agrupacionComercialMan: ["Grupo Alpha", "Grupo Beta", "Grupo Gamma"],
        compradorWoman: ["WOMAN", "GLOBAL", "CIRCULAR", "DNWR", "SPORT", "ACCES", "BASIC"],
        zonaComercialWoman: ["WOMAN FORMAL", "GLB URBAN", "CIRCULAR"],
        agrupacionComercialWoman: ["PANTALON", "SASTRERIA", "TEJANO", "CAMISA", "POLO", "ZAPATO", "BERMUDA", "TRICOT", "ACCESORIOS", "BAÑO"],
        compradorNino: ["NIÑA", "NIÑO", "KIDS-A", "KIDS-O", "BABY", "ACCESORIOS"],
        zonaComercialNino: ["ZONA A", "ZONA B", "ZONA C"],
        agrupacionComercialNino: ["Familia 1", "Familia 2", "Familia 3", "Familia 4", "Familia 5", "Familia 6", "Familia 7", "Familia 8", "Familia 9", "Familia 10"],
        mermaTarget: {
            general: 0,
            woman: 0,
            man: 0,
            nino: 0,
        },
        productividadRatio: {
            picking: 400,
            perchado: 80,
            confeccion: 120,
            porcentajePerchado: 40,
            porcentajePicking: 60,
        },
        presentacionFooter: "ZARA 1224 - PUERTO VENECIA",
    };
}

const createInitialSectionSpecificData = (): SectionSpecificData => ({
    operaciones: {
        filasCajaPorc: 0,
        scoPorc: 0,
        dropOffPorc: 0,
        ventaIpod: 0,
        eTicketPorc: 0,
        repoPorc: 0,
        frescuraPorc: 0,
        coberturaPorc: 0,
        sinUbicacion: 0,
    },
    perdidas: {
        gap: { euros: 0, unidades: 0 },
        merma: { euros: 0, unidades: 0, porcentaje: 0 }
    },
    logistica: { entradasSemanales: 0, salidasSemanales: 0, sintSemanales: 0 },
    almacenes: {
        paqueteria: { ocupacionPorc: 0, devolucionUnidades: 0, entradas: 0, salidas: 0 },
        confeccion: { ocupacionPorc: 0, devolucionUnidades: 0, entradas: 0, salidas: 0 },
        calzado: { ocupacionPorc: 0, devolucionUnidades: 0, entradas: 0, salidas: 0 },
        perfumeria: { ocupacionPorc: 0, devolucionUnidades: null, entradas: 0, salidas: 0 }
    }
});

const createInitialPedidosData = (): PedidosData => ({
    rankingNacional: 0,
    pedidosDia: 0,
    unidadesDia: 0,
    objetivoSemanal: 0,
    pedidosDiaSemanaAnterior: 0,
    pedidosDiaSemanaProxima: 0,
    pedidosIpodExpirados: 0,
    rankingEmpleados: Array.from({ length: 10 }, (_, i) => ({
        id: '',
        nombre: '',
        pedidos: 0,
        unidades: 0,
        importes: 0,
    })),
});

const createInitialProductividadSeccion = (): ProductividadSeccion => ({
    unidadesConfeccion: 0,
    unidadesPaqueteria: 0,
    hora: '',
});

const createInitialProductividadData = (): ProductividadData => ({
    productividadPorSeccion: {
        woman: createInitialProductividadSeccion(),
        man: createInitialProductividadSeccion(),
        nino: createInitialProductividadSeccion(),
    },
    coberturaPorHoras: [
        { hora: "07-08", personas: 0 },
        { hora: "08-09", personas: 0 },
        { hora: "09-10", personas: 0 },
        { hora: "10-11", personas: 0 },
        { hora: "11-12", personas: 0 },
        { hora: "12-13", personas: 0 },
        { hora: "13-14", personas: 0 },
        { hora: "14-15", personas: 0 },
    ],
    planificacion: [],
    incidencias: ""
});

const createInitialPlanningSemanal = (): WeeklyData['planningSemanal'] => ({
    lunes: [],
    martes: [],
    miercoles: [],
    jueves: [],
    viernes: [],
    sabado: [],
});

const createInitialAqneNinoData = (): SeccionAqneNinoData => ({
    metricasPrincipales: {
        totalEuros: 0,
        totalUnidades: 0,
    },
    desglose: [
        { seccion: "Ropa", totalEuros: 0, unidades: 0 },
        { seccion: "Calzado", totalEuros: 0, unidades: 0 },
        { seccion: "Perfumería", totalEuros: 0, unidades: 0 },
    ],
});


// This function generates a new, blank report structure based on the provided lists.
export function getInitialDataForWeek(weekId: string, lists: WeeklyData['listas']): WeeklyData {
    const createVentasManItems = (items: string[] | undefined): VentasManItem[] => {
        if (!Array.isArray(items)) return [];
        return items.map(name => ({
            nombre: name,
            pesoPorc: 0,
            totalEuros: 0,
            varPorc: 0
        }));
    }

    const createVentasCompradorNinoItems = (compradores: string[]): VentasCompradorNinoItem[] => {
        return compradores.map(comprador => ({
            nombre: comprador,
            totalEuros: 0,
            varPorcTotal: 0,
            mejoresFamilias: Array(5).fill({ nombre: '', totalEuros: 0, varPorc: 0 }),
        }));
    };
    
    const createSeccionData = (): SeccionData => ({
        pesoPorc: 0,
        metricasPrincipales: { totalEuros: 0, varPorcEuros: 0, totalUnidades: 0, varPorcUnidades: 0 },
        desglose: [
            { seccion: "Ropa", totalEuros: 0, varPorc: 0 },
            { seccion: "Calzado", totalEuros: 0, varPorc: 0 },
            { seccion: "Perfumería", totalEuros: 0, varPorc: 0 }
        ]
    });
    
     const createSeccionAqneData = (): SeccionAqneData => ({
        pesoPorc: 0,
        metricasPrincipales: { totalEuros: 0, varPorcEuros: 0, totalUnidades: 0, varPorcUnidades: 0 },
        desglose: [
            { seccion: "Ropa", totalEuros: 0, varPorc: 0 },
            { seccion: "Calzado", totalEuros: 0, varPorc: 0 },
            { seccion: "Perfumería", totalEuros: 0, varPorc: 0 }
        ]
    });

    const createAcumuladoPeriodo = (): AcumuladoPeriodo => ({
        totalEuros: 0, varPorcTotal: 0, importeIpod: 0, varPorcIpod: 0, sint: 0, varPorcSint: 0,
        desglose: [
            { nombre: "Woman", totalEuros: 0, varPorc: 0, pesoPorc: 0 },
            { nombre: "Man", totalEuros: 0, varPorc: 0, pesoPorc: 0 },
            { nombre: "Niño", totalEuros: 0, varPorc: 0, pesoPorc: 0 }
        ]
    });


    return {
        periodo: weekId.toUpperCase().replace('-', ' '),
        listas: lists,
        ventas: { totalEuros: 0, varPorcEuros: 0, totalUnidades: 0, varPorcUnidades: 0 },
        rendimientoTienda: { trafico: 0, varPorcTrafico: 0, conversion: 0, varPorcConversion: 0 },
        general: createInitialSectionSpecificData(),
        man: createInitialSectionSpecificData(),
        woman: createInitialSectionSpecificData(),
        nino: createInitialSectionSpecificData(),
        datosPorSeccion: {
            man: createSeccionData(),
            woman: createSeccionData(),
            nino: createSeccionData()
        },
        ventasMan: {
            pesoComprador: createVentasManItems(lists?.compradorMan),
            zonaComercial: createVentasManItems(lists?.zonaComercialMan),
            agrupacionComercial: createVentasManItems(lists?.agrupacionComercialMan)
        },
        aqneSemanal: {
            man: createSeccionAqneData(),
            woman: createSeccionAqneData(),
            nino: createSeccionAqneData()
        },
        aqneNino: createInitialAqneNinoData(),
        ventasCompradorNino: createVentasCompradorNinoItems(lists.compradorNino),
        ventasDiariasAQNE: [
            { dia: "LUNES", total: 0, woman: 0, man: 0, nino: 0 },
            { dia: "MARTES", total: 0, woman: 0, man: 0, nino: 0 },
            { dia: "MIÉRCOLES", total: 0, woman: 0, man: 0, nino: 0 },
            { dia: "JUEVES", total: 0, woman: 0, man: 0, nino: 0 },
            { dia: "VIERNES", total: 0, woman: 0, man: 0, nino: 0 },
            { dia: "SÁBADO", total: 0, woman: 0, man: 0, nino: 0 },
            { dia: "DOMINGO", total: 0, woman: 0, man: 0, nino: 0 }
        ],
        focusSemanal: {
          man: "",
          woman: "",
          nino: "",
          experiencia: ""
        },
        focusOperaciones: "",
        notasMerma: "",
        notasReposicion: "",
        experiencia: {
            texto: "",
            focus: "",
        },
        pedidos: createInitialPedidosData(),
        encuestasQr: {
            respuestas: 0,
            planta: 0,
            tallas: 0,
            online: 0,
            probador: 0,
            caja: 0,
            respuestasPositivas: {
                respuesta1: "",
                respuesta2: ""
            },
            aMejorar: {
                respuesta1: "",
                respuesta2: ""
            }
        },
        incorporaciones: [],
        productividad: {
            lunes: createInitialProductividadData(),
            jueves: createInitialProductividadData(),
        },
        planningSemanal: createInitialPlanningSemanal(),
        acumulado: {
            mensual: createAcumuladoPeriodo(),
            anual: createAcumuladoPeriodo(),
        },
        ventasWoman: {
            pesoComprador: createVentasManItems(lists?.compradorWoman),
            zonaComercial: createVentasManItems(lists?.zonaComercialWoman),
            agrupacionComercial: createVentasManItems(lists?.agrupacionComercialWoman)
        },
        ventasNino: {
            pesoComprador: createVentasManItems(lists?.compradorNino),
            zonaComercial: createVentasManItems(lists?.zonaComercialNino),
            agrupacionComercial: createVentasManItems(lists?.agrupacionComercialNino)
        },
        ventasExperiencia: {
            pesoComprador: []
        },
    };
}
