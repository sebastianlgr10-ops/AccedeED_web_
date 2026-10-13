Add-Type -AssemblyName System.Drawing
$filePath = 'C:/Users/elseb/.gemini/antigravity/brain/a05c8cea-b3d1-4c44-bb7a-e000e83b3565/.user_uploaded/media_1790797565117.png'
$bmp = [System.Drawing.Bitmap]::FromFile($filePath)

Write-Output "Image size: $($bmp.Width) x $($bmp.Height)"

# Let's inspect rows from top to bottom
$ySteps = @(10, 30, 60, 100, 150, 200, 250, 310, 360, 420, 480, 530, 600, 670, 740, 800, 860, 920, 980)

foreach ($y in $ySteps) {
    $colors = @()
    for ($x = 10; $x -lt $bmp.Width; $x += 40) {
        $c = $bmp.GetPixel($x, $y)
        $colors += ("#{0:X2}{1:X2}{2:X2}" -f $c.R, $c.G, $c.B)
    }
    Write-Output "Y=$y : $($colors -join ' ')"
}
$bmp.Dispose()
