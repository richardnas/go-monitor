package main

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/shirou/gopsutil/cpu"
	"github.com/shirou/gopsutil/mem"
	"golang.org/x/net/websocket"
)

type stats struct {
	Memory float64   `json:"memory"`
	CPU    []float64 `json:"cpu"`
}

func (s *stats) getCPU() {
	s.CPU, _ = cpu.Percent(time.Second, true)
}

func (s *stats) getMemory() {
	v, _ := mem.VirtualMemory()
	s.Memory = v.UsedPercent
}

func (s stats) toJSON() []byte {
	jsonStr, _ := json.Marshal(s)
	return jsonStr
}

func statsHandler(ws *websocket.Conn) {
	for {
		s := new(stats)
		s.getCPU()
		s.getMemory()
		_, _ = ws.Write(s.toJSON())
	}

}

func main() {
	http.Handle("/stats", websocket.Handler(statsHandler))
	http.Handle("/", http.FileServer(http.Dir("./static")))
	http.ListenAndServe(":8080", nil)
}
