#!/bin/bash

HIDRAWDEV=/dev/hidraw*

for dev in $HIDRAWDEV
do
  DEVFILE=${dev##*/}
  DEVICE="$(cat /sys/class/hidraw/${DEVFILE}/device/uevent | grep HID_NAME | cut -d '=' -f2)"
  printf "%s \t %s\n" $DEVFILE "$DEVICE"
done
