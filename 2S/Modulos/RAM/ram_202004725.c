// Info de los modulos
#include <linux/module.h>
// Info del kernel en tiempo real
#include <linux/kernel.h>
#include <linux/sched.h>

// Headers para modulos
#include <linux/init.h>
// Header necesario para proc_fs
#include <linux/proc_fs.h>
// Para dar acceso al usuario
#include <asm/uaccess.h>
// Para manejar el directorio /proc
#include <linux/seq_file.h>
// Para get_mm_rss
#include <linux/mm.h>

const long minute = 60;

const long hours = minute * 60;

const long day = hours * 24;

const long megabyte = 1024 * 1024;

struct sysinfo si;

static void init_meminfo(void){
    si_meminfo(&si);
}

MODULE_LICENSE("GPL");
MODULE_DESCRIPTION("Modulo de RAM para el Lab de Sopes 1");
MODULE_AUTHOR("Yei");

static int escribir_archivo(struct seq_file *archivo, void *v) {

    int32_t total, libre;
    init_meminfo();
    total = ((uint64_t)si.totalram * si.mem_unit)/1024;
    libre = ((uint64_t)si.freeram * si.mem_unit)/1024;
    seq_printf(archivo, "TotRam:");
    seq_printf(archivo, "%u", total);
    seq_printf(archivo, ",");
    seq_printf(archivo, "UseRam:");
    seq_printf(archivo, "%u", (total - libre));
    seq_printf(archivo, ",");
    seq_printf(archivo, "FreRam:");
    seq_printf(archivo, "%u", libre);
    seq_printf(archivo, ",");
    seq_printf(archivo, "PorRam:");
    seq_printf(archivo, "%lu", (((total - libre)*100)/total));
    return 0;
}

//Funcion que se ejecutara cada vez que se lea el archivo con el comando CAT
static int al_abrir(struct inode *inode, struct file *file)
{
    return single_open(file, escribir_archivo, NULL);
}

//Si el kernel es 5.6 o mayor se usa la estructura proc_ops
static struct proc_ops operaciones =
{
    .proc_open = al_abrir,
    .proc_read = seq_read
};

//Funcion a ejecuta al insertar el modulo en el kernel con insmod
static int _insert(void)
{
    proc_create("ram_202004725", 0, NULL, &operaciones);
    printk(KERN_INFO "Yeinny Melissa Catalan de Leon\n");
    return 0;
}

//Funcion a ejecuta al remover el modulo del kernel con rmmod
static void _remove(void)
{
    remove_proc_entry("ram_202004725", NULL);
    printk(KERN_INFO "Segundo Semestre 2023\n");
}

module_init(_insert);
module_exit(_remove);