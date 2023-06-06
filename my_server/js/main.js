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

                    // Actualizar el label con el último dato
                    const ultimoDato = latestData[latestData.length - 1];
                    chart.data.datasets[0].label = `Corriente: ${ultimoDato.y} A`;

                    chart.update();
                }
            });
    };

    useEffect(() => {
        if (data.length > 0) {
            const ctx = document.getElementById("currentChart").getContext("2d");
            const ultimoDato = data[data.length - 1];
            chart = new Chart(ctx, {
                type: "line",
                data: {
                    labels: data.map((item) => item.x),
                    datasets: [
                        {
                            label: `Corriente: ${ultimoDato.y}`,
                            data: data.map((item) => item.y),
                            borderColor: "rgba(75, 192, 192, 1)",
                            fill: true,
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

                    // Actualizar el label con el último dato
                    const ultimoDato = latestData[latestData.length - 1];
                    chart.data.datasets[0].label = `Voltaje: ${ultimoDato.y} V`;

                    chart.update();
                }
            });
    };

    useEffect(() => {
        if (data.length > 0) {
            const ctx = document.getElementById("voltageChart").getContext("2d");
            const ultimoDato = data[data.length - 1];
            chart = new Chart(ctx, {
                type: "bar",
                data: {
                    labels: data.map((item) => item.x),
                    datasets: [
                        {
                            label: `Voltaje: ${ultimoDato.y}`,
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
const GraficaLineaFrecuencia = ({ data }) => {
    let chart = null;

    const updateChart = () => {
        fetch('/api/data/get')
            .then(r => r.json())
            .then(r => {
                // Extraer los datos necesarios del resultado
                const newData = r.map((item) => ({
                    x: `${item.Fecha} ${item.Hora}`,
                    y: item["Línea de Frecuencia"]
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

                    // Actualizar el label con el último dato
                    const ultimoDato = latestData[latestData.length - 1];
                    chart.data.datasets[0].label = `Línea de Frecuencia: ${ultimoDato.y}`;

                    chart.update();
                }
            });
    };

    useEffect(() => {
        if (data.length > 0) {
            const ctx = document.getElementById("graficaLineaFrecuenia").getContext("2d");
            const ultimoDato = data[data.length - 1];
            chart = new Chart(ctx, {
                type: "line",
                data: {
                    labels: data.map((item) => item.x),
                    datasets: [
                        {
                            label: `Línea de Frecuencia: ${ultimoDato.y}`,
                            data: data.map((item) => item.y),
                            borderColor: "rgba(75, 192, 192, 1)",
                            fill: true,
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
const GraficaPotenciaActivaAparenteReactiva = ({ data }) => {
    let chart = null;

    const updateChart = () => {
        fetch('/api/data/get')
            .then(r => r.json())
            .then(r => {
                // Extraer los datos necesarios del resultado
                const newData = r.map((item) => ({
                    x: `${item.Fecha} ${item.Hora}`,
                    y1: item["Potencia Activa"],
                    y2: item["Potencia Aparente"],
                    y3: item["Potencia Reactiva"],
                }));

                // Tomar solo los últimos 15 datos
                const latestData = newData.slice(Math.max(newData.length - 15, 0));

                // Extraer los datos actuales de la gráfica
                const currentLabels = chart.data.labels;
                const currentDataActiva = chart.data.datasets[0].data;
                const currentDataAparente = chart.data.datasets[1].data;
                const currentDataReactiva = chart.data.datasets[2].data;

                // Asegurarse de que los datos sean diferentes de los datos actuales de la gráfica
                if (JSON.stringify(latestData.map(item => item.x)) !== JSON.stringify(currentLabels) ||
                    JSON.stringify(latestData.map(item => item.y1)) !== JSON.stringify(currentDataActiva) ||
                    JSON.stringify(latestData.map(item => item.y2)) !== JSON.stringify(currentDataAparente) ||
                    JSON.stringify(latestData.map(item => item.y3)) !== JSON.stringify(currentDataReactiva)) {
                    // Actualizar los datos
                    chart.data.labels = latestData.map((item) => item.x);
                    chart.data.datasets[0].data = latestData.map((item) => item.y1);
                    chart.data.datasets[1].data = latestData.map((item) => item.y2);
                    chart.data.datasets[2].data = latestData.map((item) => item.y3);

                    // Calculate the latest values
                    const ultimoPotenciaActiva = latestData[latestData.length - 1].y1;
                    const ultimoPotenciaAparente = latestData[latestData.length - 1].y2;
                    const ultimoPotenciaReactiva = latestData[latestData.length - 1].y3;

                    // Update the labels
                    chart.data.datasets[0].label = `Potencia Activa: ${ultimoPotenciaActiva}`;
                    chart.data.datasets[1].label = `Potencia Aparente: ${ultimoPotenciaAparente}`;
                    chart.data.datasets[2].label = `Potencia Reactiva: ${ultimoPotenciaReactiva}`;
                    chart.update();
                }
            });
    };

    useEffect(() => {
        if (data.length > 0) {
            const ultimoPotenciaActiva = data[data.length - 1].y1;
            const ultimoPotenciaAparente = data[data.length - 1].y2;
            const ultimoPotenciaReactiva = data[data.length - 1].y3;
            const ctx = document.getElementById("graficaPotenciaActivaAparenteReactiva").getContext("2d");
            chart = new Chart(ctx, {
                type: "line",
                data: {
                    labels: data.map((item) => item.x),
                    datasets: [
                        {
                            label: `Potencia Activa: ${ultimoPotenciaActiva}`,
                            data: data.map((item) => item.y1),
                            borderColor: "rgba(75, 192, 75, 1)",
                            fill: false,
                        },
                        {
                            label: `Potencia Aparente: ${ultimoPotenciaAparente}`,
                            data: data.map((item) => item.y2),
                            borderColor: "rgba(75, 75, 192, 1)",
                            fill: false,
                        },
                        {
                            label: `Potencia Reactiva: ${ultimoPotenciaReactiva}`,
                            data: data.map((item) => item.y3),
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
//Factor de potencia 8 datos
const GraficaFactorPotencia = ({ data }) => {
    let chart = null;

    const updateChart = () => {
        fetch('/api/data/get')
            .then(r => r.json())
            .then(r => {
                // Extraer los datos necesarios del resultado
                const newData = r.map((item) => ({
                    x: `${item.Fecha} ${item.Hora}`,
                    y: item["Factor de Potencia"]
                }));

                // Tomar solo los últimos 15 datos
                const latestData = newData.slice(Math.max(newData.length - 8, 0));

                // Extraer los datos actuales de la gráfica
                const currentLabels = chart.data.labels;
                const currentData = chart.data.datasets[0].data;

                // Asegurarse de que los datos sean diferentes de los datos actuales de la gráfica
                if (JSON.stringify(latestData.map(item => item.x)) !== JSON.stringify(currentLabels) ||
                    JSON.stringify(latestData.map(item => item.y)) !== JSON.stringify(currentData)) {
                    // Actualizar los datos
                    chart.data.labels = latestData.map((item) => item.x);
                    chart.data.datasets[0].data = latestData.map((item) => item.y);

                    // Actualizar el label con el último dato
                    const ultimoDato = latestData[latestData.length - 1];
                    chart.data.datasets[0].label = `Factor de Potencia: ${ultimoDato.y}`;

                    chart.update();
                }
            });
    };

    useEffect(() => {
        if (data.length > 0) {
            const ctx = document.getElementById("graficaFactorPotencia").getContext("2d");
            const ultimoDato = data[data.length - 1];
            chart = new Chart(ctx, {
                type: "line",
                data: {
                    labels: data.map((item) => item.x),
                    datasets: [
                        {
                            label: `Factor de Potencia: ${ultimoDato.y}`,
                            data: data.map((item) => item.y),
                            borderColor: "rgba(75, 192, 192, 1)",
                            fill: true,
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
//fin FP8D

//Factor de potencia último
const GraficaFactorPotenciaUltimo = ({ data }) => {
    let chart = null;

    const updateChart = () => {
        fetch('/api/data/get')
            .then(r => r.json())
            .then(r => {
                // Tomar el último dato
                const ultimoDato = r[r.length - 1];
                const ultimoFactorPotencia = ultimoDato["Factor de Potencia"];
                const restante = 1 - ultimoFactorPotencia;

                // Actualizar los datos y las etiquetas
                chart.data.labels = [`Factor de Potencia: ${(ultimoFactorPotencia*100).toFixed(2)} %`, `Restante: ${(restante*100).toFixed(2)} %`];
                chart.data.datasets[0].data = [ultimoFactorPotencia, restante];

                // Actualizar el título
                //chart.options.title.text = `Fecha: ${ultimoDato.Fecha}, Hora: ${ultimoDato.Hora}`;
                chart.options.plugins.title.text = `Fecha: ${ultimoDato.Fecha}, Hora: ${ultimoDato.Hora}`;


                // Actualizar la gráfica
                chart.update();
            });
    };

    useEffect(() => {
        if (data.length > 0) {
            const ultimoFactorPotencia = data[data.length - 1]["Factor de Potencia"];
            const restante = 1 - ultimoFactorPotencia;

            const ctx = document.getElementById("graficaFactorPotenciaUltimo").getContext("2d");
            chart = new Chart(ctx, {
                type: "doughnut",
                data: {
                    labels: [`Factor de Potencia: ${(ultimoFactorPotencia*100).toFixed(2)} %`, `Restante: ${(restante*100).toFixed(2)} %`],
                    datasets: [
                        {
                            data: [ultimoFactorPotencia, restante],
                            backgroundColor: ["rgba(192, 75, 75, 0.5)", "rgba(75, 192, 192, 0.5)"],
                            hoverBackgroundColor: ["rgba(192, 75, 75, 0.7)", "rgba(75, 192, 192, 0.7)"],
                            borderColor: ["rgba(192, 75, 75, 1)", "rgba(75, 192, 192, 1)"],
                        },
                    ],
                },
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: `Fecha: ${data[data.length - 1].Fecha}, Hora: ${data[data.length - 1].Hora}`
                        }
                    }
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
//

//
// Realizar una solicitud a la API
fetch("/api/data/get")
    .then(response => response.json()) // Convertir la respuesta a formato JSON
    .then(data => { // Trabajar con los datos obtenidos
        let table = document.querySelector("table"); // Seleccionar la tabla
        let tbody = document.createElement("tbody"); // Crear el cuerpo de la tabla

        // Iterar sobre los datos
        for (let item of data) {
            // Crear una nueva fila
            let row = document.createElement("tr");

            // Agregar las columnas a la fila
            row.innerHTML = `
        <td>${item["ID"]}</td>
        <td>${item["Fecha"]}</td>
        <td>${item["Hora"]}</td>
        <td>${item["Voltaje RMS"]}</td>
        <td>${item["Línea de Frecuencia"]}</td>
        <td>${item["Factor de Potencia"]}</td>
        <td>${item["Corriente RMS"]}</td>
        <td>${item["Potencia Activa"]}</td>
        <td>${item["Potencia Reactiva"]}</td>
        <td>${item["Potencia Aparente"]}</td>
      `;

            // Agregar la fila al cuerpo de la tabla
            tbody.appendChild(row);
        }

        // Agregar el cuerpo de la tabla a la tabla
        table.appendChild(tbody);
    })
    .catch(error => console.error('Error:', error));

//
function searchDate() {
    var input_startDate, input_stopDate, table, tr, i;

    // get the values and convert to date
    input_startDate = new Date(document.getElementById("date-start").value);
    input_stopDate = new Date(document.getElementById("date-stop").value);

    table = document.getElementById("myTable");
    tr = table.getElementsByTagName("tr");

    for (i = 0; i < tr.length; i++) {
        // you need to get the text and convert to date
        let td_date = new Date(tr[i].getElementsByTagName("td")[0].textContent);

        // now you can compare dates correctly
        if (td_date) {
            if (td_date >= input_startDate && td_date <= input_stopDate) {
                // show the row by setting the display property
                tr[i].style.display = 'table-row;';
            } else {
                // hide the row by setting the display property
                tr[i].style.display = 'none';
            }
        }

    }
}

function searchDateAlternative() {
    // get the values and convert to date
    const input_startDate = new Date(document.getElementById("date-start").value);
    const input_stopDate = new Date(document.getElementById("date-stop").value);

    // only process table body rows, ignoring footer/headers
    const tr = document.querySelectorAll("table tbody tr")

    for (let i = 0; i < tr.length; i++) {
        // ensure we have a relevant td
        let td = tr[i].getElementsByTagName("td");
        if (!td || !td[0]) continue;

        // you need to get the text and convert to date
        let td_date = new Date(td[0].textContent);

        // now you can compare dates correctly
        if (td_date) {
            if (td_date >= input_startDate && td_date <= input_stopDate) {
                // show the row by setting the display property
                tr[i].style.display = 'table-row;';
            } else {
                // hide the row by setting the display property
                tr[i].style.display = 'none';
            }
        }

    }
}

// Obtén los elementos de la página
let startDateInput = document.getElementById("start-date");
let endDateInput = document.getElementById("end-date");
let filterButton = document.getElementById("filter-button");
let table = document.querySelector("table");

// Define una función que se encargará de realizar la solicitud


//

const App = function (props) {
    const [config, setConfig] = useState({});
    const [data, setData] = useState([]);
    /*const filterData = () => {
        alert('Button was clicked');
        // Obtén las fechas seleccionadas por el usuario
        let startDate = startDateInput.value;
        let endDate = endDateInput.value;

        // Limpia la tabla antes de agregar las nuevas filas
        table.innerHTML = `
    <thead>
    <tr>
      <th>ID</th>
      <th>Fecha</th>
      <th>Hora</th>
      <th>Voltaje RMS</th>
      <th>Línea de Frecuencia</th>
      <th>Factor de Potencia</th>
      <th>Corriente RMS</th>
      <th>Potencia Activa</th>
      <th>Potencia Reactiva</th>
      <th>Potencia Aparente</th>
    </tr>
    </thead>
  `;

        // Realiza la solicitud a la API
        fetch(`/api/data/get?start_date=${startDate}&end_date=${endDate}`)
            .then(response => response.json())
            .then(data => {
                // Crea y agrega las filas a la tabla
                let tbody = document.createElement("tbody");
                for (let item of data) {
                    let row = document.createElement("tr");
                    row.innerHTML = `
          <td>${item["ID"]}</td>
          <td>${item["Fecha"]}</td>
          <td>${item["Hora"]}</td>
          <td>${item["Voltaje RMS"]}</td>
          <td>${item["Línea de Frecuencia"]}</td>
          <td>${item["Factor de Potencia"]}</td>
          <td>${item["Corriente RMS"]}</td>
          <td>${item["Potencia Activa"]}</td>
          <td>${item["Potencia Reactiva"]}</td>
          <td>${item["Potencia Aparente"]}</td>
        `;
                    tbody.appendChild(row);
                }
                table.appendChild(tbody);
            })
            .catch(error => console.error('Error:', error));
    }*/

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
        ${h(GraficaLineaFrecuencia, { data })}
        ${h(GraficaPotenciaActivaAparenteReactiva, { data })}
        ${h(GraficaFactorPotencia, { data })}
        ${h(GraficaFactorPotenciaUltimo, { data })}
        ${h(CurrentChart, { data })}
        ${h(VoltageChart, { data })}
        `;
};
render(h(App), document.body);

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
