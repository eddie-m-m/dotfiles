set mouse=a
set number
set relativenumber
set clipboard=unnamed
set nocompatible
filetype on
syntax on
filetype indent on
set background=dark
set wildmenu
set wildmode=list:full
set wildignore+=.*,*.docx,*.jpg,*.png,*.gif,*.pdf,*.pyc,*.exe,*.flv,*.img,*.xlsx
set expandtab
set tabstop=4
set softtabstop=4
set shiftwidth=4
set autoindent
set cindent
set noexpandtab
set incsearch
set ignorecase
set smartcase
set showcmd
set showmode
set showmatch
set hlsearch

let &t_SI = "\e[5 q"
let &t_EI = "\e[1 q"

" MAPPINGS
inoremap jk <esc>
xnoremap jk <esc>
nnoremap ; :

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
