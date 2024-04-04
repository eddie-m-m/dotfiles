# general aliases
alias cddf='cd ~/.dotfiles'
alias c='clear'
alias ll='ls -l'
alias la='ls -a'
alias lla='ls -la'
alias mkalias='vim ~/.dotfiles/bash_aliases.sh'
alias rebash='source ~/.bash_profile'
alias revim='~/.dotfiles/revim'
alias bserv='brew services'
alias pg_start='brew services start postgresql@16'
alias bu='brew update && brew upgrade'
alias pg_stop='brew services stop postgresql@16'

# program aliases
alias p='pnpm'
alias py='python3'
alias pip='pip3'
alias pipupgrade='pip install --upgrade pip'
alias pyut='python3 -m unittest'
alias pyvenv='python3 -m venv'
alias mkvenv='python3 -m venv venv'
alias runvenv='. venv/bin/activate'


# git aliases
alias com='git commit -m'
alias gpu='git push -u origin'
alias gco='git checkout'
alias gbl='git branch --list'
alias grco='git recentco'
alias gs='git status'
alias gl='git log'
alias lg="git log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"
alias gcl='git config --list'

# vim aliases
alias vimconf='vim ~/.dotfiles/vimconfig.vim'

# docker aliases
alias dc='docker container'
alias dcs='docker container ls'
alias dis='docker images'
alias di='docker image'
alias dp='docker ps'
alias dcom='docker compose'
alias dcomb='docker compose build'
alias dcomd='docker compose down' 
alias dcomr='docker compose run --rm -it'
alias dcomu='docker compose up'
