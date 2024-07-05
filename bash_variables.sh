export EDITOR=nvim
export VISUAL="$EDITOR"
export BASH_SILENCE_DEPRECATION_WARNING=1
export REDIS_URL=redis://localhost:6379/0


# Initialize Path
PATH=/usr/local/bin:/usr/local/sbin:/usr/bin:/bin:/usr/sbin:/sbin
export PATH
PATH=$PATH:$HOME/.dotfiles/bin:$HOME
if [[ "$OSTYPE" == "darwin"* ]]; then
    eval "$(/opt/homebrew/bin/brew shellenv)"
fi
