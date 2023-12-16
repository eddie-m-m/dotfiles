export EDITOR=vim
export VISUAL="$EDITOR"
export BASH_SILENCE_DEPRECATION_WARNING=1

# Initialize Path
PATH=/usr/local/bin:/usr/local/sbin:/usr/bin:/bin:/usr/sbin:/sbin
export PATH
PATH=$PATH:$HOME/.dotfiles/bin:$HOME/Library/Python/3.9/bin

eval "$(/opt/homebrew/bin/brew shellenv)"
