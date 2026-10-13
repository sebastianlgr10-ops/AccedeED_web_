Add-Type -AssemblyName System.Drawing
$filePath = 'C:/Users/elseb/.gemini/antigravity/brain/a05c8cea-b3d1-4c44-bb7a-e000e83b3565/.user_uploaded/media_1790797565117.png'
$bmp = [System.Drawing.Bitmap]::FromFile($filePath)
Write-Output "Dimensions: $($bmp.Width) x $($bmp.Height)"

$testPoints = @(
    @{ name = "Bg Top"; x = 20; y = 20 },
    @{ name = "Red Button Nav"; x = 860; y = 14 },
    @{ name = "ODS4 Tag Hero"; x = 120; y = 33 },
    @{ name = "Coral Word Para Cada Estudiante"; x = 180; y = 72 },
    @{ name = "Stats Bar BG"; x = 200; y = 153 },
    @{ name = "Card BG Meta ODS"; x = 180; y = 250 },
    @{ name = "Active Module Tab BG"; x = 180; y = 360 },
    @{ name = "Inactive Module Tab BG"; x = 180; y = 390 },
    @{ name = "Table AccedeED Column"; x = 700; y = 530 },
    @{ name = "CTA Banner Red/Coral"; x = 200; y = 760 },
    @{ name = "QR Card BG"; x = 780; y = 770 },
    @{ name = "FAQ BG"; x = 400; y = 875 },
    @{ name = "Footer BG"; x = 400; y = 960 }
)

foreach ($pt in $testPoints) {
    if ($pt.x -lt $bmp.Width -and $pt.y -lt $bmp.Height) {
        $c = $bmp.GetPixel($pt.x, $pt.y)
        $hex = "#{0:X2}{1:X2}{2:X2}" -f $c.R, $c.G, $c.B
        Write-Output "$($pt.name): $hex (R:$($c.R), G:$($c.G), B:$($c.B))"
    }
}
$bmp.Dispose()
