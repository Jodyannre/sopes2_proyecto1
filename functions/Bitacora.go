package functions

import (
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"time"
)

func GetPaths() []string {
	var lista []string
	username := GetUserName()
	devices, err := ioutil.ReadDir("/media/" + username)
	if err != nil {
		log.Fatal(err)
	}
	for _, device := range devices {
		if device.IsDir() {
			//fmt.Println(device.Name())
			if device.Name() != "writable" {
				lista = append(lista, device.Name())
			}
		}
	}
	return lista
}

func GetFiles(path string) string {
	usuario := GetUserName()
	var salida string
	var builder strings.Builder
	usbDir := "/media/" + usuario + "/" + path
	err := filepath.Walk(usbDir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if !info.IsDir() {
			if !strings.Contains(path, ".Trash") {
				//fmt.Println(strings.ReplaceAll(path, usbDir, ""))
				builder.WriteString(strings.ReplaceAll(path, usbDir, "") + "\n")
			}

		}
		return nil
	})
	if err != nil {
		log.Fatal(err)
	}
	salida = builder.String()
	/*Eliminar la linea en blanco*/
	last := strings.LastIndex(salida, "\n")
	if last != -1 {
		salida = salida[:last] + "\n"
	}
	return salida
}

func CrearLog(texto, nombre string) {
	file, err := os.OpenFile(nombre, os.O_WRONLY|os.O_CREATE|os.O_APPEND, 0777)
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()
	_, err = file.WriteString(texto)
	if err != nil {
		log.Fatal(err)
	}
	err = file.Close()
	if err != nil {
		log.Fatal(err)
	}
}

func EscribirEstado(path, inicio string) bool {
	fin := GetFiles(path)
	nuevos := GetArchivosNuevos(inicio, fin)
	fmt.Println(inicio)
	fmt.Println(fin)
	eliminados := GetArchivosEliminados(inicio, fin)
	fmt.Println("------")
	fmt.Println(eliminados)
	if len(nuevos) <= 0 && len(eliminados) <= 0 {
		return false
	}
	CrearLog("//////////////////////////////////////////////////////////////////////\n", "usb-log.log")
	CrearLog("Dispositivo montado: "+path+"\n", "usb-log.log")
	CrearLog("----------------------------------------------------------------------\n", "usb-log.log")
	CrearLog(GetHora()+"\n", "usb-log.log")
	CrearLog("----------------------------------------------------------------------\n", "usb-log.log")
	CrearLog("***********Creados/Copiados*******************************************\n", "usb-log.log")
	CrearLog(nuevos+"\n", "usb-log.log")
	CrearLog("***********Eliminados*************************************************\n", "usb-log.log")
	CrearLog(eliminados+"\n", "usb-log.log")
	return true
}

func EscribirLogPc(texto string) {
	CrearLog("//////////////////////////////////////////////////////////////////////\n", "copy-log.log")
	CrearLog(GetHora()+"\n", "copy-log.log")
	CrearLog("----------------------------------------------------------------------\n", "copy-log.log")
	CrearLog(texto, "copy-log.log")
	CrearLog("----------------------------------------------------------------------\n", "copy-log.log")
}

func EscribirLogs() {
	paths := GetPaths()
	for _, path := range paths {
		inicial := LeerArchivo(path)
		if inicial == "error" {
			continue
		}
		EscribirEstado(path, inicial)
		EliminarInit(path)
	}
	EscribirLogInicial()
}

func EscribirLogInicial() {
	paths := GetPaths()
	for _, path := range paths {

		if LogInicialCargado(path) {
			continue
		}

		inicial := GetFiles(path)
		CrearLog(inicial, path+".logInit")
	}
}

func LeerArchivo(path string) string {
	contenido, err := ioutil.ReadFile(path + ".logInit")
	if err != nil {
		fmt.Println(err)
		return "error"
	}
	return string(contenido)
}

func LogInicialCargado(path string) bool {
	if _, err := os.Stat(path + ".logInit"); os.IsNotExist(err) {
		return false
	} else {
		return true
	}
}

func EliminarInit(path string) {
	err := os.Remove(path + ".logInit")
	if err != nil {
		log.Fatal(err)
	}
}

func GetArchivosNuevos(inicio, fin string) string {
	var builder strings.Builder
	listaInicial := strings.Split(fin, "\n")
	for _, file := range listaInicial {
		if LoContiene(file, inicio) == 0 {
			builder.WriteString(file + "\n")
		}
	}
	return builder.String()
}

func GetHora() string {
	ahora := time.Now()
	fecha := ahora.Format("2006-01-02 15:04:05")
	fmt.Print(fecha)
	return fecha
}

func GetArchivosEliminados(inicio, fin string) string {
	var builder strings.Builder
	listaInicial := strings.Split(inicio, "\n")
	for _, file := range listaInicial {
		if len(file) <= 0 {
			continue
		}
		if LoContiene(file, fin) == 0 {
			builder.WriteString(file + "\n")
		}
	}
	return builder.String()
}

func LoContiene(file, cadena string) int {
	lista := strings.Split(cadena, "\n")
	for _, actual := range lista {
		if file == strings.TrimSpace(actual) {
			return 1
		}
	}
	return 0

}

func GetUserName() string {
	comando := "find /media -mindepth 1 -maxdepth 1 -type d "
	cmd := exec.Command("/bin/sh", "-c", comando)
	salidaBytes, err := cmd.Output()
	if err != nil {
		fmt.Println(err)
	}
	salidaString := string(salidaBytes)
	array := strings.Split(salidaString, "/")
	return strings.TrimSpace(array[2])
}

func GetArchivosCopiadosPc(path string) ([]string, error) {
	excluir := path + "/repos/*"
	cmd := exec.Command("find", path, "-not", "-path", excluir, "-type", "f", "-cmin", "-0.016", "-printf", "%Tc %p\n")
	output, err := cmd.Output()
	if err != nil {
		return nil, err
	}
	lines := strings.Split(strings.TrimSpace(string(output)), "\n")
	files := make([]string, len(lines))
	for i, line := range lines {
		parts := strings.SplitN(line, " ", 2)
		if len(parts) <= 1 {
			break
		}
		files[i] = parts[1]
	}
	return files, nil
}

func FormatearArchivosCopiadosPc() {
	usuario := GetUserName()
	var builder strings.Builder
	files, err := GetArchivosCopiadosPc("/home/" + usuario + "/Desktop")

	if err != nil {
		fmt.Println(err)
		return
	}
	if len(files) > 0 {
		for _, file := range files {
			separador := strings.Split(file, " /")
			cadena := separador[len(separador)-1]
			fmt.Println(cadena)
			if !strings.Contains(cadena, "copy-log") &&
				len(strings.TrimSpace(cadena)) > 0 {
				builder.WriteString("/" + separador[len(separador)-1] + "\n")
			}

		}
	}
	resultado := builder.String()
	if len(resultado) > 0 {
		EscribirLogPc(resultado)
	}

}
