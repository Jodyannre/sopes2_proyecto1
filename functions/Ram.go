package functions

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"strconv"
	"strings"
)

type Ram struct {
	Total     float64 `json:"Total"`
	Free      float64 `json:"Free"`
	Used      float64 `json:"Used"`
	Cached    float64 `json:"Cached"`
	Available float64 `json:"Available"`
}

func GetRam() Ram {
	file, err := os.Open("/proc/meminfo")
	if err != nil {
		fmt.Println("Error", err)
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	var total, used, free, cached, available, buffer uint64
	for scanner.Scan() {
		linea := scanner.Text()
		datos := strings.Fields(linea)
		if len(datos) < 3 {
			continue
		}
		switch datos[0] {
		case "MemTotal:":
			fmt.Sscanf(datos[1], "%d", &total)
		case "MemFree:":
			fmt.Sscanf(datos[1], "%d", &free)
		case "Buffers:":
			fmt.Sscanf(datos[1], "%d", &buffer)
		case "Cached:":
			fmt.Sscanf(datos[1], "%d", &cached)
		case "MemAvailable:":
			fmt.Sscanf(datos[1], "%d", &available)
		}
	}
	if err := scanner.Err(); err != nil {
		fmt.Println("Error al leer el archivo:", err)
	}
	bufferCache := used + cached
	used = total - free - bufferCache
	ram := Ram{}
	ram.Total = BytesToGb(total)
	ram.Free = BytesToGb(free)
	ram.Used = BytesToGb(used)
	ram.Cached = BytesToGb(bufferCache)
	ram.Available = BytesToGb(available)
	return ram
}

func BytesToGb(bytes uint64) float64 {
	gb := float64(bytes) / 1000000
	fmt.Println(gb)
	decimal, err := strconv.ParseFloat(fmt.Sprintf("%.2f", gb), 64)
	if err != nil {
		log.Fatal(err)
	}
	return decimal
}
