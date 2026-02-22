# Guide to Convert HEIC Images to JPG

Your flat photos are currently in HEIC format (Apple's image format). To display them on the web, they need to be converted to JPG.

## 🚀 Quick Methods

### Method 1: Online Converter (Easiest - Recommended)

1. Visit **https://heictojpg.com/** or **https://convertio.co/heic-jpg/**
2. Upload all 18 HEIC files from `public/images/byt/`
3. Download the converted JPG files
4. Replace the HEIC files in `public/images/byt/` with the JPG files
5. Keep the same filenames (just change extension from .heic to .jpg)

**Files to convert:**
- chodba.heic → chodba.jpg
- jidelini_kout1a.heic → jidelini_kout1a.jpg
- jidelni_kout1b.heic → jidelni_kout1b.jpg
- koupelna1a.heic → koupelna1a.jpg
- koupelna1b.heic → koupelna1b.jpg
- kuchynsky_kout.heic → kuchynsky_kout.jpg
- lodzie.heic → lodzie.jpg
- loznice1a.heic → loznice1a.jpg
- loznice1b.heic → loznice1b.jpg
- loznice2.heic → loznice2.jpg
- obyvak1a.heic → obyvak1a.jpg
- obyvak1b.heic → obyvak1b.jpg
- obyvak1c.heic → obyvak1c.jpg
- obyvak1d.heic → obyvak1d.jpg
- predsin.heic → predsin.jpg
- satna1a.heic → satna1a.jpg
- satna1b.heic → satna1b.jpg
- zachod.heic → zachod.jpg

### Method 2: Windows Photos App

1. Open each HEIC file in Windows Photos app
2. Click the three dots (...) menu
3. Select "Save as"
4. Choose JPG format
5. Save with the same filename in `public/images/byt/`

### Method 3: ImageMagick (Command Line)

If you have ImageMagick installed:

```powershell
cd public\images\byt
magick mogrify -format jpg -quality 85 *.heic
```

### Method 4: Install ImageMagick

1. Download from: https://imagemagick.org/script/download.php#windows
2. Install ImageMagick
3. Run the PowerShell script: `.\convert-images.ps1`

## ✅ After Conversion

Once you have the JPG files:

1. Place them in `public/images/byt/` folder
2. You can delete the HEIC files (optional)
3. Start the dev server: `pnpm start`
4. Visit: http://localhost:4321/byt
5. Check that all images display correctly

## 🌐 Testing the Page

**Local development:**
```bash
pnpm start
```
Then visit: http://localhost:4321/byt

**Production:**
After deployment, the page will be available at:
https://elendris.cz/byt

## 📝 Notes

- The page is already created and ready to use
- It references JPG files (not HEIC)
- Once images are converted, everything will work automatically
- The page is responsive and looks great on mobile and desktop
