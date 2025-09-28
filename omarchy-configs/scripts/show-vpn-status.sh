#!/bin/bash

VPN_NAME=$(nmcli -t -f NAME,TYPE connection show --active | grep -E ':vpn|:wireguard' | cut -d ':' -f 1)

if [ -n "$VPN_NAME" ]; then
    printf '{"text": " ", "tooltip": "Connected to: %s", "class": "vpn-connected"}\n' "$VPN_NAME"
else
    printf '{"text": "󰦏", "tooltip": "VPN Disconnected", "class": "vpn-disconnected"}\n'
fi
