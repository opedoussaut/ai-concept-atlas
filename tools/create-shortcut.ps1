<#
    AI Concept Atlas - create a desktop shortcut.

    Run once:
        powershell -ExecutionPolicy Bypass -File "tools\create-shortcut.ps1"

    By default the shortcut opens the PUBLISHED atlas:
        https://opedoussaut.github.io/ai-concept-atlas/

    Use -Local to open your working copy off disk instead.

    WHY THE PUBLISHED SITE IS THE DEFAULT
    This atlas exists to be shared. Every concept has a link you can paste into
    a deck, a message or a post - and a link copied from a local file reads
    file:///E:/users/... which is useless to anyone but you. Opening the live
    site means every "Copy concept link" produces something you can actually
    send. -Local is there for a plane, or for checking a change before pushing.

    THIS FILE MUST STAY PURE ASCII.
    Windows PowerShell 5.1 (powershell.exe) reads a .ps1 as Windows-1252 unless
    it carries a UTF-8 BOM. An em dash written as UTF-8 therefore arrives as
    three garbage characters and breaks the parser. No em dashes, no curly
    quotes, no accented characters. tools/validate.mjs fails on any of them.

    WHY IT TARGETS A BROWSER RATHER THAN A URL OR AN .html FILE
    Windows only lets you pin a shortcut to the taskbar when its target is an
    executable. So the target is the browser, launched in app mode with the
    atlas as its argument. Same result, and it pins.

    -Local   point at the working copy on this machine instead of the live site
    -Force   overwrite an existing shortcut
    -Name    shortcut name (default "AI Concept Atlas")
#>

[CmdletBinding()]
param(
    [switch]$Local,
    [switch]$Force,
    [string]$Name = "AI Concept Atlas"
)

$ErrorActionPreference = "Stop"

$root    = Split-Path -Parent $PSScriptRoot
$index   = Join-Path $root "index.html"
$icon    = Join-Path $root "assets\ai-atlas.ico"
$liveUrl = "https://opedoussaut.github.io/ai-concept-atlas/"

if ($Local) {
    if (-not (Test-Path $index)) {
        throw "Could not find index.html next to this script. Expected it at: $index"
    }
    # file:///E:/path/to/index.html - forward slashes, spaces escaped.
    $target = ([System.Uri]$index).AbsoluteUri
    $where  = "your local working copy ($index)"
} else {
    $target = $liveUrl
    $where  = "the published atlas ($liveUrl)"
}

# Prefer Chrome, then Edge. Both support --app=, which is what gives the atlas
# its own window. Edge ships with Windows, so the fallback is safe.
$browsers = @(
    "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
    "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe",
    "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe",
    "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe",
    "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe"
)
$browser = $browsers | Where-Object { Test-Path $_ } | Select-Object -First 1

$desktop  = [Environment]::GetFolderPath("Desktop")
$linkPath = Join-Path $desktop "$Name.lnk"

if ((Test-Path $linkPath) -and (-not $Force)) {
    Write-Host "A shortcut called '$Name' is already on your Desktop." -ForegroundColor Yellow
    Write-Host "Re-run with -Force to replace it."
    exit 0
}

$shell    = New-Object -ComObject WScript.Shell
$shortcut = $shell.CreateShortcut($linkPath)

if ($browser) {
    $browserName = Split-Path -Leaf $browser
    $shortcut.TargetPath = $browser
    # --app strips the browser UI, so the atlas gets its own window and its own
    # taskbar entry rather than joining the main browser's group.
    $shortcut.Arguments  = '--app="' + $target + '"'
    $mode = "$browserName in app mode, its own window, no browser chrome"
} elseif ($Local) {
    # No Chrome or Edge. Point at the file and let Windows choose; this still
    # opens the atlas, it just cannot be pinned to the taskbar.
    $shortcut.TargetPath = $index
    $mode = "your default browser (no Chrome or Edge found, so this variant cannot be pinned)"
} else {
    throw "No Chrome or Edge found, so a shortcut to the live site cannot be created. Re-run with -Local to make a shortcut to your working copy instead."
}

$shortcut.WorkingDirectory = $root
$shortcut.Description      = "AI Concept Atlas - from LoRA to MCP."
if (Test-Path $icon) { $shortcut.IconLocation = "$icon,0" }
$shortcut.Save()

Write-Host ""
Write-Host "  Created: $linkPath" -ForegroundColor Green
Write-Host "  Opens:   $where"
Write-Host "  Through: $mode"
Write-Host ""
if (-not $Local) {
    Write-Host "  Links you copy from it are public URLs you can paste anywhere." -ForegroundColor DarkGray
    Write-Host "  Re-run with -Local -Force if you would rather it opened your" -ForegroundColor DarkGray
    Write-Host "  working copy." -ForegroundColor DarkGray
    Write-Host ""
}
Write-Host "  To put it on the taskbar: right-click the new Desktop icon, then" -ForegroundColor Cyan
Write-Host "  'Pin to taskbar'. On Windows 11 that may sit under 'Show more" -ForegroundColor Cyan
Write-Host "  options' first. Windows blocks apps from pinning on your behalf," -ForegroundColor Cyan
Write-Host "  so that last click has to be yours." -ForegroundColor Cyan
Write-Host ""
