-- Keymaps are automatically loaded on the VeryLazy event
-- Default keymaps that are always set: https://github.com/LazyVim/LazyVim/blob/main/lua/lazyvim/config/keymaps.lua
-- Add any additional keymaps here
local keymap = vim.keymap.set

local opts = { noremap = true, silent = true }

keymap({ "n", "v" }, ";", ":", { noremap = true })

keymap("i", "jk", "<Esc>", opts)
keymap("v", "jk", "<Esc>", opts)
