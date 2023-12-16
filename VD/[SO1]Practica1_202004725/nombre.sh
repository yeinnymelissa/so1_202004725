#!/bin/bash

nombre="Yeinny Melissa Catalán de León"

color_texto="\e[1;35m"
color_reset="\e[0m"

while true; do
  sleep 5
  echo -e -n "${color_texto}$nombre${color_reset}"
done