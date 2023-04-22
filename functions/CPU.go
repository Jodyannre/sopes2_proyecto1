package functions

import (
	"fmt"
	"os"
	"time"

	"github.com/mackerelio/go-osstat/cpu"
)

type CPU struct {
	User   float64 `json:"User"`
	System float64 `json:"System"`
	Idle   float64 `json:"Idle"`
}

func GetCPU() CPU {
	Cpu := CPU{}
	before, err := cpu.Get()
	if err != nil {
		fmt.Fprintf(os.Stderr, "%s\n", err)
		return Cpu
	}
	time.Sleep(time.Duration(1) * time.Second)
	after, err := cpu.Get()
	if err != nil {
		fmt.Fprintf(os.Stderr, "%s\n", err)
		return Cpu
	}
	total := float64(after.Total - before.Total)
	Cpu.User = float64(after.User-before.User) / total * 100
	Cpu.System = float64(after.System-before.System) / total * 100
	Cpu.Idle = float64(after.Idle-before.Idle) / total * 100
	return Cpu
}
