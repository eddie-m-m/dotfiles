require "nvchad.mappings"

-- add yours here

local map = vim.keymap.set

map("n", ";", ":", { desc = "CMD enter command mode" })
map({ "v", "i" }, "jk", "<ESC>")
map(
    "n",
    "<leader>mp",
    ":!viv " .. vim.fn.expand "%:p" .. "<CR>",
    { noremap = true, silent = true }
)
map(
    "n",
    "<leader>dg",
    "<cmd>lua vim.diagnostic.open_float()<CR>",
    { noremap = true, silent = true }
)
map(
    "n",
    "<leader>dgn",
    "<cmd>lua vim.diagnostic.goto_next()<CR>",
    { noremap = true, silent = true }
)
map(
    "n",
    "<leader>dgp",
    "<cmd>lua vim.diagnostic.goto_prev()<CR>",
    { noremap = true, silent = true }
)

-- map({ "n", "i", "v" }, "<C-s>", "<cmd> w <cr>")
