export EDITOR=vim
export VISUAL="$EDITOR"
export BASH_SILENCE_DEPRECATION_WARNING=1

# Initialize Path
PATH=/usr/local/bin:/usr/local/sbin:/usr/bin:/bin:/usr/sbin:/sbin
export PATH
PATH=$PATH:$HOME/.dotfiles/bin

eval "$(/usr/local/bin/brew shellenv)"