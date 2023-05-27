'use strict';
import { h, html, render, useEffect, useState } from './preact.min.js';


const Configuration = function (props) {

  const update = (name, val) =>
    fetch('/api/config/set', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        [name]: val
      })
    })
      .catch(err => {
        console.log(err);
        enable(false);
      });
};
// Gráfica Corriente
const CurrentChart = ({ data }) => {
    let chart = null;

    const updateChart = () => {
        fetch('/api/data/get')
            .then(r => r.json())
            .then(r => {
                // Extraer los datos necesarios del resultado
                const newData = r.map((item) => ({
                    x: `${item.Fecha} ${item.Hora}`,
                    y: item["Corriente RMS"]
                }));

                // Tomar solo los últimos 15 datos
                const latestData = newData.slice(Math.max(newData.length - 15, 0));

                // Extraer los datos actuales de la gráfica
                const currentLabels = chart.data.labels;
                const currentData = chart.data.datasets[0].data;

                // Asegurarse de que los datos sean diferentes de los datos actuales de la gráfica
                if (JSON.stringify(latestData.map(item => item.x)) !== JSON.stringify(currentLabels) ||
                    JSON.stringify(latestData.map(item => item.y)) !== JSON.stringify(currentData)) {
                    // Actualizar los datos
                    chart.data.labels = latestData.map((item) => item.x);
                    chart.data.datasets[0].data = latestData.map((item) => item.y);
                    chart.update();
                }
            });
    };

    useEffect(() => {
        if (data.length > 0) {
            const ctx = document.getElementById("currentChart").getContext("2d");
            chart = new Chart(ctx, {
                type: "line",
                data: {
                    labels: data.map((item) => item.x),
                    datasets: [
                        {
                            label: "Corriente",
                            data: data.map((item) => item.y),
                            borderColor: "rgba(75, 192, 192, 1)",
                            fill: false,
                        },
                    ],
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                        },
                    },
                },
            });

            // Llamar a updateChart cada 500 ms
            const intervalId = setInterval(updateChart, 500);

            // Limpiar el intervalo cuando el componente se desmonte
            return () => clearInterval(intervalId);
        }
    }, [data]);

    return (
        data.length > 0
    );
};
// Fin gráfica Corriente

//Gráfica voltaje
const VoltageChart = ({ data }) => {
    let chart = null;

    const updateChart = () => {
        fetch('/api/data/get')
            .then(r => r.json())
            .then(r => {
                // Extraer los datos necesarios del resultado
                const newData = r.map((item) => ({
                    x: `${item.Fecha} ${item.Hora}`,
                    y: item["Voltaje RMS"]
                }));

                // Tomar solo los últimos 15 datos
                const latestData = newData.slice(Math.max(newData.length - 15, 0));

                // Extraer los datos actuales de la gráfica
                const currentLabels = chart.data.labels;
                const currentData = chart.data.datasets[0].data;

                // Asegurarse de que los datos sean diferentes de los datos actuales de la gráfica
                if (JSON.stringify(latestData.map(item => item.x)) !== JSON.stringify(currentLabels) ||
                    JSON.stringify(latestData.map(item => item.y)) !== JSON.stringify(currentData)) {
                    // Actualizar los datos
                    chart.data.labels = latestData.map((item) => item.x);
                    chart.data.datasets[0].data = latestData.map((item) => item.y);
                    chart.update();
                }
            });
    };

    useEffect(() => {
        if (data.length > 0) {
            const ctx = document.getElementById("voltageChart").getContext("2d");
            chart = new Chart(ctx, {
                type: "bar",
                data: {
                    labels: data.map((item) => item.x),
                    datasets: [
                        {
                            label: "Voltaje",
                            data: data.map((item) => item.y),
                            backgroundColor: "rgba(75, 192, 192, 0.2)",
                            borderColor: "rgba(75, 192, 192, 1)",
                            borderWidth: 1,
                        },
                    ],
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                        },
                    },
                },
            });

            // Llamar a updateChart cada 500 ms
            const intervalId = setInterval(updateChart, 500);

            // Limpiar el intervalo cuando el componente se desmonte
            return () => clearInterval(intervalId);
        }
    }, [data]);

    return (
        data.length > 0
    );
};
//Fin Gráfica Voltaje
const GraficaCorrienteFactorPotencia = ({ data }) => {
    useEffect(() => {
        if (data.length > 0) {
            const ctx = document.getElementById("graficaCorrienteFactorPotencia").getContext("2d");
            new Chart(ctx, {
                type: "line",
                data: {
                    labels: data.map((item) => `${item.Fecha} ${item.Hora}`), // Se concatena Fecha y Hora
                    datasets: [
                        {
                            label: "Corriente RMS",
                            data: data.map((item) => item["Corriente RMS"]),
                            borderColor: "rgba(75, 192, 192, 1)",
                            fill: false,
                        },
                        {
                            label: "Factor de Potencia",
                            data: data.map((item) => item["Factor de Potencia"]),
                            borderColor: "rgba(192, 75, 75, 1)",
                            fill: false,
                        },
                    ],
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                        },
                    },
                },
            });
        }
    }, [data]);

    return (
        data.length > 0
    );
};

