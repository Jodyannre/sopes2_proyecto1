package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	operation "sopes2_p1/functions"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hola %s, Este se un mensaje enviado desde el back y si sale!", name)
}

func (a *App) Sumar(num int) int {
	return num + 12
}

//Obtener utilización del cpu

func (a *App) GetCPU() string {
	result := operation.GetCPU()
	jsonData, err := json.Marshal(result)
	if err != nil {
		log.Fatal(err)
	}
	return string(jsonData)
}

//Obtener utilización de la RAM

func (a *App) GetRam() string {
	result := operation.GetRam()
	jsonData, err := json.Marshal(result)
	if err != nil {
		log.Fatal(err)
	}
	return string(jsonData)
}

//Obtener utilización del disco

func (a *App) GetDisk() string {
	result := operation.GetDisk()
	jsonData, err := json.Marshal(result)
	if err != nil {
		log.Fatal(err)
	}
	return string(jsonData)
}

//Obtener lista de puertos usb con sus estados

func (a *App) GetEstadoPuertos() string {
	lista := operation.GetListaPuertos()
	estados := operation.GetEstadoPuertos(lista)
	return string(estados)
}

func (a *App) ActivarPuerto(id string) string {
	comando := "echo 'x' |sudo tee /sys/bus/usb/drivers/usb/bind"
	resultado := operation.ManejoPuertos(id, comando)
	return resultado
}

func (a *App) ActivarPuertos() string {
	resultado := operation.ManejarPuertos("0777")
	return resultado
}

func (a *App) DesactivarPuertos() string {
	resultado := operation.ManejarPuertos("0000")
	return resultado
}

func (a *App) DesactivarPuerto(id string) string {
	comando := "echo 'x' |sudo tee /sys/bus/usb/drivers/usb/unbind"
	resultado := operation.ManejoPuertos(id, comando)
	return resultado
}

func (a *App) InitBitacora() string {
	operation.EscribirLogInicial()
	return "Hecho"
}

func (a *App) EscribirLog() string {
	operation.EscribirLogs()
	return "Hecho"
}

func (a *App) EscribirLogPc() string {
	operation.FormatearArchivosCopiadosPc()
	return "Hecho"
}
