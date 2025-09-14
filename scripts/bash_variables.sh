export EDITOR=vim
export VISUAL="$EDITOR"


# Initialize Path
PATH=/usr/local/bin:/usr/local/sbin:/usr/bin:/bin:/usr/sbin:/sbin
export PATH
PATH=$PATH:$HOME/.dotfiles/bin:$HOME/.cargo/bin:$PATH
if [[ "$OSTYPE" == "darwin"* ]]; then
    eval "$(/opt/homebrew/bin/brew shellenv)"
    export EDITOR=vim
    export BASH_SILENCE_DEPRECATION_WARNING=1
    export REDIS_URL=redis://localhost:6379/0
fi
