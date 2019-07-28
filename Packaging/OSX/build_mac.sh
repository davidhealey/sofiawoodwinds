# MACOS BUILD SCRIPT

project=Sofia\ Woodwinds
version=1.1.1
xmlFile=sofiaWoodwinds
workspace=/Volumes/SHARED/HISEProjects/Sofia\ Woodwinds

build_standalone=0
build_plugin=0
build_installer=1
clean_project=0

hise_path=/Volumes/SHARED/HISE/projects/standalone/Builds/MacOSX/build/Release/HISE.app/Contents/MacOS/HISE
projucer_path=/Volumes/SHARED/HISE/tools/projucer/Projucer.app/Contents/MacOS/Projucer
PACKAGES_BUILD=/usr/local/bin/packagesbuild

cd "$workspace"

# STEP 1: BUILDING THE BINARIES
# ====================================================================
if (($build_standalone == 1 || $build_plugin == 1))
then
  "$hise_path" set_project_folder -p:$workspace

  if (($clean_project == 1))
  then
     "$hise_path" clean -p:$workspace --all
  fi

  echo Making the Projucer accessible for this project
  chmod +x "$projucer_path"

  if (($build_standalone==1))
  then
    echo Building the standalone app
    "$hise_path" export_ci XmlPresetBackups/$xmlFile.xml -t:standalone -a:x64
    chmod +x "Binaries/batchCompileOSX"
    sh "Binaries/batchCompileOSX"
  fi

  if (($build_plugin==1))
  then
    echo Building the plugins
    "$hise_path" export_ci XmlPresetBackups/$xmlFile.xml -t:instrument -p:VST_AU -a:x64
    chmod +x "Binaries/batchCompileOSX"
    sh "Binaries/batchCompileOSX"
  fi
fi

# STEP 2: BUILDING INSTALLER
# ====================================================================

if (($build_installer==1))
then
  echo "Build Installer"
  mkdir -p "$workspace"/Installer
  $PACKAGES_BUILD "Packaging/OSX/$project.pkgproj"
  cp "$workspace"/Packaging/OSX/build/"$project".pkg "$workspace"/Installer/"$project"\ "$version".pkg

  echo "Cleanup"
  rm -rf "$workspace"/Packaging/OSX/build
else
  echo "Skip Building Installer"
fi
