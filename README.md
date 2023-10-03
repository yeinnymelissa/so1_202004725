# Manual Técnico  
#### Sistema de Monitoreo 
#### Facultad de Ingeniería  
#### Sistemas Operativos 1

#### Nombre y carnet 
- Yeinny Melissa Catalán de León    - 202004725  

Guatemala, Octubre 2023.  
___  

## Introducción
Este manual técnico describe los pasos y consideraciones técnicas para implementar un sistema de monitoreo de recursos del sistema y gestión de procesos en Google Cloud Platform (GCP). El sistema consta de varios componentes, incluidos módulos de kernel, un agente de monitoreo en Go, una plataforma de monitoreo con Frontend y API Node.js, una base de datos MySQL y la configuración en GCP.

## Arquitectura General
La arquitectura del sistema se compone de los siguientes elementos clave:

1. **Módulos de Kernel (RAM y CPU):**
   - Dos módulos de kernel (`ram_202004725.c` y `cpu_202004725.c`) alojados en `/proc` para recopilar estadísticas de RAM y CPU en tiempo real.

2. **Agente de Monitoreo (Golang):**
   - Un programa en Go que recopila datos de RAM y CPU de los módulos de kernel.
   - Comunicación segura con la Plataforma de Monitoreo para enviar datos.
   - Un servicio para matar procesos por PID (Service Killer).

3. **Plataforma de Monitoreo (Frontend, API Node.js y MySQL):**
   - Frontend web con páginas de monitoreo en tiempo real y a lo largo del tiempo.
   - API Node.js para la comunicación entre el Frontend y la base de datos MySQL.
   - Base de datos MySQL para almacenar datos de procesos, RAM y CPU con persistencia.

4. **Google Cloud Platform (GCP):**
   - Máquina virtual en GCP (Compute Engine) para alojar la Plataforma de Monitoreo.
   - Docker Compose para desplegar contenedores en la VM de GCP.
   - Grupo de Instancias para VMs a monitorear con autoscaling basado en la utilización de recursos.

5. **DockerHub:**
   - Alojamiento de imágenes de contenedores en DockerHub.

6. **Pruebas y Monitorización:**
   - Pruebas exhaustivas para garantizar el funcionamiento y escalabilidad.
   - Monitorización y alertas para detectar problemas de rendimiento.

## Implementación Paso a Paso

### 1. Módulos de Kernel
   - Crea los módulos `ram_<carnet>.c` y `cpu_<carnet>.c` utilizando las librerías y estructuras de información del sistema operativo para obtener estadísticas de RAM y CPU en tiempo real.
   - Asegúrate de que los módulos estén alojados en el directorio `/proc`.

### 2. Agente de Monitoreo (Golang)
   - Desarrolla un programa en Go para recopilar datos de RAM y CPU de los módulos del kernel en cada VM.
   - Implementa la comunicación segura con la Plataforma de Monitoreo para enviar los datos recopilados.
   - Crea un servicio que permita matar procesos por PID mediante llamadas a señales "KILL (-9)".

### 3. Plataforma de Monitoreo
   - Desarrolla un Frontend web con páginas de monitoreo en tiempo real y a lo largo del tiempo.
   - Crea una API Node.js que facilite la comunicación entre el Frontend y la base de datos MySQL.
   - Implementa una base de datos MySQL utilizando Docker para almacenar datos de procesos, RAM y CPU con persistencia.
   - Configura Docker Compose para orquestar los contenedores de la Plataforma de Monitoreo (Frontend, API y MySQL).

### 4. Google Cloud Platform (GCP)
   - Crea una máquina virtual en GCP (Compute Engine) para alojar la Plataforma de Monitoreo.
   - Utiliza Docker Compose para desplegar los contenedores en la VM de GCP.
   - Configura un Grupo de Instancias para las VMs a monitorear con autoscaling basado en la utilización de recursos (60% mínimo, 4 instancias máximas).

### 5. DockerHub
   - Aloja las imágenes de tus contenedores en DockerHub para que sean accesibles desde cualquier lugar.

### 6. Pruebas y Monitorización
   - Realiza pruebas exhaustivas de tu sistema para garantizar que funcione correctamente y pueda escalar según sea necesario.
   - Implementa mecanismos de monitorización y alerta para detectar problemas de rendimiento o fallos en las VMs a monitorear.

## Conclusiones
Este manual técnico proporciona una guía paso a paso para la implementación de un sistema de monitoreo de recursos del sistema y gestión de procesos en GCP. Sigue estos pasos cuidadosamente para asegurarte de que cada componente funcione correctamente y se integre de manera eficiente en tu infraestructura.
