# general aliases
alias cddf='cd ~/.dotfiles'
alias ll='ls -l'
alias la='ls -A'
alias mkalias='vim ~/.dotfiles/.bash_aliases'

# program aliases
alias p='pnpm'
alias py='python3'
alias py2='python2'

# git aliases
alias com='git commit -m'
alias gco='git checkout'
alias gs='git status'
alias gl='git log'
alias lg="git log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"

# vim aliases
alias vimconf='vim ~/.dotfiles/vimconfig.vim'

# docker aliases
alias dc='docker container'
alias dcs='docker container ls'
alias dis='docker images'
alias di='docker image'
alias dp='docker ps'
alias dcom='docker compose'
alias dcup='docker compose up'
alias dcdn='docker compose down --remove-orphans'
alias dcr='docker compose run --rm -it'
