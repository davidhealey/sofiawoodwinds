@echo off

set project=Sofia Woodwinds
set version=1.1.1
set xmlFile=sofiaWoodwinds
set workspace=/media/john/SHARED/HISEProjects/sofiawoodwinds

set build_standalone=1
set build_plugin=1
set build_installer=1
set clean_project=0

set hise_path="C:\Users\John\Documents\HISE\projects\standalone\Builds\VisualStudio2017\x64\Release\App\HISE.exe"
set installer="C:\Users\John\AppData\Local\Programs\Inno Setup 6\ISCC.exe"

cd %workspace%

REM  ====================================================================================
if %build_standalone% == 1 || %build_plugin% == 1(
	%hise_path% set_project_folder -p:%workspace%
	
	if %clean_project% == 1(
		echo Cleaning project
 		%hise_path% clean -p:%workspace% --all
	)

	if %build_standalone% == 1(
		echo Exporting %plugin_name% Standalone
		%hise_path% export_ci XmlPresetBackups/%xmlFile%.xml -t:standalone -a:x86x64
		call %workspace%/Binaries/batchCompile.bat
	)
	
	if %build_plugin% == 1(
		echo Exporting %plugin_name% Plugins
		%hise_path% export_ci XmlPresetBackups/%xmlFile%.xml -t:instrument -p:VST -a:x86x64
		call %workspace%/Binaries/batchCompile.bat
	)	
)

echo Copying files
REM  ====================================================================================

md build

xcopy /E /Y "Binaries\Compiled\*.*" build\

del /S "build\*.lib"
del /S "build\*.exp"

echo Building installer
REM  ====================================================================================

if %buildInstaller%==1 (
	%hise_path% create-win-installer --noaax
	%installer% WinInstaller.iss
)