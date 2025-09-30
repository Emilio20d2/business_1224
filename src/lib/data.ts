

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
        importe: number;
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
            { id: "470355", nombre: "MIRIAM GIMENO" },
            { id: "115501", nombre: "ANA ISABEL HERNANDEZ" },
            { id: "340752", nombre: "SARA NAGER" },
            { id: "437117", nombre: "VIOLETA SIMON" },
            { id: "14798", nombre: "ANDREA LAPUENTE" },
            { id: "458410", nombre: "SERGIO NAVARRO" },
            { id: "473138", nombre: "LAURA ALVAREZ" },
            { id: "1449", nombre: "IRENE GOMEZ" },
            { id: "361204", nombre: "PILAR LEZCANO" },
            { id: "1439", nombre: "DAVID DOMINGUEZ" },
            { id: "341289", nombre: "ALBA CAMPILLOS" },
            { id: "539061", nombre: "MARIA PILAR TELLO" },
            { id: "39423", nombre: "ANDREA CARCELLER" },
            { id: "13884", nombre: "ELENA GOMEZ" },
            { id: "74429", nombre: "ADRIANA MOLINA" },
            { id: "14736", nombre: "YAIZA PEREZ" },
            { id: "532309", nombre: "NICOLAS GIMENEZ" },
            { id: "333140", nombre: "ISABEL MARTIN" },
            { id: "22091", nombre: "ANDREA CORDOBA" },
            { id: "530869", nombre: "ANA CRISTINA NAVARRO" },
            { id: "473142", nombre: "PAULA SAMPER" },
            { id: "461021", nombre: "ALBA GASCON" },
            { id: "166946", nombre: "ALBERTO GRACIA" },
            { id: "172491", nombre: "ANDREA MARTINEZ" },
            { id: "172825", nombre: "LUCIA NAVARRO" },
            { id: "173429", nombre: "LEYRE ALONSO" },
            { id: "173873", nombre: "ZULAY CARPIO" },
            { id: "174415", nombre: "ANGELA ADIEGO" },
            { id: "174669", nombre: "SAHARA ALGUACIL" },
            { id: "175184", nombre: "JOSE MANUEL GARCIA" },
            { id: "175437", nombre: "SALMA SADIKI" },
            { id: "175525", nombre: "PAULA MOLINA" },
            { id: "175960", nombre: "ALBA REDONDO" },
            { id: "176100", nombre: "ADRIAN MARTIN" },
            { id: "176166", nombre: "LUCIA IBAÑEZ" },
            { id: "176211", nombre: "JOSE ANTONIO ALARCON" },
            { id: "176212", nombre: "ANGELA NAVARRO" },
            { id: "176464", nombre: "LUCIA BUENDIA" },
            { id: "176523", nombre: "LUCIA VALERO" },
            { id: "176657", nombre: "LAURA GIL" },
            { id: "176755", nombre: "NEREA DEL BARRIO" },
            { id: "176880", nombre: "CECILIA REDRADO" },
            { id: "177248", nombre: "ALICIA GRACIA" },
            { id: "177309", nombre: "PALOMA GIL" },
            { id: "177319", nombre: "ISABEL ALARCON" },
            { id: "177382", nombre: "TERESA MARTIN" },
            { id: "177437", nombre: "PILAR MALLEN" },
            { id: "177579", nombre: "RAQUEL IBAÑEZ" },
            { id: "177659", nombre: "INMACULADA PI" },
            { id: "177800", nombre: "MAITE LACUEVA" },
            { id: "177810", nombre: "SARA ALADREN" },
            { id: "177931", nombre: "MARIA LOBERA" },
            { id: "178005", nombre: "CRISTINA MARTIN" },
            { id: "178125", nombre: "NOELIA SANCHEZ" },
            { id: "178184", nombre: "CELIA ORBEGOZO" },
            { id: "178229", nombre: "LAURA PEREZ" },
            { id: "178250", nombre: "CLAUDIA MARTIN" },
            { id: "178306", nombre: "DAVID GONZALEZ" },
            { id: "178330", nombre: "MARIA ISABEL MARIN" },
            { id: "178331", nombre: "ALBA NADAL" },
            { id: "178332", nombre: "LAURA BLANCO" },
            { id: "178358", nombre: "MARINA PEREZ" },
            { id: "178370", nombre: "SOFIA RODRIGUEZ" },
            { id: "178426", nombre: "MARIA DEL MAR SERRANO" },
            { id: "178465", nombre: "ELISA BELTRAN" },
            { id: "178553", nombre: "ELISA LOREN" },
            { id: "178558", nombre: "ANA CARMEN ASCENSION" },
            { id: "178564", nombre: "LUCIA LOPEZ" },
            { id: "178604", nombre: "ANA BELEN VAZQUEZ" },
            { id: "178627", nombre: "LARA CALVO" },
            { id: "178663", nombre: "PAULA GOMEZ" },
            { id: "178665", nombre: "NOELIA ROYO" },
            { id: "178676", nombre: "SARA MARTINEZ" },
            { id: "178678", nombre: "MARIA TERESA NAVARRETE" },
            { id: "178712", nombre: "ANA ARANDA" },
            { id: "178714", nombre: "ANA BLASCO" },
            { id: "178720", nombre: "LAURA PEREZ" },
            { id: "178759", nombre: "ANDREA LASIERRA" },
            { id: "178768", nombre: "SARA BENAGLIA" },
            { id: "178772", nombre: "MARIA ANGELES AGUILERA" },
            { id: "178822", nombre: "VERONICA ORTIZ" },
            { id: "178832", nombre: "MARIA TERESA ARGUEDAS" },
            { id: "178855", nombre: "JESSICA LAPUENTE" },
            { id: "178912", nombre: "ALBA SANZ" },
            { id: "178922", nombre: "MARIA JOSE ROYO" },
            { id: "178928", nombre: "LAURA LACUEVA" },
            { id: "178930", nombre: "NEREA GARCIA" },
            { id: "178942", nombre: "CLAUDIA SANZ" },
            { id: "178943", nombre: "MARIA DEL MAR MORENO" },
            { id: "178952", nombre: "ANDREA GARCIA" },
            { id: "178953", nombre: "LUCIA FERRER" },
            { id: "178955", nombre: "MARIA JOSE AGUILAR" },
            { id: "178956", nombre: "ALBA SANCHEZ" },
            { id: "178961", nombre: "MARIA VICTORIA SANCHEZ" },
            { id: "178972", nombre: "RAUL AGUADO" },
            { id: "178973", nombre: "SHEILA ORTIZ" },
            { id: "178978", nombre: "MARIA CRISTINA PEREZ" },
            { id: "178979", nombre: "NOELIA SANCHEZ" },
            { id: "178980", nombre: "MARIA PILAR LACUEVA" },
            { id: "178982", nombre: "ANA ISABEL PEREZ" },
            { id: "178984", nombre: "LAURA SANCHEZ" },
            { id: "178985", nombre: "MARIA JOSEFINA PLOU" },
            { id: "178986", nombre: "MARIA ISABEL LOREN" },
            { id: "178987", nombre: "NEREA IBAÑEZ" },
            { id: "178988", nombre: "MARIA PILAR MALLEN" },
            { id: "178989", nombre: "ANA ISABEL GARCIA" },
            { id: "178990", nombre: "PATRICIA MARIN" },
            { id: "178991", nombre: "LAURA GARCIA" },
            { id: "178992", nombre: "MARIA TERESA DEL RIO" },
            { id: "178993", nombre: "MARIA PILAR DEL RIO" },
            { id: "178994", nombre: "ANDREA BLASCO" },
            { id: "178995", nombre: "MARIA JESUS PLOU" },
            { id: "178996", nombre: "DAVID NAVARRO" },
            { id: "178997", nombre: "LUCIA MARTIN" },
            { id: "178998", nombre: "ADRIAN GIL" },
            { id: "178999", nombre: "ISABEL LACUEVA" },
            { id: "179000", nombre: "RAQUEL SANCHEZ" },
            { id: "179001", nombre: "MARIA ANGELES GIL" },
            { id: "179002", nombre: "NOELIA IBAÑEZ" },
            { id: "179003", nombre: "PILAR PEREZ" },
            { id: "179004", nombre: "LUCIA GIL" },
            { id: "179006", nombre: "SARA GARCIA" },
            { id: "179007", nombre: "ANA ISABEL MARIN" },
            { id: "179008", nombre: "VERONICA LACUEVA" },
            { id: "179009", nombre: "DAVID GONZALEZ" },
            { id: "179010", nombre: "ALBA PLOU" },
            { id: "179011", nombre: "DAVID PLOU" },
            { id: "179012", nombre: "JOSE MANUEL MARIN" },
            { id: "179013", nombre: "SARA GIMENEZ" },
            { id: "179014", nombre: "MARIA CRISTINA ROYO" },
            { id: "179015", nombre: "MARIA PILAR BLASCO" },
            { id: "179016", nombre: "MARIA PILAR GIMENEZ" },
            { id: "179017", nombre: "ANA ISABEL GOMEZ" },
            { id: "179018", nombre: "LUCIA ROYO" },
            { id: "179019", nombre: "ANA ISABEL ROYO" },
            { id: "179020", nombre: "LUCIA IBAÑEZ" },
            { id: "179021", nombre: "ALBA ROYO" },
            { id: "179022", nombre: "RAQUEL GOMEZ" },
            { id: "179023", nombre: "MARIA CRISTINA GOMEZ" },
            { id: "179024", nombre: "MARIA JOSE GIMENEZ" },
            { id: "179025", nombre: "MARIA TERESA ROYO" },
            { id: "179026", nombre: "SHEILA IBAÑEZ" },
            { id: "179027", nombre: "MARIA CRISTINA IBAÑEZ" },
            { id: "179028", nombre: "MARIA PILAR ROYO" },
            { id: "179029", nombre: "ANA BELEN PLOU" },
            { id: "179030", nombre: "JOSE MANUEL ROYO" },
            { id: "179031", nombre: "ANA CRISTINA ROYO" },
            { id: "179032", nombre: "JOSE ANTONIO ROYO" },
            { id: "179033", nombre: "MARIA CRISTINA BLASCO" },
            { id: "179034", nombre: "MARIA TERESA GOMEZ" },
            { id: "179035", nombre: "NOELIA GIMENEZ" },
            { id: "179036", nombre: "DAVID BLASCO" },
            { id: "179037", nombre: "RAUL ROYO" },
            { id: "179038", nombre: "MARIA TERESA BLASCO" },
            { id: "179039", nombre: "MARIA JOSE ROYO" },
            { id: "179040", nombre: "MARIA JOSE BLASCO" },
            { id: "179041", nombre: "ANA CRISTINA GIMENEZ" },
            { id: "179042", nombre: "JOSE ANTONIO GIMENEZ" },
            { id: "179043", nombre: "DAVID GIMENEZ" },
            { id: "179044", nombre: "JOSE MANUEL GIMENEZ" },
            { id: "179045", nombre: "ANA BELEN GIMENEZ" },
            { id: "179046", nombre: "ANA ISABEL BLASCO" },
            { id: "179047", nombre: "MARIA PILAR GOMEZ" },
            { id: "179048", nombre: "ANA CRISTINA BLASCO" },
            { id: "179049", nombre: "RAUL GIMENEZ" },
            { id: "179050", nombre: "MARIA ANGELES ROYO" },
            { id: "179051", nombre: "ANA BELEN ROYO" },
            { id: "179052", nombre: "JOSE ANTONIO BLASCO" },
            { id: "179053", nombre: "RAUL BLASCO" },
            { id: "179054", nombre: "MARIA ANGELES GIMENEZ" },
            { id: "179055", nombre: "DAVID ROYO" },
            { id: "179056", nombre: "JOSE MANUEL BLASCO" },
            { id: "179057", nombre: "NOELIA ROYO" }
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
        pedidos: {
            rankingNacional: 0,
            pedidosDia: 0,
            unidadesDia: 0,
            objetivoSemanal: 0,
            pedidosDiaSemanaAnterior: 0,
            pedidosDiaSemanaProxima: 0,
            pedidosIpodExpirados: 0,
            rankingEmpleados: []
        },
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
