# Waytone Skill Development Centre - Local Web Server
$port = 8000
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")

try {
    $listener.Start()
    Write-Output "=========================================================="
    Write-Output " Waytone Skill Development Centre Website is running at:"
    Write-Output " http://localhost:$port/"
    Write-Output "=========================================================="
} catch {
    Write-Output "Error starting listener on port $port. Attempting port 8001..."
    $port = 8001
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add("http://localhost:$port/")
    $listener.Start()
    Write-Output "Running at http://localhost:$port/"
}

$baseDir = $PSScriptRoot
if ([string]::IsNullOrWhiteSpace($baseDir)) { $baseDir = "C:\waytone-website" }

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $rawPath = $request.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrWhiteSpace($rawPath)) { $rawPath = "index.html" }
        $filePath = Join-Path $baseDir $rawPath

        if (Test-Path $filePath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentType = "text/plain"
            switch ($ext) {
                ".html" { $contentType = "text/html; charset=utf-8" }
                ".js"   { $contentType = "application/javascript; charset=utf-8" }
                ".css"  { $contentType = "text/css; charset=utf-8" }
                ".json" { $contentType = "application/json; charset=utf-8" }
                ".png"  { $contentType = "image/png" }
                ".jpg"  { $contentType = "image/jpeg" }
                ".jpeg" { $contentType = "image/jpeg" }
                ".svg"  { $contentType = "image/svg+xml" }
                ".ico"  { $contentType = "image/x-icon" }
            }
            $response.ContentType = $contentType
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $msg = [System.Text.Encoding]::UTF8.GetBytes("File Not Found")
            $response.OutputStream.Write($msg, 0, $msg.Length)
        }
        $response.OutputStream.Close()
    } catch {
        # continue loop
    }
}