const GraficaPotenciaActivaAparente = ({ data }) => {
    useEffect(() => {
        if (data.length > 0) {
            const ctx = document.getElementById("graficaPotenciaActivaAparente").getContext("2d");
            new Chart(ctx, {
                type: "line",
                data: {
                    labels: data.map((item) => `${item.Fecha} ${item.Hora}`), // Se concatena Fecha y Hora
                    datasets: [
                        {
                            label: "Potencia Activa",
                            data: data.map((item) => item["Potencia Activa"]),
                            borderColor: "rgba(75, 192, 75, 1)",
                            fill: false,
                        },
                        {
                            label: "Potencia Aparente",
                            data: data.map((item) => item["Potencia Aparente"]),
                            borderColor: "rgba(75, 75, 192, 1)",
                            fill: false,
                        },
                    ],
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                        },
                    },
                },
            });
        }
    }, [data]);

    return (
        data.length > 0
    );
};

//
const DataList = ({ data }) => (
    data.length > 0 && html`
    <h3>Datos de la base de datos</h3>
    <ul>
        ${data.map((item) => html`
        <li>
            ID: ${item["ID"]},
            Fecha: ${item["Fecha"]},
            Hora: ${item["Hora"]},
            Voltaje RMS: ${item["Voltaje RMS"]},
            Línea de Frecuencia: ${item["Línea de Frecuencia"]},
            Factor de Potencia: ${item["Factor de Potencia"]},
            Corriente RMS: ${item["Corriente RMS"]},
            Potencia Activa: ${item["Potencia Activa"]},
            Potencia Reactiva: ${item["Potencia Reactiva"]},
            Potencia Aparente: ${item["Potencia Aparente"]}
        </li>`)}
    </ul>
  `
);


const App = function (props) {
    const [config, setConfig] = useState({});
    const [data, setData] = useState([]);
    //const [showGraph, setShowGraph] = useState(false); // Nuevo estado para controlar la visualización de la gráfica

    const getconfig = () =>
        fetch('/api/config/get')
            .then(r => r.json())
            .then(r => setConfig(r))
            .catch(err => console.log(err));

    //control cantidad de datos
    const getData = () =>
        fetch('/api/data/get')
            .then(r => r.json())
            .then(r => {
                console.log("Datos recibidos:", r);
                setData(r.slice(-15) // Modificar esta línea para mostrar sólo los primeros 10 registros
                );
            });

    useEffect(() => {
        getconfig();
        getData(); // Obtener los datos inmediatamente después de que el componente se monte
    }, []);

    return html`
        ${h(GraficaCorrienteFactorPotencia, { data })}
        ${h(GraficaPotenciaActivaAparente, { data })}
        ${h(CurrentChart, { data })}
        ${h(VoltageChart, { data })}
        `; // Añade esta línea para mostrar u ocultar la gráfica según el estado showGraph
    /*
    ${h(Configuration, { config })}
       ${h(DataList, { data })}
        */
};

window.onload = () => {
    render(h(App), document.body);
    (function ($) {
        "use strict";

        // Navbar on scrolling
        $(window).scroll(function () {
            if ($(this).scrollTop() > 200) {
                $('.navbar').fadeIn('slow').css('display', 'flex');
            } else {
                $('.navbar').fadeOut('slow').css('display', 'none');
            }
        });


        // Smooth scrolling on the navbar links
        $(".navbar-nav a, .btn-scroll").on('click', function (event) {
            if (this.hash !== "") {
                event.preventDefault();

                $('html, body').animate({
                    scrollTop: $(this.hash).offset().top - 45
                }, 1500, 'easeInOutExpo');

                if ($(this).parents('.navbar-nav').length) {
                    $('.navbar-nav .active').removeClass('active');
                    $(this).closest('a').addClass('active');
                }
            }
        });


        // Scroll to Bottom
        $(window).scroll(function () {
            if ($(this).scrollTop() > 100) {
                $('.scroll-to-bottom').fadeOut('slow');
            } else {
                $('.scroll-to-bottom').fadeIn('slow');
            }
        });


        // Portfolio isotope and filter
        var portfolioIsotope = $('.portfolio-container').isotope({
            itemSelector: '.portfolio-item',
            layoutMode: 'fitRows'
        });
        $('#portfolio-flters li').on('click', function () {
            $("#portfolio-flters li").removeClass('active');
            $(this).addClass('active');

            portfolioIsotope.isotope({filter: $(this).data('filter')});
        });


        // Back to top button
        $(window).scroll(function () {
            if ($(this).scrollTop() > 200) {
                $('.back-to-top').fadeIn('slow');
            } else {
                $('.back-to-top').fadeOut('slow');
            }
        });
        $('.back-to-top').click(function () {
            $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
            return false;
        });

    })(jQuery);
};
