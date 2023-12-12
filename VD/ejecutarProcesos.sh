#!/bin/bash

# Conteo
./conteo.sh 5 &

# Muestra de datos
./nombre.sh &

# Impresión de carácter
./caracter.sh &

wait

# ./conteo.sh 5 & pid_conteo=$! ; ./nombre.sh & pid_nombre=$! ; ./caracter.sh & pid_caracter=$! ; wait
