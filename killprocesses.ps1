# Free the dev server port
$ports = @(3000)

foreach ($port in $ports) {
    Write-Host "Scanning for processes using port $port ..."

    $lines = netstat -ano | findstr ":$port "

    if (!$lines) {
        Write-Host "  No processes on port $port."
        continue
    }

    $procIds = @()
    foreach ($line in $lines) {
        $parts = $line -split "\s+"
        $id = $parts[-1]
        if ($id -match '^\d+$') {
            $procIds += $id
        }
    }

    $procIds = $procIds | Select-Object -Unique
    Write-Host "  Found PIDs: $($procIds -join ', ')"

    foreach ($procId in $procIds) {
        Write-Host "  Killing PID $procId"
        taskkill /PID $procId /F 2>$null | Out-Null
    }
}

Write-Host "Done. Run: npm run dev"
