@echo off
setlocal enabledelayedexpansion

REM ---- CONFIG ----
set DOCKER_USER=thibaultkine
set API_NAME=dkbldr-api
set APP_NAME=dkbldr-app
REM ---- Generate TAG (yyyyMMddHHmmss)
for /f "tokens=2 delims==" %%I in ('"wmic os get localdatetime /value"') do set ldt=%%I
set TAG=%ldt:~0,14%

REM ---- BUILD API ----
echo Building API...
docker build -t %DOCKER_USER%/%API_NAME%:%TAG% ./api

REM ---- PUSH API ----
echo Pushing API image...
docker push %DOCKER_USER%/%API_NAME%:%TAG%

REM ---- BUILD APP ----
echo Building App...
docker build -t %DOCKER_USER%/%APP_NAME%:%TAG% ./

REM ---- PUSH APP ----
echo Pushing App image...
docker push %DOCKER_USER%/%APP_NAME%:%TAG%

echo Deployment images pushed successfully!
echo Use tag %TAG% on Railway for deployment.
