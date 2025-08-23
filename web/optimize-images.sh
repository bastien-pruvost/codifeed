#!/bin/bash

# Optimize all pngs in ./
# magick input.png -strip -resize 1200x1200\> -quality 85 output.webp

# Find all pngs in ./
for image in $(find ./ -type f -name "*.png"); do
  # Optimize the image
  magick "$img" -strip -resize 1200x1200\> -quality 85 "${img%.png}.webp"
done
