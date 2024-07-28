#!/bin/sh

IP=$(echo $1 | egrep "^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$")
KEY_PATH=$2
CRT_PATH=$3

if [ ! $IP ] || [ ! $KEY_PATH ] || [ ! $CRT_PATH ]; then
    echo "Usage: generate-ip-cert.sh <ip> <key_path> <crt_path>"
    exit 1
fi

echo "[req]
default_bits  = 2048
distinguished_name = req_distinguished_name
req_extensions = req_ext
x509_extensions = v3_req
prompt = no

[req_distinguished_name]
countryName = XX
stateOrProvinceName = N/A
localityName = N/A
organizationName = Self-signed certificate
commonName = $IP: Self-signed certificate

[req_ext]
subjectAltName = @alt_names

[v3_req]
subjectAltName = @alt_names

[alt_names]
IP.1 = $IP
" >san.cnf

openssl req -x509 -nodes -days 730 -newkey rsa:2048 -keyout $KEY_PATH -out $CRT_PATH -config san.cnf
rm san.cnf
