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

" highlight cursors
set cursorline

" enable auto completion menu after pressing TAB
set wildmenu

" make wildmenu behave similar to bash completion
set wildmode=list:longest

" make wildmenu ignore
set wildignore=*.docx,*.jpg,*.png,*.gif,*.pdf,*.pyc,*.exe,*.flv,*.img,*.xlsx

" tab width
set tabstop=4

" space characters in place of tab
set expandtab

" incrementally highlight characters in search
set incsearch

set ignorecase
set smartcase
set showcmd
set showmode
set showmatch
set hlsearch


" PLUGINS -------------------------------------------------------------------- {{{

call plug#begin('~/.vim/plugged')

    Plug 'dense-analysis/ale'

    Plug 'preservim/nerdtree'

call plug#end()

" }}}


" MAPPINGS ------------------------------------------------------------------- {{{

inoremap jj <esc>
" }}}


" VIMSCRIPT ------------------------------------------------------------------ {{{

" enable code folding with marker method

augroup filetype_vim
	autocmd!
	autocmd Filetype vim setlocal foldmethod=marker
augroup END


" }}}


" STATUS LINE ---------------------------------------------------------------- {{{

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
" }}}
