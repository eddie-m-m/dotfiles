set mouse=a

set number

set relativenumber

set clipboard=unnamed

set nocompatible

filetype on

syntax on

filetype indent on

set background=light

set wildmenu

set wildmode=list:full

set wildignore+=.*,*.docx,*.jpg,*.png,*.gif,*.pdf,*.pyc,*.exe,*.flv,*.img,*.xlsx

" space characters in place of tab
set expandtab
set tabstop=4
set softtabstop=4
set shiftwidth=4
set autoindent
set cindent
set noexpandtab

set incsearch

let g:ale_completion_enabled = 0
inoremap <silent> <C-space> <CR>
inoremap <expr> <leader>c coc#start()


call plug#begin('~/.vim/plugged')

    Plug 'dense-analysis/ale'

    Plug 'preservim/nerdtree'

    Plug 'cdelledonne/vim-cmake'

    Plug 'itchyny/lightline.vim'
    
    Plug 'wadackel/vim-dogrun'
    
    Plug 'fatih/vim-go', {'do': ':GoUpdateBinaries'}

    Plug 'preservim/tagbar'

    Plug 'ludovicchabant/vim-gutentags'

    Plug 'tpope/vim-dispatch'

    Plug 'vimwiki/vimwiki'

	Plug 'neoclide/coc.nvim', {'branch': 'release'}

call plug#end()

packadd! termdebug

let g:NERDTreeModifiable = 1

let NERDTreeShowHidden=1
nnoremap <C-n> :NERDTreeToggle<CR>

nnoremap dbg :Termdebug<CR>

let &t_SI = "\e[5 q"
let &t_EI = "\e[1 q"

set ignorecase
set smartcase
set showcmd
set showmode
set showmatch
set hlsearch

"inoremap <expr> <Tab> pumvisible() ? "\<C-n>" : "\<Tab>"
"inoremap <expr> <S-Tab> pumvisible() ? "\<C-p>" : "\<S-Tab>"
"inoremap <expr> <cr> pumvisible() ? asyncomplete#close_popup() : "\<cr>"
"nnoremap gd :GoDoc<CR>


" MAPPINGS
inoremap jk <esc>
xnoremap jk <esc>
nnoremap ; :

" VIMSCRIPT 

" enable code folding with marker method

augroup c_cpp_folding
	autocmd!
	autocmd Filetype c,cpp setlocal foldmethod=syntax
augroup END

augroup python_folding
	autocmd!
	autocmd Filetype py setlocal foldmethod=indent
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

nnoremap <F2> :TagbarToggle<CR>

colorscheme dogrun

" Build system
let g:cmake_build_dir_location = 'build'
let g:cmake_build_type = 'Debug'

let c_opts = '-std=c17 -Wall'
let cpp_opts = '-std=c++23 -Wall -Wextra'

let g:ale_fix_on_save = 1

let g:ale_fixers = {
			\'c' : ['clang-format'],
			\'cpp': ['clang-format']
			\}

let g:ale_lint_on_save = 1

" for c, cpp, rust

"let g:ale_pattern_options_enabled = 1

let g:ale_linters = {
			\'c': ['cc', 'gcc', 'clang'],
			\'cpp': ['cc','gcc','clang'],
			\'rust': ['analyzer']
			\}

let g:ale_c_cc_options = c_opts
let g:ale_c_gcc_options = c_opts
let g:ale_c_clang_options = c_opts
let g:ale_cpp_cc_options = cpp_opts
let g:ale_cpp_gcc_options = cpp_opts
let g:ale_cpp_clang_options = cpp_opts
