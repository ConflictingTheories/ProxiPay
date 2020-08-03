#!/bin/sh
/usr/sbin/init
# Start Ripple Node
systemctl daemon-reload
systemctl enable rippled
systemctl start rippled