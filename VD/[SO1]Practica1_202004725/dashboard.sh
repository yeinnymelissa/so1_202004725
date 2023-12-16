#!/bin/bash

color_morado="\e[1;35m"
color_cyan="\e[1;36m"
color_amari="\e[1;33m"
color_reset="\e[0m"

while true; do
    clear 
    echo -e "${color_amari}********************** DASHBOARD **********************${color_reset}"
    echo -e "${color_cyan}************************* CPU *************************${color_reset}"
    echo -n "Porcentaje de uso: "
    grep 'cpu ' /proc/stat | awk '{usage=($2+$4)*100/($2+$4+$5)} END {print usage "%"}'

    echo -e "\n${color_cyan}************************* RAM *************************${color_reset}"
    ram_usage=$(free | grep Mem | awk '{print $3/$2 * 100.0}')
    echo "Porcentaje de uso: $ram_usage%"

    echo -e "\n${color_cyan}************************* HD **************************${color_reset}"
    df -h 

    echo -e "\n${color_morado}********************** PROCESOS ***********************${color_reset}"
    ps --sort=-%mem -eo pid,ppid,%cpu,%mem,cmd --width 100 | head -n 51  

    sleep 5 
done