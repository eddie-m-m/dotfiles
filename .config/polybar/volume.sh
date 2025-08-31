#!/bin/bash

VOLUME=$(amixer get Master | grep -o '[0-9]*%' | head -n 1)
MUTE=$(amixer get Master | grep -o '$$on$$\|$$off$$' | head -n 1)

if [ "$MUTE" == "off" ]; then
    echo " Muted"  
else
    echo " $VOLUME" 
fi
