

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
    seccion: 'woman' | 'man' | 'nino' | '';
    notas: string;
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
    }[];
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
    ventasDiariasAQNE: VentaDiaria[];
    focusSemanal: {
      man: string;
      woman: string;
      nino: string;
      experiencia: string;
    };
    focusOperaciones: string;
    experiencia: {
      texto: string;
      focus: string;
    };
    pedidos: PedidosData;
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
        empleados: [
            { id: "361204", nombre: "ALBA PIÑEIRO PEREZ" },
            { id: "157207", nombre: "ALBERTO BIEL GAUDES" },
            { id: "421807", nombre: "ALBERTO JAVIER MONDEJAR BELTRAN" },
            { id: "295711", nombre: "ALEJANDRO MAYORAL MORON" },
            { id: "542046", nombre: "ALVARO ECHEGOYEN DE GREGORIO ROCASOLA" },
            { id: "142147", nombre: "ANA GOMEZ ALAMAN" },
            { id: "363991", nombre: "ANA GRACIA SANCHEZ" },
            { id: "180935", nombre: "ANA MARIA IVANOV" },
            { id: "84889", nombre: "ANDREA MARIA BURILLO FRANCES" },
            { id: "470355", nombre: "ANDREA RUIZ GRACIA" },
            { id: "409261", nombre: "BEATRIZ MERCEDES MORELLI DELGADO" },
            { id: "88026", nombre: "BRENDA CASTAN MARGALEJO" },
            { id: "408387", nombre: "CANDELA GIMENEZ BARCA" },
            { id: "371177", nombre: "CARMEN DOÑATE BANEGAS" },
            { id: "533309", nombre: "CARMEN LUCIA URCIA MARCOS" },
            { id: "136213", nombre: "CAROLINA PEREZ SANCHEZ" },
            { id: "343640", nombre: "CELIA LAIRLA SAN JOSE" },
            { id: "458410", nombre: "CLEMENTE ALUNDA CAÑET" },
            { id: "13884", nombre: "CRISTINA UCHE CHAURE" },
            { id: "131951", nombre: "CRISTINA VIDAL CASTIELLO" },
            { id: "529725", nombre: "CRISTOBAL ANDRES FREDES CACERES" },
            { id: "59295", nombre: "ELISABETH GONZALEZ SERRANO" },
            { id: "46319", nombre: "EMILIO GOMEZ PARDO" },
            { id: "15351", nombre: "ESTIBALIZ MUÑOZ ALONSO" },
            { id: "1449", nombre: "EVA MARIA NUEZ SIERRA" },
            { id: "471918", nombre: "GABRIELA ALVAREZ MARTIN" },
            { id: "51614", nombre: "GEMA LAURA CALVO AINSA" },
            { id: "14736", nombre: "GEMMA RUIZ CEJUDO" },
            { id: "524832", nombre: "GUILLERMO SORIA MODREGO" },
            { id: "172543", nombre: "IRIS GIMENEZ MUÑOZ" },
            { id: "407853", nombre: "ISABEL GARCIA TERES" },
            { id: "439331", nombre: "JAVIER CORTES REMACHA" },
            { id: "146999", nombre: "JESSICA LATORRE NAVARRO" },
            { id: "179226", nombre: "JOHANNA ANDREA PAUCAR LEONES" },
            { id: "14767", nombre: "LAURA CASAS TURON" },
            { id: "531642", nombre: "LAURA DE DIEGO LATORRE" },
            { id: "339463", nombre: "LENA RODRIGUEZ MONTOYA" },
            { id: "41035", nombre: "LEYRE ORDOÑEZ VELASCO" },
            { id: "459380", nombre: "LORENA LOZANO LLES" },
            { id: "185308", nombre: "LORENA NAVARRO CASTELLOT" },
            { id: "179373", nombre: "MARIA ANGELES IBUARBEN CATALAN" },
            { id: "14798", nombre: "MARIA ARANTXA GASCA JIMENEZ" },
            { id: "10535", nombre: "MARIA ARANTZAZU VILLACAMPA-GINER GARCIA" },
            { id: "242130", nombre: "MARIA CAMPILLO ARANDA" },
            { id: "1443", nombre: "MARIA CIPRIANA MONJE REBENAQUE" },
            { id: "96950", nombre: "MARIA JOSE MARTIN ALIAS" },
            { id: "104038", nombre: "MARIA JOSE ORTIZ RUEDA" },
            { id: "1439", nombre: "MARIA MAR GRACIA RECH" },
            { id: "485622", nombre: "MARIA MARTINEZ PEREZ" },
            { id: "53679", nombre: "MARIA PILAR SANCHEZ PEÑA" },
            { id: "473138", nombre: "MAXIMILIAN RIVALDO PETRISOR" },
            { id: "437117", nombre: "MIRIAM RODRIGUEZ GARCIA" },
            { id: "97081", nombre: "NATALIA AZNAR MARTIN" },
            { id: "459348", nombre: "NAWAL TEMSAH GHERNATI" },
            { id: "115501", nombre: "NOELIA LOPEZ PARDO" },
            { id: "51109", nombre: "NOELIA PARDO CALAVIA" },
            { id: "385361", nombre: "NOELIA VILLAR GRACIA" },
            { id: "1423", nombre: "OBDULIA SANCHEZ DOPICO" },
            { id: "341289", nombre: "PABLO LOPEZ MUOCO" },
            { id: "340752", nombre: "PAOLA LOPEZ GASCA" },
            { id: "170224", nombre: "PATRICIA MARCO CORVINOS" },
            { id: "535496", nombre: "PEDRO RAMIREZ CANO" },
            { id: "467578", nombre: "RAFFAELA DE LIMA REZENDE" },
            { id: "76663", nombre: "RAQUEL CHUECA PEREZ" },
            { id: "6951", nombre: "RAQUEL DOMINGO BERGES" },
            { id: "469776", nombre: "RAQUEL PLANAS CHOJOLAN" },
            { id: "135842", nombre: "RAQUEL VELASCO BENITO" },
            { id: "22638", nombre: "REBECA PASCUAL ANDRES" },
            { id: "497978", nombre: "SAMUEL RODRIGUEZ MUÑOZ" },
            { id: "476652", nombre: "SERGIO GALLEGO FRANCO" },
            { id: "18334", nombre: "SILVIA FEIJOO ROMEO" },
            { id: "132761", nombre: "SOFIA GALUCHINO BINABURO" },
            { id: "288486", nombre: "SOFIA OCHOA LASERNA" },
            { id: "13768", nombre: "SUSANA ALVARO NUEZ" },
            { id: "472505", nombre: "VALERIA TORRES PAÑOS" },
            { id: "39423", nombre: "VERONICA CLAVERIA RODRIGUEZ" },
            { id: "180335", nombre: "VERONICA DANIELA BABEANU" },
            { id: "74429", nombre: "VERONICA FRAJ CEBRINO" },
            { id: "5514", nombre: "VICTORIA BITRIAN POSTIGO" },
            { id: "462144", nombre: "YANIRA GIMENEZ SALESA" },
            { id: "467650", nombre: "YASMINA SANCHEZ GIMENEZ" },
            { id: "362456", nombre: "ZAINAB LKHADESSI" },
        ],
        compradorMan: ["Comprador A", "Comprador B", "Comprador C"],
        zonaComercialMan: ["Zona 1", "Zona 2", "Zona 3"],
        agrupacionComercialMan: ["Grupo Alpha", "Grupo Beta", "Grupo Gamma"],
        compradorWoman: ["WOMAN", "GLOBAL", "CIRCULAR", "DNWR", "SPORT", "ACCES", "BASIC"],
        zonaComercialWoman: ["WOMAN FORMAL", "GLB URBAN", "CIRCULAR"],
        agrupacionComercialWoman: ["PANTALON", "SASTRERIA", "TEJANO", "CAMISA", "POLO", "ZAPATO", "BERMUDA", "TRICOT", "ACCESORIOS", "BAÑO"],
        compradorNino: ["NIÑO", "GLOBAL", "CIRCULAR", "DNWR", "SPORT", "ACCES", "BASIC"],
        zonaComercialNino: ["NIÑO FORMAL", "GLB URBAN", "CIRCULAR"],
        agrupacionComercialNino: ["PANTALON", "SASTRERIA", "TEJANO", "CAMISA", "POLO", "ZAPATO", "BERMUDA", "TRICOT", "ACCESORIOS", "BAÑO"],
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
    })),
});

const createInitialProductividadSeccion = (): ProductividadSeccion => ({
    unidadesConfeccion: 0,
    unidadesPaqueteria: 0,
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
        experiencia: {
            texto: "",
            focus: "",
        },
        pedidos: createInitialPedidosData(),
        productividad: {
            lunes: createInitialProductividadData(),
            jueves: createInitialProductividadData(),
        },
        planningSemanal: createInitialPlanningSemanal(),
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

    
