@echo off
title Waytone Skill Development Centre Website
echo Starting Waytone Skill Development Centre Website on Port 8000...
start http://localhost:8000/
powershell -ExecutionPolicy Bypass -File "%~dp0server.ps1"
pause
