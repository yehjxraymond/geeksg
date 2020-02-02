# Environment Setup

https://spaceraccoon.dev/from-checkra1n-to-frida-ios-app-pentesting-quickstart-on-ios-13

## SSH over USB

```sh
iproxy 2222 22
```

## Application Decryption/Dumping

Installing Frida iOS Dump

```sh
git clone https://github.com/AloneMonkey/frida-ios-dump.git && cd frida-ios-dump
sudo pip3 install -r requirements.txt --upgrade
```

Dumping app from memory

```sh
./dump.py <APP DISPLAY NAME OR BUNDLE IDENTIFIER>
```

## Recon

List all application on phone

```sh
frida-ps -Uai
```
