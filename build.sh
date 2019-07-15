# MACOS BUILD SCRIPT

project=Sofia\ Woodwinds
xmlFile=sofiaWoodwinds
build_aax=0
build_installer=1

# SET THIS TO 1 WHEN USING BUILD SERVER
skip_build=0
build_server=0
code_sign=1

# ENVIRONMENT VARIABLES (ALREADY SET ON BUILD SERVER)
if (($build_server==0))
then
version=1.1.0
hise_path_macos=/Volumes/SHARED/HISE/projects/standalone/Builds/MacOSX/build/Release/HISE.app/Contents/MacOS/HISE
projucer_macos=/Volumes/SHARED/HISE/tools/projucer/Projucer.app/Contents/MacOS/Projucer
WORKSPACE=/Volumes/SHARED/HISEProjects/sofiawoodwinds
PACKAGES_BUILD=/usr/local/bin/packagesbuild
fi

# STEP 1: BUILDING THE BINARIES
# ====================================================================
if (($skip_build==0))
then
echo $version

"$hise_path_macos" set_project_folder -p:$WORKSPACE

echo Making the Projucer accessible for this project
chmod +x "$projucer_macos"

echo Building the standalone app
"$hise_path_macos" export_ci XmlPresetBackups/$xmlFile.xml -t:standalone -a:x64
chmod +x "Binaries/batchCompileOSX"
sh "Binaries/batchCompileOSX"

echo Building the plugins
"$hise_path_macos" export_ci XmlPresetBackups/$xmlFile.xml -t:instrument -p:VST_AU -a:x64
chmod +x "Binaries/batchCompileOSX"
sh "Binaries/batchCompileOSX"

fi
# STEP 2: SIGNING
# ====================================================================

vst_project=./Binaries/Builds/MacOSX/build/Release/$project.vst
au_project=./Binaries/Builds/MacOSX/build/Release/$project.component
standalone_project=./Binaries/Compiled/$project.app

if (($code_sign==0))
then
echo "Signing"
security list-keychains
security unlock-keychain -p $keychain_password /Users/laboratoryaudio/Library/Keychains/login.keychain

echo "Signing VST & AU"
codesign -s "$APPLE_CERTIFICATE_ID" "$au_project"
codesign -dv --verbose=4 "$au_project"
codesign -s "$APPLE_CERTIFICATE_ID" "$vst_project"
codesign -dv --verbose=4 "$vst_project"

echo "Signing Standalone App"
codesign -s "$APPLE_CERTIFICATE_ID" "$standalone_project"
codesign -dv --verbose=4 "$standalone_project"
fi

# STEP 3: BUILDING INSTALLER
# ====================================================================

if (($build_installer==1))
then
echo "Build Installer"
$PACKAGES_BUILD "Installer/OSX/$project.pkgproj"
installer_name=./$project\ $version.pkg
productsign --sign "$APPLE_CERTIFICATE_ID_INSTALLER" "./Installer/OSX/build/$project.pkg" "$installer_name"
else
echo "Skip Building Installer"
fi