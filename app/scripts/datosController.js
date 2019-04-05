'use strict';

var angularObj = {
    app: null,
    initAngular: function initAngular(api, freshState) {
        angularObj.app = angular.module('myAplicacion', ['ngMaterial', 'ngMaterialDatePicker']);
        angularObj.app.controller('DatosController', ['$scope', '$http', '$timeout', function ($scope, $http, $timeout) {
            //antes "metrica" para prueba
            var baseDatos = "GR";
            //var device = "bA"
            $scope.lstDatosInicio = [];

            //datos pantalla inicio
            try {
                var conAjax = $http.post("https://api.metricamovil.com/MedicionCombustible/Data/PantallaGeneral", {
                    database: baseDatos
                }).then(function (result) {
                    console.log(result.data);
                    $scope.lstDatosInicio = result.data;


                })
            } catch (error) {
                console.log(error.message);
            }

            $scope.lstDeviceGeotab = [];
            $scope.lstDevice = [];
            $scope.Data = {
                start: new Date(),
                end: new Date()
            };
            $scope.dispositivoSeleccionado = [];
            $scope.lstDevice = [];

            // funcion que permite ingresar texto en el search 
            $scope.updateSearch = function updateSearch(e) {
                e.stopPropagation();
            };

            $scope.getDevice = function (device) {
                try {
                    $scope.dispositivoSeleccionado = device;
                    $scope.$apply();
                } catch (error) {
                    console.log(error.message);
                }
            };

            api.call("Get", {
                typeName: "Device"
            }, function (result) {
                $scope.lstDeviceGeotab = result;
                $scope.lstDeviceGeotab.forEach(function (device) {
                    $scope.lstDevice.id = device;
                    console.log(device.name);
                });
            }, function (error) {
                console.error(error);
            });

            //funcion pantalla cargas y descargas pasando vehiculos
            $scope.datosCargasDescargas = function (device) {
                try {
                    var conAjax = $http.post("https://api.metricamovil.com/MedicionCombustible/Data/EventosCargaDescarga", JSON.stringify({
                        database: baseDatos,
                        deviceId: device,
                        start: moment($scope.Data.start).add(6, 'hours').format('YYYY-MM-DD HH:mm:ss'),
                        end: moment($scope.Data.end).add(6, 'hours').format('YYYY-MM-DD HH:mm:ss')
                    })).then(function (result) {
                        console.log(result);
                        $scope.lstDatosCragasDescargas = result.data;
                        if ($scope.lstDatosCragasDescargas.length == 0) {
                            const Toast = Swal.mixin({
                                toast: true,
                                position: 'center-center',
                                showConfirmButton: false,
                                timer: 3000
                            });

                            Toast.fire({
                                type: 'error',
                                title: 'No existen registros en este periodo de consulta.'
                            })
                        }

                    });

                } catch (error) {
                    console.log(error.message);
                }
            }

            //funcion cargas y descargas obtener deviceId
            $scope.datosObtenercargasDescargas = function () {
                try {
                    $scope.dispositivoSeleccionadoAux = this.dispositivoSeleccionado;
                    if ($scope.dispositivoSeleccionadoAux.length === 0) {
                        const Toast = Swal.mixin({
                            toast: true,
                            position: 'center-center',
                            showConfirmButton: false,
                            timer: 3000
                        });

                        Toast.fire({
                            type: 'error',
                            title: 'Selecciona vehículo.'
                        })
                    }

                    if ($scope.dispositivoSeleccionadoAux.length > 0) {

                        $scope.dispositivoSeleccionadoAux.forEach(function (dispositivo) {
                            $scope.datosCargasDescargas(dispositivo.id);
                        });

                    }
                } catch (error) {
                    console.log(error.message);
                }

            }

            $scope.exportarInicio = function () {
                $("#myTableInicio").tableExport({
                    filename: "AuditoríadeRegistros_Fechas"
                });

            }
            $scope.myFunctionInicio = function () {
                var input, filter, table, tr, td, i, txtValue;
                input = document.getElementById("myInputInicio");
                filter = input.value.toUpperCase();
                table = document.getElementById("myTableInicio");
                tr = table.getElementsByTagName("tr");
                for (i = 0; i < tr.length; i++) {
                    td = tr[i].getElementsByTagName("td")[0];
                    if (td) {
                        txtValue = td.textContent || td.innerText;
                        if (txtValue.toUpperCase().indexOf(filter) > -1) {
                            tr[i].style.display = "";
                        } else {
                            tr[i].style.display = "none";
                        }
                    }
                }
            }
            $scope.myFunction = function () {
                var input, filter, table, tr, td, i, txtValue;
                input = document.getElementById("myInput");
                filter = input.value.toUpperCase();
                table = document.getElementById("myTable");
                tr = table.getElementsByTagName("tr");
                for (i = 0; i < tr.length; i++) {
                    td = tr[i].getElementsByTagName("td")[0];
                    if (td) {
                        txtValue = td.textContent || td.innerText;
                        if (txtValue.toUpperCase().indexOf(filter) > -1) {
                            tr[i].style.display = "";
                        } else {
                            tr[i].style.display = "none";
                        }
                    }
                }
            }

            function refresh() {
                location.reload(true);
            }
            $scope.xslInicio = function () {
                $("#myTableInicio").table2excel({
                    filename: "Dashboard"
                });
                refresh();
            }
            $scope.xlsCargas = function () {
                $("#myTable").table2excel({
                    filename: "Cargas_y_descargas"
                });
                refresh()
            }

        }]);
        angularObj.app.config(function ($mdDateLocaleProvider) {
            $mdDateLocaleProvider.formatDate = function (date) {
                return moment(date).format('yyyy-MM-DD HH:mm:ss');
            }
        });
    }
};
