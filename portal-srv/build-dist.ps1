$mainDir = $(Get-Location)

$distDir = "$mainDir/public"

$srcDir ="$mainDir/src"

# Requires UglifyJS and UglifyCSS

# JS Files
Remove-Item $distDir/javascripts/ProxiPay.min.js
Set-Location $srcDir/js/xrp
foreach( $jsFile in $(Get-ChildItem $srcDir/js/xrp)){
    npx uglifyjs $jsFile >> $distDir/javascripts/ProxiPay.min.js
}
Remove-Item $distDir/javascripts/3rd-party.min.js
Set-Location $srcDir/js/lib
foreach( $jsFile in $(Get-ChildItem $srcDir/js/lib)){
    npx uglifyjs $jsFile >> $distDir/javascripts/3rd-party.min.js
}

# CSS Files
Remove-Item $distDir/stylesheets/ProxiPay.min.css
Set-Location $srcDir/css
foreach($cssFile in $(Get-ChildItem $srcDir/css)){
    npx uglifycss $cssFile >> $distDir/stylesheets/ProxiPay.min.css
}
Remove-Item $distDir/stylesheets/3rd-party.min.css
Set-Location $srcDir/css/lib
foreach ($cssFile in $(Get-ChildItem $srcDir/css/lib)){
    npx uglifycss $cssFile >> $distDir/stylesheets/3rd-party.min.css
}

Set-Location $mainDir
