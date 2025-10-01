

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
};

export type PerdidasData = {
    gap: {
        euros: number;
        unidades: number;
    };
    merma: {
        unidades: number;
        porcentaje: number;
    };
};

export type SectionSpecificData = {
    operaciones: OperacionesData;
    perdidas: PerdidasData;
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
        compradorMan: string[];
        zonaComercialMan: string[];
        agrupacionComercialMan: string[];
        compradorWoman: string[];
        zonaComercialWoman: string[];
        agrupacionComercialWoman: string[];
        compradorNino: string[];
        zonaComercialNino: string[];
        agrupacionComercialNino: string[];
        compradorExperiencia: string[];
        empleados: Empleado[];
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
    logistica: {
        entradasSemanales: number;
        salidasSemanales: number;
    };
    almacenes: {
        ropa: Almacen;
        calzado: Almacen;
        perfumeria: Almacen;
    };
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
    experiencia: {
      texto: string;
      focus: string;
    };
    pedidos: PedidosData;
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
        compradorMan: ["Comprador A", "Comprador B", "Comprador C"],
        zonaComercialMan: ["Zona 1", "Zona 2", "Zona 3"],
        agrupacionComercialMan: ["Grupo Alpha", "Grupo Beta", "Grupo Gamma"],
        compradorWoman: ["WOMAN", "GLOBAL", "CIRCULAR", "DNWR", "SPORT", "ACCES", "BASIC"],
        zonaComercialWoman: ["WOMAN FORMAL", "GLB URBAN", "CIRCULAR"],
        agrupacionComercialWoman: ["PANTALON", "SASTRERIA", "TEJANO", "CAMISA", "POLO", "ZAPATO", "BERMUDA", "TRICOT", "ACCESORIOS", "BAÑO"],
        compradorNino: ["NIÑO", "GLOBAL", "CIRCULAR", "DNWR", "SPORT", "ACCES", "BASIC"],
        zonaComercialNino: ["NIÑO FORMAL", "GLB URBAN", "CIRCULAR"],
        agrupacionComercialNino: ["PANTALON", "SASTRERIA", "TEJANO", "CAMISA", "POLO", "ZAPATO", "BERMUDA", "TRICOT", "ACCESORIOS", "BAÑO"],
        compradorExperiencia: ["EXP 1", "EXP 2"],
        empleados: [
            { id: '178306', nombre: 'GONZALEZ, DAVID' },
            { id: '176100', nombre: 'MARTIN, ADRIAN' },
            { id: '458410', nombre: 'NAVARRO, SERGIO' },
            { id: '166946', nombre: 'GRACIA, ALBERTO' },
            { id: '1439', nombre: 'DOMINGUEZ, DAVID' },
            { id: '175184', nombre: 'GARCIA, JOSE MANUEL' },
            { id: '176211', nombre: 'ALARCON, JOSE ANTONIO' },
            { id: '178972', nombre: 'AGUADO, RAUL' },
            { id: '532309', nombre: 'GIMENEZ, NICOLAS' },
            { id: '470355', nombre: 'GIMENO, MIRIAM' },
            { id: '115501', nombre: 'HERNANDEZ, ANA ISABEL' },
            { id: '340752', nombre: 'NAGER, SARA' },
            { id: '437117', nombre: 'SIMON, VIOLETA' },
            { id: '14798', nombre: 'LAPUENTE, ANDREA' },
            { id: '473138', nombre: 'ALVAREZ, LAURA' },
            { id: '1449', nombre: 'GOMEZ, IRENE' },
            { id: '361204', nombre: 'LEZCANO, PILAR' },
            { id: '341289', nombre: 'CAMPILLOS, ALBA' },
            { id: '539061', nombre: 'TELLO, MARIA PILAR' },
            { id: '39423', nombre: 'CARCELLER, ANDREA' },
            { id: '13884', nombre: 'GOMEZ, ELENA' },
            { id: '74429', nombre: 'MOLINA, ADRIANA' },
            { id: '14736', nombre: 'PEREZ, YAIZA' },
            { id: '333140', nombre: 'MARTIN, ISABEL' },
            { id: '22091', nombre: 'CORDOBA, ANDREA' },
            { id: '530869', nombre: 'NAVARRO, ANA CRISTINA' },
            { id: '473142', nombre: 'SAMPER, PAULA' },
            { id: '461021', nombre: 'GASCON, ALBA' },
            { id: '172491', nombre: 'MARTINEZ, ANDREA' },
            { id: '172825', nombre: 'NAVARRO, LUCIA' },
            { id: '173429', nombre: 'ALONSO, LEYRE' },
            { id: '173873', nombre: 'CARPIO, ZULAY' },
            { id: '174415', nombre: 'ADIEGO, ANGELA' },
            { id: '174669', nombre: 'ALGUACIL, SAHARA' },
            { id: '175437', nombre: 'SADIKI, SALMA' },
            { id: '175525', nombre: 'MOLINA, PAULA' },
            { id: '175960', nombre: 'REDONDO, ALBA' },
            { id: '176166', nombre: 'IBAÑEZ, LUCIA' },
            { id: '176212', nombre: 'NAVARRO, ANGELA' },
            { id: '176464', nombre: 'BUENDIA, LUCIA' },
            { id: '176523', nombre: 'VALERO, LUCIA' },
            { id: '176657', nombre: 'GIL, LAURA' },
            { id: '176755', nombre: 'DEL BARRIO, NEREA' },
            { id: '176880', nombre: 'REDRADO, CECILIA' },
            { id: '177248', nombre: 'GRACIA, ALICIA' },
            { id: '177309', nombre: 'GIL, PALOMA' },
            { id: '177319', nombre: 'ALARCON, ISABEL' },
            { id: '177382', nombre: 'MARTIN, TERESA' },
            { id: '177437', nombre: 'MALLEN, PILAR' },
            { id: '177579', nombre: 'IBAÑEZ, RAQUEL' },
            { id: '177659', nombre: 'PI, INMACULADA' },
            { id: '177800', nombre: 'LACUEVA, MAITE' },
            { id: '177810', nombre: 'ALADREN, SARA' },
            { id: '177931', nombre: 'LOBERA, MARIA' },
            { id: '178005', nombre: 'MARTIN, CRISTINA' },
            { id: '178125', nombre: 'SANCHEZ, NOELIA' },
            { id: '178184', nombre: 'ORBEGOZO, CELIA' },
            { id: '178229', nombre: 'PEREZ, LAURA' },
            { id: '178250', nombre: 'MARTIN, CLAUDIA' },
            { id: '178330', nombre: 'MARIN, MARIA ISABEL' },
            { id: '178331', nombre: 'NADAL, ALBA' },
            { id: '178332', nombre: 'BLANCO, LAURA' },
            { id: '178358', nombre: 'PEREZ, MARINA' },
            { id: '178370', nombre: 'RODRIGUEZ, SOFIA' },
            { id: '178426', nombre: 'SERRANO, MARIA DEL MAR' },
            { id: '178465', nombre: 'BELTRAN, ELISA' },
            { id: '178553', nombre: 'LOREN, ELISA' },
            { id: '178558', nombre: 'ASCENSION, ANA CARMEN' },
            { id: '178564', nombre: 'LOPEZ, LUCIA' },
            { id: '178604', nombre: 'VAZQUEZ, ANA BELEN' },
            { id: '178627', nombre: 'CALVO, LARA' },
            { id: '178663', nombre: 'GOMEZ, PAULA' },
            { id: '178665', nombre: 'ROYO, NOELIA' },
            { id: '178676', nombre: 'MARTINEZ, SARA' },
            { id: '178678', nombre: 'NAVARRETE, MARIA TERESA' },
            { id: '178712', nombre: 'ARANDA, ANA' },
            { id: '178714', nombre: 'BLASCO, ANA' },
            { id: '178720', nombre: 'PEREZ, LAURA' },
            { id: '178759', nombre: 'LASIERRA, ANDREA' },
            { id: '178768', nombre: 'BENAGLIA, SARA' },
            { id: '178772', nombre: 'AGUILERA, MARIA ANGELES' },
            { id: '178822', nombre: 'ORTIZ, VERONICA' },
            { id: '178832', nombre: 'ARGUEDAS, MARIA TERESA' },
            { id: '178855', nombre: 'LAPUENTE, JESSICA' },
            { id: '178912', nombre: 'SANZ, ALBA' },
            { id: '178922', nombre: 'ROYO, MARIA JOSE' },
            { id: '178928', nombre: 'LACUEVA, LAURA' },
            { id: '178930', nombre: 'GARCIA, NEREA' },
            { id: '178942', nombre: 'SANZ, CLAUDIA' },
            { id: '178943', nombre: 'MORENO, MARIA DEL MAR' },
            { id: '178952', nombre: 'GARCIA, ANDREA' },
            { id: '178953', nombre: 'FERRER, LUCIA' },
            { id: '178955', nombre: 'AGUILAR, MARIA JOSE' },
            { id: '178956', nombre: 'SANCHEZ, ALBA' },
            { id: '178961', nombre: 'SANCHEZ, MARIA VICTORIA' },
            { id: '178973', nombre: 'ORTIZ, SHEILA' },
            { id: '178978', nombre: 'PEREZ, MARIA CRISTINA' },
            { id: '178979', nombre: 'SANCHEZ, NOELIA' },
            { id: '178980', nombre: 'LACUEVA, MARIA PILAR' },
            { id: '178982', nombre: 'PEREZ, ANA ISABEL' },
            { id: '178984', nombre: 'SANCHEZ, LAURA' },
            { id: '178985', nombre: 'PLOU, MARIA JOSEFINA' },
            { id: '178986', nombre: 'LOREN, MARIA ISABEL' },
            { id: '178987', nombre: 'IBAÑEZ, NEREA' },
            { id: '178988', nombre: 'MALLEN, MARIA PILAR' },
            { id: '178989', nombre: 'GARCIA, ANA ISABEL' },
            { id: '178990', nombre: 'MARIN, PATRICIA' },
            { id: '178991', nombre: 'GARCIA, LAURA' },
            { id: '178992', nombre: 'DEL RIO, MARIA TERESA' },
            { id: '178993', nombre: 'DEL RIO, MARIA PILAR' },
            { id: '178994', nombre: 'BLASCO, ANDREA' },
            { id: '178995', nombre: 'PLOU, MARIA JESUS' },
            { id: '178996', nombre: 'NAVARRO, DAVID' },
            { id: '178997', nombre: 'MARTIN, LUCIA' },
            { id: '178998', nombre: 'GIL, ADRIAN' },
            { id: '178999', nombre: 'LACUEVA, ISABEL' },
            { id: '179000', nombre: 'SANCHEZ, RAQUEL' },
            { id: '179001', nombre: 'GIL, MARIA ANGELES' },
            { id: '179002', nombre: 'IBAÑEZ, NOELIA' },
            { id: '179003', nombre: 'PEREZ, PILAR' },
            { id: '179004', nombre: 'GIL, LUCIA' },
            { id: '179006', nombre: 'GARCIA, SARA' },
            { id: '179007', nombre: 'MARIN, ANA ISABEL' },
            { id: '179008', nombre: 'LACUEVA, VERONICA' },
            { id: '179009', nombre: 'GONZALEZ, DAVID' },
            { id: '179010', nombre: 'PLOU, ALBA' },
            { id: '179011', nombre: 'PLOU, DAVID' },
            { id: '179012', nombre: 'MARIN, JOSE MANUEL' },
            { id: '179013', nombre: 'GIMENEZ, SARA' },
            { id: '179014', nombre: 'ROYO, MARIA CRISTINA' },
            { id: '179015', nombre: 'BLASCO, MARIA PILAR' },
            { id: '179016', nombre: 'GIMENEZ, MARIA PILAR' },
            { id: '179017', nombre: 'GOMEZ, ANA ISABEL' },
            { id: '179018', nombre: 'ROYO, LUCIA' },
            { id: '179019', nombre: 'ROYO, ANA ISABEL' },
            { id: '179020', nombre: 'IBAÑEZ, LUCIA' },
            { id: '179021', nombre: 'ROYO, ALBA' },
            { id: '179022', nombre: 'GOMEZ, RAQUEL' },
            { id: '179023', nombre: 'GOMEZ, MARIA CRISTINA' },
            { id: '179024', nombre: 'GIMENEZ, MARIA JOSE' },
            { id: '179025', nombre: 'ROYO, MARIA TERESA' },
            { id: '179026', nombre: 'IBAÑEZ, SHEILA' },
            { id: '179027', nombre: 'IBAÑEZ, MARIA CRISTINA' },
            { id: '179028', nombre: 'ROYO, MARIA PILAR' },
            { id: '179029', nombre: 'PLOU, ANA BELEN' },
            { id: '179030', nombre: 'ROYO, JOSE MANUEL' },
            { id: '179031', nombre: 'ROYO, ANA CRISTINA' },
            { id: '179032', nombre: 'ROYO, JOSE ANTONIO' },
            { id: '179033', nombre: 'BLASCO, MARIA CRISTINA' },
            { id: '179034', nombre: 'GOMEZ, MARIA TERESA' },
            { id: '179035', nombre: 'GIMENEZ, NOELIA' },
            { id: '179036', nombre: 'BLASCO, DAVID' },
            { id: '179037', nombre: 'ROYO, RAUL' },
            { id: '179038', nombre: 'BLASCO, MARIA TERESA' },
            { id: '179039', nombre: 'ROYO, MARIA JOSE' },
            { id: '179040', nombre: 'BLASCO, MARIA JOSE' },
            { id: '179041', nombre: 'GIMENEZ, ANA CRISTINA' },
            { id: '179042', nombre: 'GIMENEZ, JOSE ANTONIO' },
            { id: '179043', nombre: 'GIMENEZ, DAVID' },
            { id: '179044', nombre: 'GIMENEZ, JOSE MANUEL' },
            { id: '179045', nombre: 'GIMENEZ, ANA BELEN' },
            { id: '179046', nombre: 'BLASCO, ANA ISABEL' },
            { id: '179047', nombre: 'GOMEZ, MARIA PILAR' },
            { id: '179048', nombre: 'BLASCO, ANA CRISTINA' },
            { id: '179049', nombre: 'GIMENEZ, RAUL' },
            { id: '179050', nombre: 'ROYO, MARIA ANGELES' },
            { id: '179051', nombre: 'ROYO, ANA BELEN' },
            { id: '179052', nombre: 'BLASCO, JOSE ANTONIO' },
            { id: '179053', nombre: 'BLASCO, RAUL' },
            { id: '179054', nombre: 'GIMENEZ, MARIA ANGELES' },
            { id: '179055', nombre: 'ROYO, DAVID' },
            { id: '179056', nombre: 'BLASCO, JOSE MANUEL' },
            { id: '179057', nombre: 'ROYO, NOELIA' }
        ]
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
        frescuraPorc: 0
    },
    perdidas: {
        gap: { euros: 0, unidades: 0 },
        merma: { unidades: 0, porcentaje: 0 }
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
    rankingEmpleados: Array.from({ length: 10 }, () => ({ id: '', nombre: '', pedidos: 0, unidades: 0 }))
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
        logistica: { entradasSemanales: 0, salidasSemanales: 0 },
        almacenes: {
            ropa: { ocupacionPorc: 0, devolucionUnidades: 0, entradas: 0, salidas: 0 },
            calzado: { ocupacionPorc: 0, devolucionUnidades: 0, entradas: 0, salidas: 0 },
            perfumeria: { ocupacionPorc: 0, devolucionUnidades: null, entradas: 0, salidas: 0 }
        },
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
        experiencia: {
            texto: "",
            focus: "",
        },
        pedidos: createInitialPedidosData(),
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
            pesoComprador: createVentasManItems(lists?.compradorExperiencia)
        },
    };
}

    