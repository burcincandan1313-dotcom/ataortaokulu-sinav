@echo off
chcp 65001 >nul
echo [Ata Ortaokulu Asistan] Sistem baslatiliyor...

echo Eski acik sunucular temizleniyor...
taskkill /F /IM node.exe >nul 2>&1

if not exist "node_modules" (
  echo Bagimliliklar yukleniyor...
  call npm install
)

echo Sunucu aciliyor... Lutfen siyah ekrani kapatmayiniz!
start "Ata Sunucu" cmd.exe /k "npm run dev"

echo 6 saniye bekleniyor...
ping 127.0.0.1 -n 7 > nul

start http://localhost:5173/?fresh=1
