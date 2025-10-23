#!/bin/bash

update_vpn_status() {
    VPN_INFO=$(nmcli -t -f NAME,DEVICE,TYPE connection show --active | grep -E ':vpn|:wireguard' | head -n 1)

    if [ -n "$VPN_INFO" ]; then
        VPN_NAME=$(echo "$VPN_INFO" | cut -d ':' -f 1)
        VPN_DEVICE=$(echo "$VPN_INFO" | cut -d ':' -f 2)

        VPN_GW=$(nmcli -t -f IP4.GATEWAY device show "$VPN_DEVICE" 2>/dev/null | cut -d ':' -f 2)

        TOOLTIP="Connected to: $VPN_NAME"
        if [ -n "$VPN_GW" ]; then
            TOOLTIP="$TOOLTIP ($VPN_GW)"
        fi

        printf '{"text": " ", "tooltip": "%s", "class": "vpn-connected"}\n' "$TOOLTIP"
    else
        printf '{"text": "󰦏", "tooltip": "VPN Disconnected", "class": "vpn-disconnected"}\n'
    fi
}

update_vpn_status

stdbuf -oL nmcli monitor | while read -r line; do
    update_vpn_status
done
