package functions

import (
	"encoding/json"
	"fmt"
	"log"
	"os/exec"
	"reflect"
	"strings"
)

//var comandos map[string]string

func GetListaPuertos() []string {
	var listaPuertos []string
	commando := exec.Command("lsusb")
	salidaBytes, err := commando.Output()
	if err != nil {
		fmt.Println(err)
	}
	salidaString := string(salidaBytes)

	listaTotal := strings.Split(salidaString, "\n")
	for _, puerto := range listaTotal {
		if !esCritico(puerto) && len(puerto) > 1 {
			listaPuertos = append(listaPuertos, puerto)
		}
	}
	listaIds := getListIds(listaPuertos)
	return listaIds
}

func esCritico(puerto string) bool {
	puertosCriticos := [3]string{"Linux", "Foxconn", "Intel"}
	for _, palabra := range puertosCriticos {
		if strings.Contains(puerto, palabra) {
			return true
		}
	}
	return false
}

func printLista(list interface{}) {
	lista := reflect.ValueOf(list)
	for i := 0; i < lista.Len(); i++ {
		fmt.Println(lista.Index(i).Interface())
	}
}

func getId(puerto string) string {
	dispositivo := strings.Split(puerto, ":")
	ids := strings.Split(dispositivo[0], " ")
	bus := ids[1]
	device := ids[3]
	return bus + "/" + device
}

func getListIds(puertos []string) []string {
	var lista []string
	for _, puerto := range puertos {
		lista = append(lista, getNumPuerto(getId(puerto)))

	}
	return lista
}

func getNumPuerto(puerto string) string {
	comando := "grep -l x /sys/bus/usb/devices/*/uevent"
	comando = strings.ReplaceAll(comando, "x", puerto)
	cmd := exec.Command("/bin/sh", "-c", comando)
	salidaBytes, err := cmd.Output()
	if err != nil {
		fmt.Println(err)
	}
	salidaString := string(salidaBytes)
	salidaLista := strings.Split(salidaString, "/")
	id := salidaLista[5]
	return id
}

func ManejoPuertos(id string, comando string) string {
	salidaString := EjecutarSh(id, comando)
	return salidaString
}

func AgregarComandos(comandos map[string]string) {
	comandos = make(map[string]string)
	comandos["enable"] = "echo 'x' |sudo tee /sys/bus/usb/drivers/usb/bind"
	comandos["disable"] = "echo 'x' |sudo tee /sys/bus/usb/drivers/usb/unbind"
	comandos["status"] = "udevadm info /sys/bus/usb/devices/x/ | grep \"DRIVER=usb\""
	comandos["disableAll"] = "sudo chmod 0000 /media"
	comandos["enableAll"] = "sudo chmod 0777 /media"
}

func EjecutarSh(id string, comando string) string {
	comando = strings.ReplaceAll(comando, "x", id)
	cmd := exec.Command("/bin/sh", "-c", comando)
	salidaBytes, err := cmd.Output()
	if err != nil {
		fmt.Println(err)
	}
	salidaString := string(salidaBytes)
	return salidaString
}

func ManejarPuertos(permiso string) string {
	cmd := exec.Command("sudo", "chmod", permiso, "/media")
	cmd.Run()
	return "hecho"
}

func GetEstadoPuertos(lista []string) []byte {
	//var estados []bool
	comando := "udevadm info /sys/bus/usb/devices/x/ | grep \"DRIVER=usb\""
	estados := make(map[string]bool)
	for _, puerto := range lista {
		resultado := ManejoPuertos(puerto, comando)
		//estados = append(estados, len(resultado) > 0)
		estados[puerto] = len(resultado) > 0
	}
	jsonData, err := json.Marshal(estados)
	if err != nil {
		log.Fatal(err)
	}
	return jsonData
}

func printMap(mapa map[string]bool) {
	for key, value := range mapa {
		fmt.Printf("El puerto %s esta %t. \n", key, value)
	}
}
