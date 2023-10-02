package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"os/exec"
	"strconv"
	"strings"
	"syscall"
	"time"
)

type ramStruct struct {
	TotalRam      uint64
	RamEnUso      uint64
	RamLibre      uint64
	PorcentajeUso uint64
}

type responseKill struct {
	Pid int
}

func ramAdmin(w http.ResponseWriter, _ *http.Request) {
	cmd := exec.Command("sh", "-c", "cat /proc/ram_202004725")

	salida, err := cmd.CombinedOutput()

	if err != nil {
		log.Fatalln(err)
	}

	ramAtributos := strings.Split(string(salida), ",")
	ramStr := ramStruct{}
	for _, atributos := range ramAtributos {
		atri := strings.Split(string(atributos), ":")

		if atri[0] == "TotRam" {
			u64, err := strconv.ParseUint(atri[1], 10, 64)
			if err != nil {
				log.Fatalln(err)
			}
			ramStr.TotalRam = u64
		} else if atri[0] == "UseRam" {
			u64, err := strconv.ParseUint(atri[1], 10, 64)
			if err != nil {
				log.Fatalln(err)
			}
			ramStr.RamEnUso = u64
		} else if atri[0] == "FreRam" {
			u64, err := strconv.ParseUint(atri[1], 10, 64)
			if err != nil {
				log.Fatalln(err)
			}
			ramStr.RamLibre = u64
		} else if atri[0] == "PorRam" {
			u64, err := strconv.ParseUint(atri[1], 10, 64)
			if err != nil {
				log.Fatalln(err)
			}
			ramStr.PorcentajeUso = u64
		}

	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	jsonResp, err := json.Marshal(ramStr)
	if err != nil {
		log.Fatalf("Error happened in JSON marshal. Err: %s", err)
	}
	w.Write(jsonResp)
	return
}

func cpuAdmin(w http.ResponseWriter, _ *http.Request) {
	cmd := exec.Command("sh", "-c", "cat /proc/cpu_202004725")

	salida, err := cmd.CombinedOutput()

	if err != nil {
		log.Fatalln(err)
	}

	var a []interface{}
	err = json.Unmarshal(salida, &a)

	if err != nil {
		log.Fatalln(err)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	jsonResp, err := json.Marshal(a)
	if err != nil {
		log.Fatalf("Error happened in JSON marshal. Err: %s", err)
	}
	w.Write(jsonResp)
	return
}

func cpuUso(w http.ResponseWriter, _ *http.Request) {
	var prevIdleTime, prevTotalTime uint64
	var cpuUsage float64
	for i := 0; i < 2; i++ {
		file, err := os.Open("/proc/stat")
		if err != nil {
			log.Fatal(err)
		}
		scanner := bufio.NewScanner(file)
		scanner.Scan()
		firstLine := scanner.Text()[5:] // get rid of cpu plus 2 spaces
		file.Close()
		if err := scanner.Err(); err != nil {
			log.Fatal(err)
		}
		split := strings.Fields(firstLine)
		idleTime, _ := strconv.ParseUint(split[3], 10, 64)
		totalTime := uint64(0)
		for _, s := range split {
			u, _ := strconv.ParseUint(s, 10, 64)
			totalTime += u
		}
		if i > 0 {
			deltaIdleTime := idleTime - prevIdleTime
			deltaTotalTime := totalTime - prevTotalTime
			cpuUsage = (1.0 - float64(deltaIdleTime)/float64(deltaTotalTime)) * 100.0
		}
		prevIdleTime = idleTime
		prevTotalTime = totalTime
		time.Sleep(time.Second)
	}

	data := make(map[string]any)
	data["cpu"] = cpuUsage
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	jsonResp, err := json.Marshal(data)
	if err != nil {
		log.Fatalf("Error happened in JSON marshal. Err: %s", err)
	}
	w.Write(jsonResp)
	return
}

func mandarIp() {
	response, err := http.Get("http://localhost:3000/")

	if err != nil {
		fmt.Print(err.Error())
	}

	responseData, err := ioutil.ReadAll(response.Body)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(string(responseData))
}

func kill(w http.ResponseWriter, r *http.Request) {

	b, err := io.ReadAll(r.Body)
	if err != nil {
		panic(err)
	}
	var data = []byte(b)
	var kil responseKill
	err = json.Unmarshal(data, &kil)

	pid := kil.Pid

	proceso, err := os.FindProcess(pid)
	if err != nil {
		fmt.Printf("Error al obtener el proceso: %v\n", err)
		return
	}

	if err := proceso.Signal(syscall.SIGKILL); err != nil {
		fmt.Printf("Error al enviar la señal SIGKILL: %v\n", err)
		return
	}

	fmt.Printf("Proceso con PID %d terminado correctamente.\n", pid)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	dat := make(map[string]any)
	dat["code"] = 200
	jsonResp, err := json.Marshal(dat)
	if err != nil {
		log.Fatalf("Error happened in JSON marshal. Err: %s", err)
	}
	w.Write(jsonResp)
	return
}

func main() {
	http.HandleFunc("/ram", ramAdmin)
	http.HandleFunc("/cpu", cpuAdmin)
	http.HandleFunc("/cpuUso", cpuUso)
	http.HandleFunc("/kill", kill)
	http.ListenAndServe(":8000", nil)
}
