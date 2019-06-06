[Setup]
#define AppName "Sofia Woodwinds"
AppName={#AppName}
AppVersion=1.1.0

DefaultDirName={pf}\Libre Wave\Sofia Woodwinds
DefaultGroupName={#AppName}
Compression=lzma2
SolidCompression=yes
OutputDir=.\build
ArchitecturesInstallIn64BitMode=x64
OutputBaseFilename={#AppName} Installer 1.1.0
LicenseFile=EULA.txt
PrivilegesRequired=admin

SetupLogging=yes
ChangesAssociations=no

[Types]
Name: "full"; Description: "Full installation"
Name: "custom"; Description: "Custom installation"; Flags: iscustom

[Dirs]
Name: "{app}\"; Permissions: users-modify powerusers-modify admins-modify system-modify

[Components]
Name: "app"; Description: "{#AppName} Standalone application"; Types: full custom;
Name: "vst2_32"; Description: "{#AppName} 32-bit VSTi Plugin"; Types: full custom;
Name: "vst2_64"; Description: "{#AppName} 64-bit VSTi Plugin"; Types: full custom; Check: Is64BitInstallMode;
;BEGIN_AAX
;Name: "aax"; Description: "{#AppName} AAX Plugin"; Types: full custom;
;END_AAX

[Files]

; Standalone
Source: "build\App\{#AppName} x86.exe"; DestDir: "{app}"; Flags: ignoreversion; Components: app; Check: not Is64BitInstallMode
Source: "build\App\{#AppName} x64.exe"; DestDir: "{app}"; Flags: ignoreversion; Components: app; Check: Is64BitInstallMode

; VST
Source: "build\VST\{#AppName} x86.dll"; DestDir: "{code:GetVST2Dir_32}"; Flags: ignoreversion; Components: vst2_32; Check: not Is64BitInstallMode

Source: "build\VST\{#AppName} x86.dll"; DestDir: "{code:GetVST2Dir_32}"; Flags: ignoreversion; Components: vst2_32; Check: Is64BitInstallMode
Source: "build\VST\{#AppName} x64.dll"; DestDir: "{code:GetVST2Dir_64}"; Flags: ignoreversion; Components: vst2_64; Check: Is64BitInstallMode

;BEGIN_AAX
;Source: "build\AAX\{#AppName}.aaxplugin\*.*"; DestDir: "{cf}\Avid\Audio\Plug-Ins\{#AppName}.aaxplugin\"; Flags: ignoreversion recursesubdirs; Components: aax
;END_AAX

[Icons]
Name: "{group}\{#AppName}"; Filename: "{app}\{#AppName} x64.exe"; Check: Is64BitInstallMode
Name: "{group}\{#AppName}"; Filename: "{app}\{#AppName} x86.exe"; Check: not Is64BitInstallMode
Name: "{group}\Uninstall {#AppName}"; Filename: "{app}\unins000.exe"

[Code]
var
  OkToCopyLog : Boolean;
  VST2DirPage_32: TInputDirWizardPage;
  VST2DirPage_64: TInputDirWizardPage;

procedure InitializeWizard;

begin

  if IsWin64 then begin
    VST2DirPage_64 := CreateInputDirPage(wpSelectDir,
    'Confirm 64-Bit VST2 Plugin Directory', '',
    'Select the folder in which setup should install the 64-bit VST2 Plugin, then click Next.',
    False, '');
    VST2DirPage_64.Add('');
    VST2DirPage_64.Values[0] := ExpandConstant('{reg:HKLM\SOFTWARE\VST,VSTPluginsPath|{pf}\Steinberg\VSTPlugins}\');

    VST2DirPage_32 := CreateInputDirPage(wpSelectDir,
      'Confirm 32-Bit VST2 Plugin Directory', '',
      'Select the folder in which setup should install the 32-bit VST2 Plugin, then click Next.',
      False, '');
    VST2DirPage_32.Add('');
    VST2DirPage_32.Values[0] := ExpandConstant('{reg:HKLM\SOFTWARE\WOW6432NODE\VST,VSTPluginsPath|{pf32}\Steinberg\VSTPlugins}\');
  end else begin
    VST2DirPage_32 := CreateInputDirPage(wpSelectDir,
      'Confirm 32-Bit VST2 Plugin Directory', '',
      'Select the folder in which setup should install the 32-bit VST2 Plugin, then click Next.',
      False, '');
    VST2DirPage_32.Add('');
    VST2DirPage_32.Values[0] := ExpandConstant('{reg:HKLM\SOFTWARE\VST,VSTPluginsPath|{pf}\Steinberg\VSTPlugins}\');
  end;
end;

function GetVST2Dir_32(Param: String): String;
begin
  Result := VST2DirPage_32.Values[0]
end;

function GetVST2Dir_64(Param: String): String;
begin
  Result := VST2DirPage_64.Values[0]
end;

procedure CurStepChanged(CurStep: TSetupStep);
begin
  if CurStep = ssDone then
    OkToCopyLog := True;
end;

procedure DeinitializeSetup();
begin
  if OkToCopyLog then
    FileCopy (ExpandConstant ('{log}'), ExpandConstant ('{app}\InstallationLogFile.log'), FALSE);
  RestartReplace (ExpandConstant ('{log}'), '');
end;

[UninstallDelete]
Type: files; Name: "{app}\InstallationLogFile.log"
