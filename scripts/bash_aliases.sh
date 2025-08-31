# general aliases
alias cddf='cd ~/.dotfiles'
alias c='clear'
alias ll='ls -lh'
alias la='ls -ah'
alias lla='ls -lha'

# program aliases
alias py='python3'
alias pip='pip3'
alias pipupgrade='pip install --upgrade pip'
alias pyut='python3 -m unittest'
alias pyvenv='python3 -m venv'
alias mkvenv='python3 -m venv venv'
alias runvenv='. venv/bin/activate'
alias gotest='go test -v'
alias gobuild='go build -o'

# git aliases
alias com='git commit -m'
alias gs='git status'
alias lg="git log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"

# config aliases
alias rebash='source ~/.bashrc'
alias mkalias='vim ~/.dotfiles/scripts/bash_aliases.sh'

alias hidclose='sudo chmod o-rw,g-rw /dev/hidraw*' 
alias hidexpose='sudo chmod a+rw /dev/hidraw*'
alias gethidinfo='bash ~/.dotfiles/scripts/displayhidrawinfo.sh'
