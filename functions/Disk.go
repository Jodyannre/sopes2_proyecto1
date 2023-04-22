package functions

import (
	"syscall"
)

type Disk struct {
	Total    uint64  `json:"Total"`
	Used     uint64  `json:"Used"`
	Free     uint64  `json:"Free"`
	Used_Per float64 `json:"Used_Per"`
	Free_Per float64 `json:"Free_Per"`
}

const (
	B  = 1
	KB = 1024 * B
	MB = 1024 * KB
	GB = 1024 * MB
)

func GetDisk() Disk {
	disk := Disk{}
	fs := syscall.Statfs_t{}
	err := syscall.Statfs("/", &fs)
	if err != nil {
		return Disk{}
	}
	/*Colocar valores*/
	disk.Total = fs.Blocks * uint64(fs.Bsize)
	disk.Free = fs.Bfree * uint64(fs.Bsize)
	disk.Used = disk.Total - disk.Free
	disk.Free_Per = float64(disk.Free) / float64(disk.Total) * 100
	disk.Used_Per = float64(disk.Used) / float64(disk.Total) * 100
	return disk
}
