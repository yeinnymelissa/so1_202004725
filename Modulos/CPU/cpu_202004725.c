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

struct task_struct *cpu; // Estructura que almacena info del cpu

// Almacena los procesos
struct list_head *lstProcess;
// Estructura que almacena info de los procesos hijos
struct task_struct *child;

struct mm_struct *mm;

unsigned long rss;

MODULE_LICENSE("GPL");
MODULE_DESCRIPTION("Modulo de CPU para el Lab de Sopes 1");
MODULE_AUTHOR("Yei");

static int escribir_archivo(struct seq_file *archivo, void *v)
{

    int cont1, cont2;
    cont1 = 0;
    seq_printf(archivo, "[\n");
    for_each_process(cpu)
    {
        mm = get_task_mm(cpu);

        if (cont1 != 0)
        {
            seq_printf(archivo, ",\n");
        }
        if (mm)
        {
            rss = get_mm_rss(mm) << PAGE_SHIFT;
            mmput(mm);
            seq_printf(archivo, "{\n");
            seq_printf(archivo, "\t \"pid\": %d,\n", cpu->pid);
            seq_printf(archivo, "\t \"nombre\": \"%s\",\n", cpu->comm);
            seq_printf(archivo, "\t \"user\": %hu,\n", cpu->cred->uid);
            seq_printf(archivo, "\t \"estado\": \"%c\",\n", task_state_to_char(cpu));
            seq_printf(archivo, "\t \"ram\": %ld,\n", rss);
            seq_printf(archivo, "\t \"hijos\": [\n");
        }
        else
        {
            seq_printf(archivo, "{\n");
            seq_printf(archivo, "\t \"pid\": %d,\n", cpu->pid);
            seq_printf(archivo, "\t \"nombre\": \"%s\",\n", cpu->comm);
            seq_printf(archivo, "\t \"user\": %hu,\n", cpu->cred->uid);
            seq_printf(archivo, "\t \"estado\": \"%c\",\n", task_state_to_char(cpu));
            seq_printf(archivo, "\t \"ram\": 0,\n");
            seq_printf(archivo, "\t \"hijos\": [\n");
        }
        cont2 = 0;

        list_for_each(lstProcess, &cpu->children)
        {
            if (cont2 != 0)
            {
                seq_printf(archivo, ",\n");
            }
            child = list_entry(lstProcess, struct task_struct, sibling);
            seq_printf(archivo, "\t\t {\n");
            seq_printf(archivo, "\t\t\t \"pid\": %d,\n", child->pid);
            seq_printf(archivo, "\t\t\t \"nombre\": \"%s\"\n", child->comm);
            seq_printf(archivo, "\t\t}");
            cont2++;
        }
        seq_printf(archivo, "\n\t\t]\n");
        seq_printf(archivo, "\t}");
        cont1++;
    }

    seq_printf(archivo, "\n]");

    return 0;
}

// Funcion que se ejecutara cada vez que se lea el archivo con el comando CAT
static int al_abrir(struct inode *inode, struct file *file)
{
    return single_open(file, escribir_archivo, NULL);
}

// Si el kernel es 5.6 o mayor se usa la estructura proc_ops
static struct proc_ops operaciones =
    {
        .proc_open = al_abrir,
        .proc_read = seq_read};

// Funcion a ejecuta al insertar el modulo en el kernel con insmod
static int _insert(void)
{
    proc_create("cpu_202004725", 0, NULL, &operaciones);
    printk(KERN_INFO "Yeinny Melissa Catalan de Leon\n");
    return 0;
}

// Funcion a ejecuta al remover el modulo del kernel con rmmod
static void _remove(void)
{
    remove_proc_entry("cpu_202004725", NULL);
    printk(KERN_INFO "Segundo Semestre 2023\n");
}

module_init(_insert);
module_exit(_remove);