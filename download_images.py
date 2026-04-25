#!/usr/bin/env python3
"""
Download all required images from Unsplash for the Himalyan Organic Farm website.
Run this script from the Organic directory: python download_images.py
"""

import os
import urllib.request
import urllib.error
from pathlib import Path

# Base directory
BASE_DIR = Path(__file__).parent

# Create directories
DIRS = {
    'hero': BASE_DIR / 'assets' / 'images' / 'hero',
    'products': BASE_DIR / 'assets' / 'images' / 'products',
    'gallery': BASE_DIR / 'assets' / 'images' / 'gallery',
}

# Create all directories
for dir_path in DIRS.values():
    dir_path.mkdir(parents=True, exist_ok=True)
    print(f"✓ Directory ready: {dir_path}")

# Image URLs and target locations
IMAGES = {
    'hero/hero-field.jpg': 'https://images.unsplash.com/photo-1500382017468-f049863256f0?w=900&h=700&fit=crop&q=80&auto=format',
    'hero/farmers-network.jpg': 'https://images.unsplash.com/photo-1488459716781-6918f33ee3b2?w=900&h=700&fit=crop&q=80&auto=format',
    'products/finger-millet.jpg': 'https://images.unsplash.com/photo-1585518419759-5e9832bda1a2?w=700&h=520&fit=crop&q=80&auto=format',
    'products/barnyard-millet.jpg': 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=700&h=520&fit=crop&q=80&auto=format',
    'products/millet-flour.jpg': 'https://images.unsplash.com/photo-1599599810694-b5ac4dd5ccf1?w=700&h=520&fit=crop&q=80&auto=format',
    'gallery/gallery-1.jpg': 'https://images.unsplash.com/photo-1625246333195-78d9c38ad576?w=1200&h=800&fit=crop&q=80&auto=format',
    'gallery/gallery-2.jpg': 'https://images.unsplash.com/photo-1516321318423-f06f70030203?w=1200&h=800&fit=crop&q=80&auto=format',
    'gallery/gallery-3.jpg': 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1200&h=800&fit=crop&q=80&auto=format',
}

# Headers to mimic a browser request
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
}

print("\n" + "="*60)
print("Downloading Images for Himalyan Organic Farm")
print("="*60 + "\n")

successful = 0
failed = 0

for filename, url in IMAGES.items():
    filepath = BASE_DIR / 'assets' / 'images' / filename
    
    try:
        print(f"Downloading: {filename}...", end=" ")
        
        # Create request with headers
        request = urllib.request.Request(url, headers=HEADERS)
        
        # Download the image
        with urllib.request.urlopen(request, timeout=30) as response:
            with open(filepath, 'wb') as out_file:
                out_file.write(response.read())
        
        # Check file size
        file_size = filepath.stat().st_size / 1024  # KB
        print(f"✓ ({file_size:.1f} KB)")
        successful += 1
        
    except urllib.error.HTTPError as e:
        print(f"✗ HTTP Error {e.code}")
        failed += 1
    except urllib.error.URLError as e:
        print(f"✗ URL Error: {e.reason}")
        failed += 1
    except Exception as e:
        print(f"✗ Error: {e}")
        failed += 1

print("\n" + "="*60)
print(f"Download Summary: {successful} successful, {failed} failed")
print("="*60 + "\n")

if failed == 0:
    print("✓ All images downloaded successfully!")
    print("✓ Images are now stored locally in assets/images/")
    print("✓ HTML files already point to these local images")
else:
    print("⚠ Some downloads failed. Please check your internet connection.")
    print("⚠ You can manually download images from Unsplash and save them to:")
    for subdir, path in DIRS.items():
        print(f"  - {path}")
