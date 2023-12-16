#!/bin/bash


if [ -z "$1" ]
then
    echo "No se recibió un parametro."
fi

if ! [[ "$1" =~ ^[0-9]+$ ]]; then
    echo "El parámetro debe ser un número entero."
    exit 1
fi

contador() {
    local limite=$1 
    for ((i=1; i<=$limite; i++)); do
        sleep 2
        echo -n $i
    done
}

while true; do
  contador "$1" 
done

