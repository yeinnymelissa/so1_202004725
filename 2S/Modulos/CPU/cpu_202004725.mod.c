#include <linux/module.h>
#define INCLUDE_VERMAGIC
#include <linux/build-salt.h>
#include <linux/elfnote-lto.h>
#include <linux/export-internal.h>
#include <linux/vermagic.h>
#include <linux/compiler.h>

BUILD_SALT;
BUILD_LTO_INFO;

MODULE_INFO(vermagic, VERMAGIC_STRING);
MODULE_INFO(name, KBUILD_MODNAME);

__visible struct module __this_module
__section(".gnu.linkonce.this_module") = {
	.name = KBUILD_MODNAME,
	.init = init_module,
#ifdef CONFIG_MODULE_UNLOAD
	.exit = cleanup_module,
#endif
	.arch = MODULE_ARCH_INIT,
};

#ifdef CONFIG_RETPOLINE
MODULE_INFO(retpoline, "Y");
#endif


static const struct modversion_info ____versions[]
__used __section("__versions") = {
	{ 0x122c3a7e, "_printk" },
	{ 0x5b8239ca, "__x86_return_thunk" },
	{ 0xce4f6bb6, "single_open" },
	{ 0xac0dde12, "remove_proc_entry" },
	{ 0xd65b4e21, "seq_printf" },
	{ 0xcbeac83e, "init_task" },
	{ 0x32e05e7f, "get_task_mm" },
	{ 0xe1b1a674, "mmput" },
	{ 0x87a21cb3, "__ubsan_handle_out_of_bounds" },
	{ 0xd8e57183, "seq_read" },
	{ 0xbdfb6dbb, "__fentry__" },
	{ 0x45db931b, "proc_create" },
	{ 0x453e7dc, "module_layout" },
};

MODULE_INFO(depends, "");


MODULE_INFO(srcversion, "9E68ED1EC175A6E27B89F16");
