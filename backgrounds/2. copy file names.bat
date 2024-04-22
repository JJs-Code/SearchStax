@echo off

dir /B | clip

powershell -Command "& { [void] [reflection.assembly]::loadwithpartialname(\"System.Windows.Forms\"); [reflection.assembly]::loadwithpartialname(\"System.Drawing\"); $notify = new-object system.windows.forms.notifyicon; $notify.icon = [System.Drawing.SystemIcons]::Information; $notify.visible = $true; $notify.showballoontip(10,\"Copied!\",\"File names have been copied to the clipboard\",[system.windows.forms.tooltipicon]::None); }"
