#!/bin/bash

SESSION_NAME="ghostty-$(date +%s)"

tmux new-session -s "$SESSION_NAME"
