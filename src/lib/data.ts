

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
            { id: "107293", nombre: "MIRIAM GIMENO" },
            { id: "123349", nombre: "ANA ISABEL HERNANDEZ" },
            { id: "135624", nombre: "SARA NAGER" },
            { id: "137021", nombre: "VIOLETA SIMON" },
            { id: "148281", nombre: "ANDREA LAPUENTE" },
            { id: "148293", nombre: "SERGIO NAVARRO" },
            { id: "160351", nombre: "LAURA ALVAREZ" },
            { id: "163654", nombre: "IRENE GOMEZ" },
            { id: "165319", nombre: "PILAR LEZCANO" },
            { id: "166946", nombre: "DAVID DOMINGUEZ" },
            { id: "172491", nombre: "ALBA CAMPILLOS" },
            { id: "172825", nombre: "MARIA PILAR TELLO" },
            { id: "173429", nombre: "ANDREA CARCELLER" },
            { id: "173873", nombre: "ELENA GOMEZ" },
            { id: "174415", nombre: "ADRIANA MOLINA" },
            { id: "174669", nombre: "YAIZA PEREZ" },
            { id: "175184", nombre: "NICOLAS GIMENEZ" },
            { id: "175437", nombre: "ISABEL MARTIN" },
            { id: "175525", nombre: "ANDREA CORDOBA" },
            { id: "175960", nombre: "ANA CRISTINA NAVARRO" },
            { id: "176100", nombre: "PAULA SAMPER" },
            { id: "176166", nombre: "ALBA GASCON" },
            { id: "176211", nombre: "ALBERTO GRACIA" },
            { id: "176212", nombre: "ANDREA MARTINEZ" },
            { id: "176464", nombre: "LUCIA NAVARRO" },
            { id: "176523", nombre: "LEYRE ALONSO" },
            { id: "176657", nombre: "ZULAY CARPIO" },
            { id: "176755", nombre: "ANGELA ADIEGO" },
            { id: "176880", nombre: "SAHARA ALGUACIL" },
            { id: "177248", nombre: "JOSE MANUEL GARCIA" },
            { id: "177309", nombre: "SALMA SADIKI" },
            { id: "177319", nombre: "PAULA MOLINA" },
            { id: "177382", nombre: "ALBA REDONDO" },
            { id: "177437", nombre: "ADRIAN MARTIN" },
            { id: "177579", nombre: "LUCIA IBAÑEZ" },
            { id: "177659", nombre: "JOSE ANTONIO ALARCON" },
            { id: "177800", nombre: "ANGELA NAVARRO" },
            { id: "177810", nombre: "LUCIA BUENDIA" },
            { id: "177931", nombre: "LUCIA VALERO" },
            { id: "178005", nombre: "LAURA GIL" },
            { id: "178125", nombre: "NEREA DEL BARRIO" },
            { id: "178184", nombre: "CECILIA REDRADO" },
            { id: "178229", nombre: "ALICIA GRACIA" },
            { id: "178250", nombre: "PALOMA GIL" },
            { id: "178306", nombre: "ISABEL ALARCON" },
            { id: "178330", nombre: "TERESA MARTIN" },
            { id: "178331", nombre: "PILAR MALLEN" },
            { id: "178332", nombre: "RAQUEL IBAÑEZ" },
            { id: "178358", nombre: "INMACULADA PI" },
            { id: "178370", nombre: "MAITE LACUEVA" },
            { id: "178426", nombre: "SARA ALADREN" },
            { id: "178465", nombre: "MARIA LOBERA" },
            { id: "178553", nombre: "CRISTINA MARTIN" },
            { id: "178558", nombre: "NOELIA SANCHEZ" },
            { id: "178564", nombre: "CELIA ORBEGOZO" },
            { id: "178604", nombre: "LAURA PEREZ" },
            { id: "178627", nombre: "CLAUDIA MARTIN" },
            { id: "178663", nombre: "DAVID GONZALEZ" },
            { id: "178665", nombre: "MARIA ISABEL MARIN" },
            { id: "178676", nombre: "ALBA NADAL" },
            { id: "178678", nombre: "LAURA BLANCO" },
            { id: "178712", nombre: "MARINA PEREZ" },
            { id: "178714", nombre: "SOFIA RODRIGUEZ" },
            { id: "178720", nombre: "MARIA DEL MAR SERRANO" },
            { id: "178759", nombre: "ELISA BELTRAN" },
            { id: "178768", nombre: "ELISA LOREN" },
            { id: "178772", nombre: "ANA CARMEN ASCENSION" },
            { id: "178822", nombre: "LUCIA LOPEZ" },
            { id: "178832", nombre: "ANA BELEN VAZQUEZ" },
            { id: "178855", nombre: "LARA CALVO" },
            { id: "178912", nombre: "PAULA GOMEZ" },
            { id: "178922", nombre: "NOELIA ROYO" },
            { id: "178928", nombre: "SARA MARTINEZ" },
            { id: "178930", nombre: "MARIA TERESA NAVARRETE" },
            { id: "178942", nombre: "ANA ARANDA" },
            { id: "178943", nombre: "ANA BLASCO" },
            { id: "178952", nombre: "LAURA PEREZ" },
            { id: "178953", nombre: "ANDREA LASIERRA" },
            { id: "178955", nombre: "SARA BENAGLIA" },
            { id: "178956", nombre: "MARIA ANGELES AGUILERA" },
            { id: "178961", nombre: "VERONICA ORTIZ" },
            { id: "178972", nombre: "MARIA TERESA ARGUEDAS" },
            { id: "178973", nombre: "JESSICA LAPUENTE" },
            { id: "178978", nombre: "ALBA SANZ" },
            { id: "178979", nombre: "MARIA JOSE ROYO" },
            { id: "178980", nombre: "LAURA LACUEVA" },
            { id: "178982", nombre: "NEREA GARCIA" },
            { id: "178984", nombre: "CLAUDIA SANZ" },
            { id: "178985", nombre: "MARIA DEL MAR MORENO" },
            { id: "178986", nombre: "ANDREA GARCIA" },
            { id: "178987", nombre: "LUCIA FERRER" },
            { id: "178988", nombre: "MARIA JOSE AGUILAR" },
            { id: "178989", nombre: "ALBA SANCHEZ" },
            { id: "178990", nombre: "MARIA VICTORIA SANCHEZ" },
            { id: "178991", nombre: "RAUL AGUADO" },
            { id: "178992", nombre: "SHEILA ORTIZ" },
            { id: "178993", nombre: "MARIA CRISTINA PEREZ" },
            { id: "178994", nombre: "NOELIA SANCHEZ" },
            { id: "178995", nombre: "MARIA PILAR LACUEVA" },
            { id: "178996", nombre: "ANA ISABEL PEREZ" },
            { id: "178997", nombre: "LAURA SANCHEZ" },
            { id: "178998", nombre: "MARIA JOSEFINA PLOU" },
            { id: "178999", nombre: "MARIA ISABEL LOREN" },
            { id: "179000", nombre: "NEREA IBAÑEZ" },
            { id: "179001", nombre: "MARIA PILAR MALLEN" },
            { id: "179002", nombre: "ANA ISABEL GARCIA" },
            { id: "179003", nombre: "PATRICIA MARIN" },
            { id: "179004", nombre: "LAURA GARCIA" },
            { id: "179006", nombre: "MARIA TERESA DEL RIO" },
            { id: "179007", nombre: "MARIA PILAR DEL RIO" },
            { id: "179008", nombre: "ANDREA BLASCO" },
            { id: "179009", nombre: "MARIA JESUS PLOU" },
            { id: "179010", nombre: "DAVID NAVARRO" },
            { id: "179011", nombre: "LUCIA MARTIN" },
            { id: "179012", nombre: "ADRIAN GIL" },
            { id: "179013", nombre: "ISABEL LACUEVA" },
            { id: "179014", nombre: "RAQUEL SANCHEZ" },
            { id: "179015", nombre: "MARIA ANGELES GIL" },
            { id: "179016", nombre: "NOELIA IBAÑEZ" },
            { id: "179017", nombre: "PILAR PEREZ" },
            { id: "179018", nombre: "LUCIA GIL" },
            { id: "179019", nombre: "SARA GARCIA" },
            { id: "179020", nombre: "ANA ISABEL MARIN" },
            { id: "179021", nombre: "VERONICA LACUEVA" },
            { id: "179022", nombre: "DAVID GONZALEZ" },
            { id: "179023", nombre: "ALBA PLOU" },
            { id: "179024", nombre: "DAVID PLOU" },
            { id: "179025", nombre: "JOSE MANUEL MARIN" },
            { id: "179026", nombre: "SARA GIMENEZ" },
            { id: "179027", nombre: "MARIA CRISTINA ROYO" },
            { id: "179028", nombre: "MARIA PILAR BLASCO" },
            { id: "179029", nombre: "MARIA PILAR GIMENEZ" },
            { id: "179030", nombre: "ANA ISABEL GOMEZ" },
            { id: "179031", nombre: "LUCIA ROYO" },
            { id: "179032", nombre: "ANA ISABEL ROYO" },
            { id: "179033", nombre: "LUCIA IBAÑEZ" },
            { id: "179034", nombre: "ALBA ROYO" },
            { id: "179035", nombre: "RAQUEL GOMEZ" },
            { id: "179036", nombre: "MARIA CRISTINA GOMEZ" },
            { id: "179037", nombre: "MARIA JOSE GIMENEZ" },
            { id: "179038", nombre: "MARIA TERESA ROYO" },
            { id: "179039", nombre: "SHEILA IBAÑEZ" },
            { id: "179040", nombre: "MARIA CRISTINA IBAÑEZ" },
            { id: "179041", nombre: "MARIA PILAR ROYO" },
            { id: "179042", nombre: "ANA BELEN PLOU" },
            { id: "179043", nombre: "JOSE MANUEL ROYO" },
            { id: "179044", nombre: "ANA CRISTINA ROYO" },
            { id: "179045", nombre: "JOSE ANTONIO ROYO" },
            { id: "179046", nombre: "MARIA CRISTINA BLASCO" },
            { id: "179047", nombre: "MARIA TERESA GOMEZ" },
            { id: "179048", nombre: "NOELIA GIMENEZ" },
            { id: "179049", nombre: "DAVID BLASCO" },
            { id: "179050", nombre: "RAUL ROYO" },
            { id: "179051", nombre: "MARIA TERESA BLASCO" },
            { id: "179052", nombre: "MARIA JOSE ROYO" },
            { id: "179053", nombre: "MARIA JOSE BLASCO" },
            { id: "179054", nombre: "ANA CRISTINA GIMENEZ" },
            { id: "179055", nombre: "JOSE ANTONIO GIMENEZ" },
            { id: "179056", nombre: "DAVID GIMENEZ" },
            { id: "179057", nombre: "JOSE MANUEL GIMENEZ" },
            { id: "179058", nombre: "ANA BELEN GIMENEZ" },
            { id: "179059", nombre: "ANA ISABEL BLASCO" },
            { id: "179060", nombre: "MARIA PILAR GOMEZ" },
            { id: "179061", nombre: "ANA CRISTINA BLASCO" },
            { id: "179062", nombre: "RAUL GIMENEZ" },
            { id: "179063", nombre: "MARIA ANGELES ROYO" },
            { id: "179064", nombre: "ANA BELEN ROYO" },
            { id: "179065", nombre: "JOSE ANTONIO BLASCO" },
            { id: "179066", nombre: "RAUL BLASCO" },
            { id: "179067", nombre: "MARIA ANGELES GIMENEZ" },
            { id: "179068", nombre: "DAVID ROYO" },
            { id: "179069", nombre: "JOSE MANUEL BLASCO" },
            { id: "179070", nombre: "NOELIA ROYO" }
        ],
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
