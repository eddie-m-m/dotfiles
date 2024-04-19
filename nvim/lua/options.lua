-- :help options

local options = {
  breakindent = true,
  clipboard = "unnamedplus",
  cmdheight = 2,
  completeopt = { "menuone", "noselect" },
  conceallevel = 0,
  cursorline = true,
  expandtab = true,
  fileencoding = "utf-8",
  hlsearch = true,
  ignorecase = true,
  inccommand = 'split',
  list = true,
  listchars = { tab = '» ', trail = '·', nbsp = '␣' },
  mouse = "a",
  number = true,
  pumheight = 10,
  relativenumber = true,
  scrolloff = 10,
  shiftwidth = 2,
  showmode = false,
  signcolumn = "yes",
  smartcase = true,
  smartindent = true,
  splitbelow = true,
  splitright = true,
  tabstop = 2,
  termguicolors = true,
  timeoutlen = 300,
  updatetime = 250,
  undofile = true,
  wrap = false,
}


for k, v in pairs(options) do
  vim.opt[k] = v
end
