call plug#begin('~/.vim/plugged')

    Plug 'dense-analysis/ale'

    Plug 'preservim/nerdtree'

    Plug 'https://github.com/joshdick/onedark.vim.git'

    Plug 'sheerun/vim-polyglot'

    Plug 'itchyny/lightline.vim'

    Plug 'prabirshrestha/vim-lsp'

    Plug 'prabirshrestha/asyncomplete.vim'

    Plug 'prabirshrestha/asyncomplete-lsp.vim'

    Plug 'mattn/vim-lsp-settings'

    Plug 'fatih/vim-go', {'do': ':GoUpdateBinaries'}

call plug#end()

" add line numbers
set number

" disable compatibility with with vi
set nocompatible

" enable file types
filetype on

" enable plugins and load plugin for the detected file type
filetype plugin on

" load an indent file for the detected file type
filetype indent on

" turn syntax highlighting on
syntax on
colorscheme onedark

" enable auto completion menu after pressing TAB
set wildmenu

" make wildmenu behave similar to bash completion
set wildmode=list:full

" make wildmenu ignore
set wildignore+=.*,*.docx,*.jpg,*.png,*.gif,*.pdf,*.pyc,*.exe,*.flv,*.img,*.xlsx

" tab width
set tabstop=2

" space characters in place of tab
set expandtab

" incrementally highlight characters in search
set incsearch

let NERDTreeShowHidden=1
nnoremap <C-n> :NERDTreeToggle<CR>

let &t_SI = "\e[5 q"
let &t_EI = "\e[1 q"

set ignorecase
set smartcase
set showcmd
set showmode
set showmatch
set hlsearch

let g:lightline = {
  \ 'colorscheme': 'onedark'
  \}

inoremap <expr> <Tab> pumvisible() ? "\<C-n>" : "\<Tab>"
inoremap <expr> <S-Tab> pumvisible() ? "\<C-p>" : "\<S-Tab>"
inoremap <expr> <cr> pumvisible() ? asyncomplete#close_popup() : "\<cr>"
nnoremap gd :GoDoc<CR>


" MAPPINGS
inoremap jf <esc>
xnoremap jf <esc>


" VIMSCRIPT 

" enable code folding with marker method

augroup filetype_vim
	autocmd!
	autocmd Filetype vim setlocal foldmethod=marker
augroup END

" STATUS LINE 

" clear status line on reload
set statusline=

" left status line
set statusline+=\ %F\ %M\ %Y\ %R

" line divider
set statusline+=%=

" right status line
set statusline+=\ ascii:\ %b\ hex:\ 0x%B\ row:\ %l\ col:\ %c\ percent:\ %p%%

" show status line on second-to-last line
set laststatus=2
